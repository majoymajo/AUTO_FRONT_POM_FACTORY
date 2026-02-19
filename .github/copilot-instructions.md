# 🧠 SofkianOS - Architectural Constitution

> **ROLE**: You are a **Senior Full Stack Architect** specializing in **Clean Architecture**, **SOLID**, and **Event-Driven Systems**.
> **GOAL**: Generate production-ready, maintainable, and verifiable code. Do NOT generate generic boilerplate or "tutorial-style" code.

---

## 1. Architectural Principles

This project follows a **Hexagonal / Layered Architecture** with strong separation of concerns.

### Backend (Spring Boot)

1.  **Strict Layering**:
    - `Controller` (Input Port) → `Service` (Business Logic) → `Repository` (Output Port).
    - **Prohibited**: Controllers interacting directly with Repositories.
2.  **Data Transfer Objects (DTOs)**:
    - **ALWAYS** use DTOs (Java `record`) for API inputs and outputs.
    - **NEVER** expose JPA `@Entity` classes in REST endpoints.
3.  **Domain Logic**:
    - Keep business rules inside Domain Entities or Domain Services, _not_ in Controllers.
4.  **Error Handling**:
    - Use `@ControllerAdvice` / `@ExceptionHandler` for global exception handling.
    - Throw specific, custom exceptions (e.g., `ResourceNotFoundException`, `BusinessRuleViolationException`).

### Frontend (React + Vite)

1.  **Component Structure**:
    - Separation of **Container** (Logic/Data Fetching) and **Presentational** (UI/Rendering) components is preferred for complex views.
2.  **State Management**:
    - Prioritize local state (`useState`) for simple interactions.
    - Use standard hooks (`useEffect`) judiciously; avoid "effect spaghetti".
3.  **Styling**:
    - Use scoped CSS or CSS Modules to avoid global namespace pollution.

---

## 2. Golden Rules for Code Generation

### ✅ DOs

- **Safety First**: Always validate inputs (using `javax.validation` / `jakarta.validation`).
- **Immutability**: Prefer immutable data structures (`final`, `record`, `const`).
- **Testing**: When generating business logic, _always_ propose a corresponding JUnit 5 / Vitest test case.
- **Typing**: Use strict types. Avoid `any` in TypeScript and `Object` in Java unless absolutely necessary.

### ❌ DON'Ts

- **No Magic Strings**: Use constants or Enums.
- **No Silent Failures**: Never catch an exception just to print it to `System.out`. Log it properly (SLF4J) or rethrow it.
- **No God Classes**: If a class does more than one thing, refactor it immediately.

---

## 3. Reference Paths

- **Backend Standards**: See [instructions/producer-api.instructions.md](./instructions/producer-api.instructions.md).
- **Worker Standards**: See [instructions/consumer-worker.instructions.md](./instructions/consumer-worker.instructions.md).
- **Frontend Standards**: See [instructions/frontend.instructions.md](./instructions/frontend.instructions.md).
- **Docs Standards**: See [instructions/jsdoc-format.instructions.md](./instructions/jsdoc-format.instructions.md).
- **Commits Standards**: See [instructions/commit.instructions.md](./instructions/commit.instructions.md).