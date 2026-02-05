# Consumer Worker

Spring Boot microservice for the **SofkianOS** system. Consumes messages from RabbitMQ (`kudos.queue`), processes them, and logs each received Kudo.

## Tech Stack

- **Java 17**
- **Spring Boot 3.3.x**
- **Maven**
- **RabbitMQ** (AMQP) — queue `kudos.queue`, topic exchange `kudos.exchange`, routing key `kudos.key`

## Prerequisites

- **Docker** (for running RabbitMQ and/or the service in a container)
- **Java 17** (for local run)
- **RabbitMQ** running and reachable (e.g. via Docker from the project root: `docker compose up -d`)

## How to Run Locally

From the `consumer-worker/` directory:

1. **Build and run with Maven Wrapper:**

   ```bash
   ./mvnw clean spring-boot:run
   ```

2. **Or build the JAR and run it:**

   ```bash
   ./mvnw clean package -DskipTests
   java -jar target/consumer-worker-1.0.0-SNAPSHOT.jar
   ```

The application listens on **port 8081** and connects to RabbitMQ at `localhost:5672` (guest/guest by default). Ensure RabbitMQ is up before starting the service.

## How to Run with Docker

From the `consumer-worker/` directory:

1. **Build the image:**

   ```bash
   docker build -t consumer-worker:latest .
   ```

2. **Run the container** (use `--network="host"` so the container can reach RabbitMQ and the app is reachable on the host):

   ```bash
   docker run --rm --network="host" consumer-worker:latest
   ```

   With host networking, the app inside the container uses `localhost:5672` for RabbitMQ and exposes port 8081 on the host. For production or non-local setups, use a dedicated network and set `SPRING_RABBITMQ_HOST` (and optionally `SERVER_PORT`) via environment variables.

## Configuration

Override defaults with environment variables or `application.properties`:

- `server.port` — HTTP port (default: 8081)
- `spring.rabbitmq.host`, `spring.rabbitmq.port`, `spring.rabbitmq.username`, `spring.rabbitmq.password` — RabbitMQ connection

## Queue Topology

| Element      | Name            |
|-------------|-----------------|
| Queue       | `kudos.queue`   |
| Exchange    | `kudos.exchange` (topic) |
| Routing key | `kudos.key`     |
