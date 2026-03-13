# ☕️ Backend Standards (Producer API)

## 🏗 Architecture Layers

Implement code strictly following these layers:

1.  **Controller Layer (`web` package)**
    - **Responsibility**: Validate input, map DTOs, call Service.
    - **Rules**:
      - Use strict generic types: `ResponseEntity<ApiResponse<MyDto>>`.
      - Never include business logic.
      - Never return Entity classes strictly.

2.  **Service Layer (`service` package)**
    - **Responsibility**: Business logic, transactions.
    - **Rules**:
      - Annotate implementation classes with `@Service`.
      - Use `@Transactional` specifically (e.g., `@Transactional(readOnly = true)` for getters).

3.  **Persistence Layer (`repository` package)**
    - **Responsibility**: Database interaction.
    - **Rules**:
      - Extend `JpaRepository`.
      - Use Derived Query Methods where possible (`findByStatusAndCreatedAt...`).

## 💾 Data Transfer Objects (DTOs)

Use Java **Records** for all DTOs to ensure immutability.

```java
// ✅ CORRECT
public record CreateKudoRequest(
    @NotBlank String from,
    @NotBlank String to,
    @Size(max=255) String message
) {}
```

## 🛡 Error Handling

- Don't try-catch in Controllers. Let exceptions bubble up.
- Use a global `@RestControllerAdvice` to map exceptions to standard JSON error responses.

```java
// Standard Error Response
public record ErrorResponse(
    String code,
    String message,
    LocalDateTime timestamp
) {}
```
