# HANDOVER REPORT — SofkianOS MVP

## 1. Executive Summary
SofkianOS es un sistema distribuido de alta disponibilidad diseñado para el intercambio de **Kudos** (reconocimientos) en entornos corporativos. La arquitectura ha evolucionado de un monolito acoplado a un ecosistema asíncrono basado en **Event-Driven Architecture (EDA)** y **Arquitectura Hexagonal**. El sistema garantiza una experiencia de usuario fluida delegando el procesamiento pesado (validación de dominio, persistencia y gamificación) a workers especializados, manteniendo el entry-point (API) ligero e inmediatamente responsivo.

---

## 2. Tech Stack & Dependencies

### Frontend (SPA)
| Tecnología | Versión | Rol Crítico |
| :--- | :--- | :--- |
| **React** | 19.2.0 | Core del framework UI. |
| **Vite** | 7.2.4 | Herramienta de bundling y entorno de desarrollo. |
| **Zustand** | 5.0.11 | Gestión de estado global (implementación parcial). |
| **React Hook Form** | 7.71.1 | Gestión de estados de formularios y validación reactiva. |
| **Zod** | 4.3.6 | Definición de esquemas y validación de tipos en runtime. |
| **Framer Motion** | 12.33.0 | Orquestación de micro-animaciones y UX fluida. |
| **Axios** | 1.13.4 | Cliente HTTP con manejo de interceptores para la API. |
| **Tailwind CSS** | 3.4.19 | Sistema de diseño basado en utilidades. |

### Backend (Microservicios)
| Tecnología | Versión | Rol Crítico |
| :--- | :--- | :--- |
| **Spring Boot** | 3.3.5 | Framework base para API y Workers. |
| **Java** | 17 | Lenguaje de programación con uso intensivo de Records y Streams. |
| **RabbitMQ** | 3-mgmnt | Broker de mensajería AMQP para desacoplamiento asíncrono. |
| **Spring Data JPA**| 3.3.5 | Abstracción de persistencia sobre Hibernate. |
| **Lombok** | 1.18.34 | Reducción de código boilerplate mediante anotaciones. |
| **PostgreSQL**| 16+ | Base de datos relacional (persistida en Supabase/Docker). |

---

## 3. Directory Sweep & Architecture

### Estructura de Carpetas

#### `/producer-api` (Hexagonal Light)
*   **`com.sofkianos.producer.controller`**: Entry points REST (ej. `KudosController`).
*   **`com.sofkianos.producer.service`**: Interficies y orquestación de dominio.
*   **`com.sofkianos.producer.domain.ports.out`**: Definición de salidas (ej. `KudoEventPublisher`).
*   **`com.sofkianos.producer.infrastructure.messaging`**: Implementación (Adapter) de RabbitMQ.
*   **`com.sofkianos.producer.dto`**: Contratos de entrada/salida para la API.

#### `/consumer-worker` (Hexagonal Rich)
*   **`com.sofkianos.consumer.component`**: Listeners de RabbitMQ (ej. `KudosConsumer`).
*   **`com.sofkianos.consumer.domain.model`**: Lógica pura de negocio y Enums (`KudoCategory`).
*   **`com.sofkianos.consumer.entity`**: Entidad Rica `Kudo` con validación interna vía **Builder Pattern**.
*   **`com.sofkianos.consumer.infrastructure.persistence`**: Adaptador JPA para persistencia desacoplada.
*   **`com.sofkianos.consumer.repository`**: Interfaces de Spring Data JPA.

#### `/frontend`
*   **`src/components`**: UI Atoms y Molecules (ej. `KudoForm.tsx`).
*   **`src/hooks/forms`**: Lógica de formularios desacoplada del renderizado (ej. `useKudoFormLogic.ts`).
*   **`src/services/api`**: Clientes de comunicación con el backend (usando la instancia de `apiClient`).
*   **`src/schemas`**: Definiciones de validación Zod para tipos integrados.

---

## 4. Critical Data Flow: The Journey of a Kudo

