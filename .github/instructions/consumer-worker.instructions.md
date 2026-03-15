# 👷 Worker Standards (Consumer)

## 📬 Event Driven Architecture

The Consumer Worker is responsible for processing asynchronous events from RabbitMQ.

### 1. Consumer Implementation

- Use `@RabbitListener` annotations on methods.
- **Idempotency**: All consumers MUST be idempotent. Handling the same message twice should not corrupt data.
  - _Implementation Hint_: Check if the record exists by ID before inserting.

```java
@Component
@Slf4j
public class KudoCreatedConsumer {

    private final KudoService kudoService;

    @RabbitListener(queues = "${mq.queues.kudos}")
    public void consume(KudoEvent event) {
        log.info("Processing kudo from: {}", event.from());
        kudoService.process(event);
    }
}
```

### 2. Error Handling & Reliability

- **Retry Policy**: Configure generic DLQ (Dead Letter Queue) strategies in `application.yml` rather than manual try-catch loops inside consumers, unless specific logic is needed.
- **Poison Messages**: If a message cannot be processed due to a permanent error (e.g., validation failure), do not requeue it indefinitely. Reject it so it goes to DLQ.

### 3. Configuration

- Keep queue names and routing keys in `application.yml` (mapped to `@Value` or `@ConfigurationProperties`). Do not hardcode strings in Java files.
