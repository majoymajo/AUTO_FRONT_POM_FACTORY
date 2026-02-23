# 1. Descripción General (Re-Arquitectura SofkianOS)

Este análisis examina la estructura actual del proyecto **SofkianOS MVP**.  
Aunque el sistema se presenta como una arquitectura de microservicios (Producer API, Consumer Worker y Frontend), técnicamente opera como un **Monolito Distribuido**. Esto significa que las piezas están separadas físicamente, pero acopladas lógicamente, arrastrando una deuda técnica que impide su escalabilidad.

El objetivo de esta fase de re-arquitectura es documentar estos *dolores* y contrastarlos con los beneficios de migrar hacia una **Clean Architecture**.

---

## 1.1. Dolores del Monolito Distribuido (Estado Actual)

Basado en el inventario de deuda técnica, los principales obstáculos identificados son:

### 🔴 Acoplamiento de Datos y Lógica
- Credenciales de base de datos *hardcoded* en `application.properties`.
- Duplicación manual de la entidad `KudoEvent` entre el Producer y el Consumer.
- Ausencia de versionamiento de contratos: un cambio en el Producer **rompe inmediatamente** al Consumer.

### 🔴 Lógica Secuestrada en la Infraestructura
- La lógica de negocio está dispersa y mezclada dentro de:
    - Controllers de la API.
    - Métodos de escucha de RabbitMQ.
- Esto dificulta extraer o evolucionar reglas de negocio sin afectar el transporte de datos.

### 🔴 Falta de Testabilidad Real
- Cobertura limitada (~25%), enfocada mayormente en controllers.
- Imposibilidad de testear la lógica de asignación de Kudos sin levantar toda la infraestructura (PostgreSQL / RabbitMQ).
- Causa raíz: ausencia de **Inversión de Dependencias**.

### 🔴 Inseguridad y Fragilidad
- API pública sin:
    - Gateways.
    - Políticas de autenticación/autorización.
- Falta de idempotencia en el procesamiento de mensajes, generando duplicados que comprometen la integridad de los datos.

### 🔴 Código Muerto y Duplicidad en Frontend
- ~55% de código inaccesible.
- Capas de API paralelas que confunden el flujo de datos y aumentan el costo de mantenimiento.

### 🔴 Observabilidad Nula
- Dependencia exclusiva de logs de consola.
- Ausencia de *tracing distribuido*, haciendo imposible rastrear un Kudo desde el Producer hasta su persistencia en la base de datos.

---

## 1.2. Beneficios Teóricos de Clean Architecture (Estado Deseado)

La implementación de **Clean Architecture** (basada en los principios de Robert C. Martin) permitirá desacoplar el *Core* del negocio de los detalles técnicos (Frameworks, UI, DB):

### 🟢 Independencia de Frameworks y API
- La API REST deja de ser el centro del sistema y pasa a ser un **Interface Adapter**.
- La lógica de Kudos puede sobrevivir incluso a un cambio de framework (ej. reemplazar Spring Boot).

### 🟢 Centralización en Casos de Uso (Use Cases)
- Toda la regla de negocio (ej. *“Cómo se valida un Kudo”*) reside en una capa central protegida.
- Se elimina la duplicidad de lógica entre Producer y Consumer.

### 🟢 Testabilidad Superior (Mocking de Infraestructura)
- Dependencias inyectadas mediante interfaces.
- Tests unitarios del Core sin bases de datos ni brokers reales.
- Objetivo: elevar la cobertura a **>80%**.

### 🟢 Mantenibilidad y Evolución
- Separación clara en capas:
    - Entities
    - Use Cases
    - Adapters
- Frontend y Backend trabajan sobre **contratos explícitos**, reduciendo la deuda técnica exponencial.

### 🟢 Resiliencia Mediante Capas de Adaptación
- Implementación de:
    - Circuit Breakers.
    - Validaciones de invariantes en los Use Cases.
- Garantiza que solo datos válidos alcancen la capa de persistencia.

---

## 1.3. Contraste y Conclusión

Mientras el modelo actual de **Monolito Distribuido** acumula deuda técnica con cada mensaje enviado (riesgo de duplicados, falta de trazabilidad), **Clean Architecture** previene esta degradación mediante el principio de **Inversión de Dependencias (DIP)**.

La transición permitirá que **SofkianOS** pase de ser un sistema frágil a una **plataforma robusta**, preparada para integrarse a un ecosistema de APIs escalable.

---