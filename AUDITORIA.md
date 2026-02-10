# Technical Audit: Clean Architecture and Technical Debt

**Date:** February 10, 2026
**Project:** Sofkianos MVP
**Auditor:** Antigravity (Senior Software Architect)

---

## 1. Executive Summary of Architectural State

The system follows an event-driven microservices architecture, divided into three main components:
1.  **producer-api:** REST API (Spring Boot) that receives requests and publishes them to RabbitMQ.
2.  **consumer-worker:** Worker (Spring Boot) that consumes messages from RabbitMQ and persists data in PostgreSQL.
3.  **frontend:** SPA Application (React/Vite) that interacts with the producer-api.

**General State:**
The base architecture is functional for an MVP, decoupling request reception from heavy processing. However, there are significant violations of SOLID principles and a lack of abstractions that will hinder scalability and maintenance. The code tends to be "imperative" rather than declarative or domain-object oriented.

---

## 2. Identified SOLID Principle Violations

### SRP (Single Responsibility Principle)
*   **Critical Violation in `consumer-worker`:** The `KudoServiceImpl` class in the worker flagrantly violates SRP. Its responsibility should be to orchestrate the business logic of "saving a Kudo", but currently it is also responsible for **manually parsing JSON** and mapping fields.
    *   *Location:* `com.sofkianos.consumer.service.impl.KudoServiceImpl.java`
    *   *Evidence:* `JsonNode root = objectMapper.readTree(kudoJson);` and subsequent manual mapping.

*   **Violation in `producer-api`:** `KudoServiceImpl` mixes business logic (validating/preparing the kudo) with infrastructural logic of JSON serialization and direct publication to RabbitMQ.

### DIP (Dependency Inversion Principle)
*   **Infrastructure Coupling in `producer-api`:** `KudoServiceImpl` directly depends on `RabbitTemplate` (a concrete Spring AMQP implementation).
    *   *Impact:* If the messaging broker needed to be changed (e.g., to Kafka or SQS), the domain service would have to be rewritten.
    *   *Solution:* It should depend on a `MessagePublisher` or `EventBus` interface that abstracts the messaging implementation.

*   **Coupling to Third-Party Libraries:** Both services directly depend on `ObjectMapper` (Jackson) within the business logic, coupling them to a specific serialization library.

---

## 3. Detected Code Smells and Technical Debt

### 1. Logic Duplication and "Shotgun Surgery"
*   **Implicit Data Schema:** The JSON message structure (`from`, `to`, `category`, `message`) is defined in `KudoRequest` (producer) and *hardcoded* as strings in `KudoServiceImpl` (consumer).
*   **Risk:** A change in a field name in the producer will silently break the consumer at runtime. There is no shared type safety.

### 2. Anemic Domain Model
*   The entities (`Kudo`, `KudoRequest`) are mere data containers (Getters/Setters) without business logic. All logic resides in the services, leading to a procedural design disguised as OOP.

### 3. Primitive Obsession
*   The `consumer-worker` receives and processes messages as raw `String`s instead of automatically deserializing them into typed objects or using a shared DTO.
*   *Evidence:* `public void handleKudo(@Payload String message)` in `KudosConsumer`.

### 4. Generic Error Handling
*   In `producer-api`, serialization exceptions are caught and re-thrown as generic `RuntimeException`s with the message "Error processing message". This hides the root cause and hinders specific monitoring.

---

## 4. Findings Matrix

| Component | File / Class | Finding Type | Impact (High/Medium/Low) | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Consumer** | `consumer-worker/src/main/java/com/sofkianos/consumer/service/impl/KudoServiceImpl.java` | **SRP Violation** | **High** | Manually parses JSON. Hinders testing and maintenance. |
| **Consumer** | `consumer-worker/src/main/java/com/sofkianos/consumer/service/impl/KudoServiceImpl.java` | **Hardcoded Strings** | **High** | Magic strings ("from", "to") duplicate the DTO contract. Error-prone. |
| **Producer** | `producer-api/src/main/java/com/sofkianos/producer/service/impl/KudoServiceImpl.java` | **DIP Violation** | Medium | Direct dependency on `RabbitTemplate`. Hinders infrastructure changes. |
| **General** | N/A | **Missing Abstraction** | **High** | Lack of shared library for DTOs or schemas (Shared Kernel). |
| **Consumer** | `consumer-worker/src/main/java/com/sofkianos/consumer/component/KudosConsumer.java` | **Primitive Obsession** | Medium | Receives `String` instead of object. Loses Spring's automatic validation. |
| **Frontend** | `frontend/src/services/api/kudosService.ts` | **Generic Error Handling** | Low | Generic error catching without strong typing of the error response. |

---

## 5. Refactoring Recommendations (Roadmap)

1.  **Extract Shared Kernel:** Create a shared maven module containing the DTOs (`KudoEvent`) so that producer and consumer share the contract and duplication is eliminated.
2.  **Refactor Consumer Service:**
    *   Remove `ObjectMapper` from the service.
    *   Configure the `RabbitListener` to use Spring's `MessageConverter` and automatically deserialize the JSON to the shared DTO.
    *   The service should only receive the DTO and call the repository or apply business logic.
3.  **Apply Ports & Adapters (Hexagonal) in Producer (Optional but Recommended):**
    *   Create `KudoPublisherPort` interface in the domain.
    *   Implement `RabbitMqKudoPublisher` in infrastructure using `RabbitTemplate`.
4.  **Enrich the Domain Model:** Implement business validations in the `Kudo` entity if applicable, instead of leaving them scattered.