1.  **Captura (Frontend):** El usuario completa el `KudoForm.tsx`. El hook `useKudoFormLogic.ts` valida localmente con el esquema Zod.
2.  **Envío (API Client):** Se llama a `kudosService.send()`, realizando un POST a `/api/v1/kudos`.
3.  **Aceptación (Producer API):** `KudosController.java` recibe el `KudoRequest`. `KudoServiceImpl.java` transforma el DTO en un `KudoEvent`.
4.  **Publicación (Messaging):** `RabbitMqKudoPublisher.java` serializa a JSON y envía el mensaje al Exchange `kudos.exchange` con la routing key `kudos.key`. El cliente recibe un `202 ACCEPTED`.
5.  **Consumo (Worker):** `KudosConsumer.java` (@RabbitListener) detecta el mensaje en `kudos.queue`.
6.  **Validación de Dominio:** `KudoServiceImpl.java` (del worker) usa el `Kudo.Builder` para instanciar la entidad. Aquí se ejecutan reglas críticas (ej. no auto-kudos, campos no vacíos).
7.  **Persistencia:** `JpaKudoPersistenceAdapter.java` guarda la entidad en PostgreSQL a través de `KudoRepository.java`.

---

## 5. Environment Variables & Configuration

El sistema requiere las siguientes variables de entorno para operar (referenciadas en `application.properties` y `docker-compose.yml`):

| Variable | Descripción | Ubicación |
| :--- | :--- | :--- |
| `SPRING_RABBITMQ_HOST` | Host del broker RabbitMQ. | Producer & Consumer |
| `SPRING_RABBITMQ_PORT` | Puerto de conexión AMQP (5672). | Producer & Consumer |
| `SPRING_RABBITMQ_USERNAME` | Usuario del broker (guest/guest por defecto). | Producer & Consumer |
| `SPRING_RABBITMQ_PASSWORD` | Password del broker. | Producer & Consumer |
| `SPRING_DATASOURCE_URL` | URL de conexión JDBC a PostgreSQL. | Consumer Worker |
| `SPRING_DATASOURCE_USERNAME`| Usuario de BD. | Consumer Worker |
| `SPRING_DATASOURCE_PASSWORD`| Password de BD (**Actual: Hardcoded - Crítico**). | Consumer Worker |
| `VITE_API_URL` | URL base de la Producer API para el frontend. | Frontend |

---

## 6. Technical Debt & Points of Failure

### Puntos de Falla Detectados (Edge Cases)
*   **Seguridad:** Contraseñas de base de datos en texto plano en `application.properties`. Existe riesgo de filtración.
*   **Idempotencia:** El worker no valida duplicados. Si RabbitMQ reintenta un mensaje (NACK), se creará el mismo Kudo dos veces.
*   **Transactionality:** Si el worker falla después de guardar en DB pero antes de confirmar a RabbitMQ, el mensaje vuelve a la cola (at-least-once delivery issues).
*   **Dead Code:** El ~55% del frontend es código muerto de versiones previas que infla el bundle.

### Estado de la Deuda Técnica (Fowler Quadrant)
1.  **Reckless/Inadvertent (Prioridad 🔴):** Credenciales hardcoded (`DTB-06`), falta de Error Boundaries en React (`DTF-04`), y duplicidad en capas API de frontend (`DTF-02`).
2.  **Prudent/Inadvertent (Prioridad 🟡):** Falta de versionado de esquemas en eventos AMQP (`DTB-01`) y ausencia de tests de integración para el flujo asíncrono completo (`DTB-12`).
3.  **Prudent/Deliberate (Prioridad 🟢):** Falta de mecanismo de "replay" para la DLQ (`DTB-04`) y ausencia de Circuit Breaker en el Publisher (`DTB-09`).

---

## 7. Priority Improvements (Remediation Roadmap)

1.  **Seguridad (Inmediata):** Mover secretos de `application.properties` a variables de entorno inyectadas vía Docker o archivos `.env`.
2.  **Idempotencia (Corto Plazo):** Implementar una tabla de deduplicación de mensajes usando el `tracking_id` generado por el Producer.
3.  **Limpieza de Frontend:** Eliminar quirúrgicamente las rutas y servicios no utilizados y activar el React Router completo ignorado en `App.tsx`.
4.  **Testing Strategy:** Incrementar la cobertura de tests unitarios en la lógica del `Kudo.Builder` (>80%) y añadir tests de integración con Testcontainers.

---