# Producer API (Kudos)

Producer API for SofkianOS that receives Kudos from the Frontend and publishes them asynchronously to RabbitMQ. It acts as the system's API Gateway and asynchronous publisher for Kudos events.

## Architecture Responsibility

- API Gateway for the Kudos entrypoint.
- Asynchronous publisher to RabbitMQ for downstream processing.
- No data persistence (stateless service).

## Tech Stack

- Java 17
- Spring Boot 3.3.x
- RabbitMQ

## Prerequisites

- Java 17
- Docker (for RabbitMQ)

## How to Run Locally

```bash
./mvnw spring-boot:run
```

## API Example

**POST** `/api/v1/kudos`

```bash
curl -i -X POST http://localhost:8080/api/v1/kudos \
  -H "Content-Type: application/json" \
  -d '{"from":"Ana","to":"Luis","message":"Great job"}'
```
