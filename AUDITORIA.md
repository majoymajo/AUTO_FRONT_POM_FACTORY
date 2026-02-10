# Auditoría Técnica: Clean Architecture y Deuda Técnica

**Fecha:** 10 de Febrero de 2026
**Proyecto:** Sofkianos MVP
**Auditor:** Antigravity (Senior Software Architect)

---

## 1. Resumen Ejecutivo del Estado Arquitectónico

El sistema sigue una arquitectura de microservicios orientada a eventos, dividida en tres componentes principales:
1.  **producer-api:** API REST (Spring Boot) que recibe solicitudes y las publica en RabbitMQ.
2.  **consumer-worker:** Worker (Spring Boot) que consume mensajes de RabbitMQ y persiste datos en PostgreSQL.
3.  **frontend:** Aplicación SPA (React/Vite) que interactúa con la producer-api.

**Estado General:**
La arquitectura base es funcional para un MVP, desacoplando la recepción de solicitudes del procesamiento pesado. Sin embargo, existen violaciones significativas de principios SOLID y una falta de abstracciones que dificultarán la escalabilidad y el mantenimiento. El código tiende a ser "imperativo" en lugar de declarativo u orientado a objetos en el dominio.

---

## 2. Violaciones de Principios SOLID Identificadas

### SRP (Single Responsibility Principle) - Principio de Responsabilidad Única
*   **Violación Crítica en `consumer-worker`:** La clase `KudoServiceImpl` en el worker viola SRP flagrantemente. Su responsabilidad debería ser orquestar el negocio de "guardar un Kudo", pero actualmente también es responsable de **parsear JSON manualmente** y mapear campos.
    *   *Ubicación:* `com.sofkianos.consumer.service.impl.KudoServiceImpl.java`
    *   *Evidencia:* `JsonNode root = objectMapper.readTree(kudoJson);` y el mapeo manual subsiguiente.

*   **Violación en `producer-api`:** `KudoServiceImpl` mezcla la lógica de negocio (validar/preparar el kudo) con la lógica infraestructural de serialización JSON y publicación directa en RabbitMQ.

### DIP (Dependency Inversion Principle) - Principio de Inversión de Dependencias
*   **Acoplamiento a Infraestructura en `producer-api`:** `KudoServiceImpl` depende directamente de `RabbitTemplate` (una implementación concreta de Spring AMQP).
    *   *Impacto:* Si se quisiera cambiar el broker de mensajería (ej. a Kafka o SQS), se tendría que reescribir el servicio de dominio.
    *   *Solución:* Debería depender de una interfaz `MessagePublisher` o `EventBus` que abstraiga la implementación de mensajería.

*   **Acoplamiento a Librerías de Terceros:** Ambos servicios dependen directamente de `ObjectMapper` (Jackson) dentro de la lógica de negocio, acoplándolos a una librería específica de serialización.

---

## 3. Code Smells y Deuda Técnica Detectada

### 1. Duplicación Lógica y "Shotgun Surgery"
*   **Esquema de Datos Implícito:** La estructura del mensaje JSON (`from`, `to`, `category`, `message`) está definida en `KudoRequest` (producer) y *hardcodeada* como strings en `KudoServiceImpl` (consumer).
*   **Riesgo:** Un cambio en el nombre de un campo en el producer romperá silenciosamente el consumer en tiempo de ejecución. No hay seguridad de tipos compartida.

### 2. Anemic Domain Model (Modelo de Dominio Anémico)
*   Las entidades (`Kudo`, `KudoRequest`) son meros contenedores de datos (Getters/Setters) sin lógica de negocio. Toda la lógica reside en los servicios, lo que lleva a un diseño procedural disfrazado de OOP.

### 3. Obsesión por Tipos Primitivos (Primitive Obsession)
*   El `consumer-worker` recibe y procesa mensajes como `String` crudos en lugar de deserializarlos a objetos tipados automáticamente o usar un DTO compartido.
*   *Evidencia:* `public void handleKudo(@Payload String message)` en `KudosConsumer`.

### 4. Manejo de Errores Genérico
*   En `producer-api`, las excepciones de serialización se capturan y se relanzan como `RuntimeException` genéricas con el mensaje "Error processing message". Esto oculta la causa raíz y dificulta el monitoreo específico.

---

## 4. Matriz de Hallazgos

| Componente | Archivo / Clase | Tipo de Hallazgo | Impacto (Alto/Medio/Bajo) | Descripción |
| :--- | :--- | :--- | :--- | :--- |
| **Consumer** | `consumer-worker/src/main/java/com/sofkianos/consumer/service/impl/KudoServiceImpl.java` | **SRP Violation** | **Alto** | Parsea JSON manualmente. Dificulta tests y mantenimiento. |
| **Consumer** | `consumer-worker/src/main/java/com/sofkianos/consumer/service/impl/KudoServiceImpl.java` | **Hardcoded Strings** | **Alto** | Strings mágicos ("from", "to") duplican el contrato del DTO. Propenso a errores. |
| **Producer** | `producer-api/src/main/java/com/sofkianos/producer/service/impl/KudoServiceImpl.java` | **DIP Violation** | Medio | Dependencia directa de `RabbitTemplate`. Dificulta el cambio de infraestructura. |
| **General** | N/A | **Missing Abstraction** | **Alto** | Falta de librería compartida para DTOs o esquemas (Shared Kernel). |
| **Consumer** | `consumer-worker/src/main/java/com/sofkianos/consumer/component/KudosConsumer.java` | **Primitive Obsession** | Medio | Recibe `String` en lugar de objeto. Pierde validación automática de Spring. |
| **Frontend** | `frontend/src/services/api/kudosService.ts` | **Generic Error Handling** | Bajo | Captura genérica de errores sin tipado fuerte de la respuesta de error. |

---

## 5. Recomendaciones de Refactorización (Roadmap)

1.  **Extraer Shared Kernel:** Crear un módulo maven compartido que contenga los DTOs (`KudoEvent`) para que producer y consumer compartan el contrato y se elimine la duplicación.
2.  **Refactorizar Consumer Service:**
    *   Eliminar `ObjectMapper` del servicio.
    *   Configurar el `RabbitListener` para que use el `MessageConverter` de Spring y deserialice automáticamente el JSON al DTO compartido.
    *   El servicio solo debe recibir el DTO y llamar al repositorio o aplicar lógica de negocio.
3.  **Aplicar Port & Adapters (Hexagonal) en Producer (Opcional pero Recomendado):**
    *   Crear interfaz `KudoPublisherPort` en el dominio.
    *   Implementar `RabbitMqKudoPublisher` en infraestructura que use `RabbitTemplate`.
4.  **Enriquecer el Modelo de Dominio:** Implementar validaciones de negocio en la entidad `Kudo` si aplica, en lugar de dejarlas dispersas.
