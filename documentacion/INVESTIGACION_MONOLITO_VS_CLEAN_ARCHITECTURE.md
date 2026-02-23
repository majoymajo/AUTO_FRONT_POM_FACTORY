# Investigación: Monolito vs Clean Architecture — Aplicado a SofkianOS MVP

**Fecha:** 23 de febrero de 2026  
**Proyecto:** Sofkianos MVP  
**Fuentes:** Robert C. Martin (Clean Coder Blog), Martin Fowler (martinfowler.com), Alistair Cockburn (Hexagonal Architecture), Atlassian Engineering, Wikipedia  

---

## 1. Contexto del Proyecto

SofkianOS MVP es un sistema de reconocimiento interno ("kudos") que permite a los empleados enviar reconocimientos entre sí. La arquitectura actual se compone de:

| Componente | Tecnología | Rol |
|---|---|---|
| **producer-api** | Spring Boot 3.3.5 / Java 17 | Gateway REST (publica eventos) |
| **consumer-worker** | Spring Boot 3.3.5 / Java 17 | Procesador de eventos (persiste en BD) |
| **frontend** | React 19 + Vite + TypeScript | SPA web |
| **RabbitMQ** | RabbitMQ 3 Management | Message broker |
| **PostgreSQL** | PostgreSQL | Persistencia (solo consumer) |

**Flujo actual:** `Frontend → HTTP POST → Producer API → AMQP → RabbitMQ → AMQP → Consumer Worker → PostgreSQL`

---

## 2. Arquitectura Monolítica

### 2.1 Definición

Una aplicación monolítica es una unidad de software unificada y autocontenida donde todas las funcionalidades del negocio están acopladas en un único desplegable. Según Wikipedia, "*a monolithic application is a single unified software application that is self-contained and independent from other applications*".

Martin Fowler lo describe así: "*a monolithic application built as a single unit — a server-side application is a monolith, a single logical executable. Any changes to the system involve building and deploying a new version of the server-side application*".

### 2.2 Patrones comunes dentro del monolito

Según *Fundamentals of Software Architecture* (O'Reilly, 2020):

| Patrón | Descripción |
|---|---|
| **Layered Architecture** | Capas horizontales: Presentación → Negocio → Persistencia |
| **Modular Monolith** | Módulos independientes con interfaces claras dentro de un solo desplegable |
| **Microkernel** | Un núcleo extensible con plugins |

### 2.3 Ventajas del monolito

Según Atlassian y Martin Fowler:

- **Despliegue simple** — Un único artefacto ejecutable
- **Desarrollo rápido inicial** — Una sola base de código, menor coordinación
- **Performance** — Comunicación in-process (no hay latencia de red entre componentes)
- **Testing simplificado** — Tests end-to-end centralizados
- **Debugging directo** — Todo el código en un solo lugar, trazabilidad lineal

### 2.4 Desventajas del monolito

- **Velocidad de desarrollo decreciente** — A medida que crece, la complejidad aumenta exponencialmente
- **Escalabilidad limitada** — No se pueden escalar componentes individuales
- **Confiabilidad frágil** — Un error en un módulo puede afectar toda la aplicación
- **Barrera tecnológica** — Cambiar frameworks o lenguajes afecta a todo el sistema
- **Despliegue riesgoso** — Un cambio pequeño requiere redesplegar todo el monolito
- **Falta de flexibilidad** — Atado a las tecnologías elegidas inicialmente

### 2.5 ¿Cuándo es apropiado un monolito?

Martin Fowler recomienda: "*you shouldn't start with a microservices architecture. Instead begin with a monolith, keep it modular, and split it into microservices once the monolith becomes a problem*".

Un monolito es apropiado cuando:
- El equipo es pequeño (< 10 personas)
- El dominio tiene baja complejidad
- Se necesita un MVP rápido
- No hay requisitos de escalamiento granular

---

## 3. Clean Architecture

### 3.1 Definición

Clean Architecture fue propuesta por Robert C. Martin (Uncle Bob) en agosto de 2012 como una síntesis de varias arquitecturas previas:

- **Hexagonal Architecture** (Ports & Adapters) — Alistair Cockburn, 2005
- **Onion Architecture** — Jeffrey Palermo, 2008
- **Screaming Architecture** — Robert C. Martin, 2011
- **DCI** — James Coplien y Trygve Reenskaug
- **BCE** — Ivar Jacobson

Todas comparten el mismo objetivo: **la separación de concerns** mediante la división del software en capas.

### 3.2 Principios fundamentales

Según Uncle Bob, los sistemas que siguen Clean Architecture son:

1. **Independientes de Frameworks** — La arquitectura no depende de la existencia de librerías específicas
2. **Testables** — Las reglas de negocio pueden testearse sin UI, DB, servidor web ni ningún elemento externo
3. **Independientes de la UI** — La UI puede cambiar sin cambiar el resto del sistema
4. **Independientes de la Base de Datos** — Se puede intercambiar Oracle por MongoDB sin afectar las reglas de negocio
5. **Independientes de agentes externos** — Las reglas de negocio simplemente no conocen nada del mundo exterior

### 3.3 La Regla de Dependencia (*The Dependency Rule*)

> "*Source code dependencies can only point inwards. Nothing in an inner circle can know anything at all about something in an outer circle.*"  
> — Robert C. Martin

Esta es **LA** regla que hace funcionar toda la arquitectura. Las capas concéntricas son:

```
┌─────────────────────────────────────────────┐
│          Frameworks & Drivers                │
│  ┌───────────────────────────────────────┐  │
│  │       Interface Adapters              │  │
│  │  ┌─────────────────────────────────┐  │  │
│  │  │        Use Cases               │  │  │
│  │  │  ┌───────────────────────────┐  │  │  │
│  │  │  │       Entities            │  │  │  │
│  │  │  └───────────────────────────┘  │  │  │
│  │  └─────────────────────────────────┘  │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

#### Capa: Entities (centro)
Encapsulan las reglas de negocio de la empresa. Son los objetos de negocio de la aplicación. Son lo **menos probable** de cambiar cuando algo externo cambia.

#### Capa: Use Cases
Contienen las reglas de negocio **específicas de la aplicación**. Orquestan el flujo de datos hacia y desde las entidades. No se espera que cambios en esta capa afecten a las entidades.

#### Capa: Interface Adapters
Conjunto de adaptadores que convierten datos del formato más conveniente para los use cases/entidades al formato más conveniente para agencias externas (DB, Web). Aquí vive MVC, Presenters, Controllers.

#### Capa: Frameworks & Drivers
Capa más externa: frameworks y herramientas (DB, web framework). Generalmente solo contiene *glue code* que comunica hacia el círculo interior. **La Web es un detalle. La base de datos es un detalle.**

### 3.4 Cruzando fronteras (*Crossing Boundaries*)

Uncle Bob resuelve la contradicción aparente entre flujo de control y dependencias usando el **Principio de Inversión de Dependencias (DIP)**:

> Se definen interfaces (puertos) en el círculo interior, y las implementaciones (adaptadores) en el círculo exterior las implementan.

Ejemplo: El use case necesita llamar al presenter, pero no puede hacerlo directamente (viola The Dependency Rule). Entonces el use case llama a una interfaz (Output Port) en su propio círculo, y el presenter en el círculo exterior la implementa.

### 3.5 Datos que cruzan las fronteras

> "*We don't want to cheat and pass Entities or Database rows. We don't want the data structures to have any kind of dependency that violates The Dependency Rule.*"

Los datos que cruzan fronteras son siempre **estructuras de datos simples** (DTOs, records, argumentos de funciones). Nunca se pasan entidades JPA o row structures de base de datos hacia adentro.

---

## 4. Arquitectura Hexagonal (Ports & Adapters) — Profundización

### 4.1 Origen y principio

Inventada por Alistair Cockburn en 2005. Divide el sistema en componentes débilmente acoplados:

- **Puertos**: APIs abstractas que definen cómo el núcleo de la aplicación interactúa con el exterior
- **Adaptadores**: Implementaciones concretas que conectan los puertos con tecnologías específicas (DB, HTTP, messaging)

### 4.2 Relación con Clean Architecture

Según Wikipedia: "*The clean architecture proposed by Robert C. Martin in 2012 combines the principles of the hexagonal architecture, the onion architecture and several other variants. It provides additional levels of detail of the component, which are presented as concentric rings.*"

Clean Architecture es una **evolución** de Hexagonal Architecture con más granularidad en las capas.

### 4.3 Relación con microservicios

> "*According to some authors, the hexagonal architecture is at the origin of the microservices architecture.*"

La Hexagonal Architecture facilita la transición a microservicios porque ya tiene fronteras claras con el exterior a través de puertos y adaptadores.

---

## 5. Microservicios vs Monolito — Contexto Event-Driven

### 5.1 Características de microservicios (Martin Fowler)

Martin Fowler define microservicios con estas características:

| Característica | Descripción |
|---|---|
| **Componentización via Servicios** | Componentes desplegados como servicios out-of-process |
| **Organizados por capacidad de negocio** | Equipos cross-functional por dominio |
| **Smart endpoints, dumb pipes** | Lógica en los endpoints, mensajería simple (HTTP, RabbitMQ) |
| **Gobernanza descentralizada** | Libertad tecnológica por servicio |
| **Datos descentralizados** | Cada servicio con su propia DB |
| **Diseño para fallos** | Circuit breakers, DLQ, retry policies |
| **Diseño evolutivo** | Servicios reemplazables e independientes |

### 5.2 Comunicación

Fowler identifica dos protocolos principales:

1. **HTTP request-response** con APIs REST
2. **Mensajería liviana** sobre un bus simple (RabbitMQ, ZeroMQ)

> "*Simple implementations such as RabbitMQ or ZeroMQ don't do much more than provide a reliable asynchronous fabric — the smarts still live in the end points.*"

### 5.3 Ventajas de microservicios (Atlassian)

- **Agilidad** — Equipos pequeños que despliegan frecuentemente
- **Escalamiento flexible** — Cada servicio escala independientemente
- **Despliegue continuo** — Sin afectar otros servicios
- **Mantenibilidad** — Aislamiento de fallos y bugs
- **Flexibilidad tecnológica** — Stack libre por servicio
- **Alta confiabilidad** — Cambios aislados, sin riesgo sistémico

### 5.4 Desventajas de microservicios (Atlassian)

- **Sprawl de desarrollo** — Más servicios = más complejidad operacional
- **Costos de infraestructura exponenciales** — Cada servicio tiene su pipeline
- **Overhead organizacional** — Coordinación entre equipos
- **Debugging complejo** — Logs distribuidos, trazas across services
- **Falta de estandarización** — Sin plataforma común, proliferación de stacks
- **Ownership difuso** — ¿Quién es dueño de qué servicio?

---

## 6. Análisis del Proyecto SofkianOS MVP

### 6.1 Clasificación arquitectónica actual

SofkianOS MVP implementa una **arquitectura de microservicios event-driven** con **Clean Architecture interna** (Hexagonal / Ports & Adapters) en cada servicio.

### 6.2 Evidencia de Clean Architecture en el código

#### Producer API — Mapeo a capas de Clean Architecture

| Capa Clean Architecture | Paquete en Producer | Contenido |
|---|---|---|
| **Entities / Domain** | `domain.events`, `domain.ports` | `KudoEvent`, `KudoValidationStrategy`, `KudoEventPublisher` |
| **Use Cases** | `service`, `service.impl` | `KudoService`, `KudoServiceImpl` |
| **Interface Adapters** | `controller`, `dto`, `infrastructure.controller.advice` | `KudosController`, `KudoRequest`, `KudoResponse`, `GlobalExceptionHandler` |
| **Frameworks & Drivers** | `config`, `infrastructure.messaging` | `RabbitConfig`, `RabbitMqKudoPublisher`, `WebConfig` |

**Cumplimiento de The Dependency Rule:**
- ✅ `KudoEventPublisher` es un **Output Port** (interfaz en el dominio)
- ✅ `RabbitMqKudoPublisher` es un **Adapter** (implementación en infraestructura)
- ✅ DTOs (`KudoRequest`, `KudoResponse`) como records inmutables — datos simples cruzan fronteras
- ✅ El Controller no contiene lógica de negocio
- ✅ El Service orquesta sin conocer la implementación de mensajería

#### Consumer Worker — Mapeo a capas de Clean Architecture

| Capa Clean Architecture | Paquete en Consumer | Contenido |
|---|---|---|
| **Entities / Domain** | `domain.events`, `domain.model`, `domain.ports`, `entity` | `KudoEvent`, `KudoCategory`, `KudoPersistencePort`, `Kudo` (JPA Entity con Builder + validaciones) |
| **Use Cases** | `service`, `service.impl` | `KudoService`, `KudoServiceImpl` |
| **Interface Adapters** | `component`, `controller`, `infrastructure.messaging`, `infrastructure.persistence` | `KudosConsumer`, `HealthController`, `KudoEventMapper`, `JpaKudoPersistenceAdapter` |
| **Frameworks & Drivers** | `config`, `repository` | `RabbitConfig`, `KudoRepository` |

**Cumplimiento de The Dependency Rule:**
- ✅ `KudoPersistencePort` es un **Output Port** (interfaz en el dominio)
- ✅ `JpaKudoPersistenceAdapter` implementa el port en infraestructura
- ✅ `KudoEventMapper` convierte entre DTOs externos y entidades internas
- ✅ `Kudo.builder()` valida invariantes de dominio en construcción (Builder Pattern)
- ⚠️ **Observación:** La entidad JPA `Kudo` está en `entity` package fuera de `domain`, lo cual es correcto para separar concerns, pero el Builder con validaciones de dominio mezcla responsabilidades de dominio e infraestructura en una sola clase

### 6.3 Patrones arquitectónicos identificados

| Patrón | Ubicación | Alineamiento |
|---|---|---|
| **Hexagonal (Ports & Adapters)** | Ambos backends | ✅ Clean Architecture — Output Ports + Adapters |
| **Event-Driven (Producer-Consumer)** | Producer → RabbitMQ → Consumer | ✅ Smart endpoints, dumb pipes (Fowler) |
| **CQRS (implícito)** | Producer = Command, Consumer = materialización | ✅ Datos descentralizados |
| **Strategy Pattern** | `KudoValidationStrategy` en producer | ✅ OCP — abierto a extensión |
| **Dead Letter Queue** | `kudos.dlx` → `kudos.dlq` | ✅ Design for failure |
| **Builder Pattern** | `Kudo.builder()` en consumer | ✅ Entidades con invariantes protegidas |
| **DTO Pattern** | Records en ambos servicios | ✅ Datos simples cruzan fronteras |
| **Global Exception Handler** | `@RestControllerAdvice` | ✅ Interface Adapter layer |

---

## 7. Comparativa: Si fuera Monolito vs Arquitectura Actual

### 7.1 Escenario hipotético monolítico

Si SofkianOS fuera un monolito, tendría una estructura tipo:

```
sofkianos-monolith/
├── src/main/java/com/sofkianos/
│   ├── controller/
│   │   └── KudosController.java      ← Recibe POST, llama al Service
│   ├── service/
│   │   └── KudosService.java         ← Lógica de negocio + persistencia directa
│   ├── repository/
│   │   └── KudoRepository.java       ← JPA Repository
│   ├── entity/
│   │   └── Kudo.java                 ← Entidad JPA
│   └── dto/
│       ├── KudoRequest.java
│       └── KudoResponse.java
└── src/main/resources/
    └── application.yml                ← PostgreSQL directo
```

**Flujo monolítico:** `Frontend → HTTP POST → Controller → Service → Repository → PostgreSQL → Response`

### 7.2 Tabla comparativa

| Aspecto | Monolito Hipotético | Arquitectura Actual (Microservicios + Clean) |
|---|---|---|
| **Despliegue** | 1 artefacto JAR | 3 contenedores + RabbitMQ + PostgreSQL |
| **Latencia** | Mínima (in-process) | Mayor (HTTP + AMQP + DB) |
| **Resiliencia** | Falla total si cae | Producer sigue aceptando si Consumer cae (RabbitMQ bufferea) |
| **Escalabilidad** | Escala todo junto | Producer y Consumer escalan independiente |
| **Complejidad** | Baja | Media-Alta |
| **Testabilidad** | Tests integrados simples | Tests unitarios aislados por servicio (ports mockables) |
| **Evolución** | Cambio de DB requiere redeploy total | Solo redeploy del Consumer |
| **Team ownership** | 1 equipo, 1 repo | Equipos paralelos por servicio |
| **Debugging** | Stack trace lineal | Traces distribuidos (necesita correlación) |
| **Costo infra** | 1 instancia | Múltiples instancias + broker |

### 7.3 ¿Es la decisión correcta para un MVP?

**Argumentos a favor de la arquitectura actual:**

1. **El dominio es inherentemente asíncrono** — Enviar un reconocimiento no requiere respuesta inmediata. El patrón Producer-Consumer es una correspondencia natural con el dominio.
2. **Clean Architecture habilita testing** — Los Output Ports permiten mockear infraestructura en tests unitarios sin levantar RabbitMQ ni PostgreSQL.
3. **Escalabilidad demostrada** — Si la carga de kudos crece, se agregan instancias del Consumer sin tocar el Producer.
4. **Resiliencia via DLQ** — Mensajes fallidos van al Dead Letter Queue, no se pierden datos.
5. **Preparación para crecimiento** — La separación en servicios facilita agregar nuevos dominios (ej: notificaciones, analytics) como nuevos consumers.

**Riesgos identificados:**

1. **Sobre-ingeniería para un MVP** — Martin Fowler sugiere empezar con monolito. Para un MVP con un solo dominio (kudos), la complejidad operacional puede no justificarse.
2. **Costo de infraestructura** — RabbitMQ + múltiples servicios Docker requieren más recursos que un JAR simple.
3. **Contrato de evento duplicado** — `KudoEvent` existe en ambos servicios sin un módulo compartido, lo cual puede causar divergencia.
4. **No hay trazabilidad distribuida** — No se observa un sistema de correlation IDs o distributed tracing (ej: Zipkin/Jaeger).
5. **Schema management** — `ddl-auto=validate` implica que las migraciones de DB deben gestionarse externamente (Flyway/Liquibase no detectado).

---

## 8. Recomendaciones

### 8.1 Corto plazo (mejoras inmediatas)

| # | Recomendación | Justificación |
|---|---|---|
| 1 | **Crear módulo compartido de contratos** (`shared-contracts`) | Evitar duplicación de `KudoEvent` entre producer y consumer |
| 2 | **Agregar Flyway/Liquibase** al consumer-worker | Gestión versionada de schema de BD |
| 3 | **Implementar correlation ID** en headers AMQP | Trazabilidad end-to-end del flujo de un kudo |
| 4 | **Agregar health check de RabbitMQ** | El producer debe reportar si puede publicar |

### 8.2 Mediano plazo (si el dominio crece)

| # | Recomendación | Justificación |
|---|---|---|
| 5 | **Query API separada** (CQRS completo) | Agregar endpoint GET /kudos con filtros sin sobrecargar el consumer |
| 6 | **Distributed tracing** (Zipkin/OpenTelemetry) | Visibilidad de latencia across services |
| 7 | **Contract testing** (Spring Cloud Contract o Pact) | Validar que producer y consumer comparten el mismo contrato de evento |

### 8.3 Si se reconsiderara un monolito

Si el equipo decidiera simplificar a un monolito, debería mantener la Clean Architecture interna:

```
sofkianos-monolith/
├── domain/
│   ├── model/Kudo.java              ← Entidad con invariantes
│   ├── ports/in/SendKudoUseCase.java
│   └── ports/out/KudoRepository.java  ← Output Port
├── application/
│   └── service/KudoServiceImpl.java   ← Implementa Use Case
├── infrastructure/
│   ├── persistence/JpaKudoAdapter.java ← Adapter
│   └── web/KudosController.java       ← Input Adapter
└── config/
```

Esto preservaría testabilidad y The Dependency Rule mientras elimina la complejidad operacional del messaging.

---

## 9. Conclusión

SofkianOS MVP implementa una arquitectura sofisticada que combina **microservicios event-driven** con **Clean Architecture / Hexagonal** interno. Esta decisión es **técnicamente sólida** — el código demuestra adherencia a The Dependency Rule, separación de concerns mediante ports y adapters, DTOs inmutables como records, y patrones como Builder, Strategy y DLQ.

La pregunta clave no es si la arquitectura es *correcta*, sino si es *proporcional*. Para un MVP con un solo dominio (kudos), la complejidad operacional de múltiples servicios + message broker es alta. Sin embargo, la base arquitectónica interna (Clean Architecture) es **excelente** y serviría igualmente bien en un monolito modular.

**Veredicto:** La arquitectura actual es una inversión en el futuro escalable del proyecto, con el trade-off de mayor complejidad operacional en el corto plazo. Las recomendaciones de este documento buscan mitigar los riesgos identificados sin perder los beneficios arquitectónicos.

---

## 10. Referencias

| # | Fuente | URL |
|---|---|---|
| 1 | Robert C. Martin, "The Clean Architecture" (2012) | https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html |
| 2 | Martin Fowler & James Lewis, "Microservices" (2014) | https://martinfowler.com/articles/microservices.html |
| 3 | Alistair Cockburn, "Hexagonal Architecture" (2005) | https://alistair.cockburn.us/hexagonal-architecture/ |
| 4 | Wikipedia, "Hexagonal architecture (software)" | https://en.wikipedia.org/wiki/Hexagonal_architecture_(software) |
| 5 | Wikipedia, "Monolithic application" | https://en.wikipedia.org/wiki/Monolithic_application |
| 6 | Atlassian, "Microservices vs. Monolithic Architecture" | https://www.atlassian.com/microservices/microservices-architecture/microservices-vs-monolith |
| 7 | Mark Richards, "Fundamentals of Software Architecture" (O'Reilly, 2020) | ISBN: 978-1492043454 |
| 8 | Robert C. Martin, "Clean Architecture" (2017) | ISBN: 978-0-13-449416-6 |
