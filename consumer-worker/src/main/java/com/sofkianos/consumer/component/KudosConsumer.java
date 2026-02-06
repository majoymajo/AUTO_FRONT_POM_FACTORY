package com.sofkianos.consumer.component;

import com.sofkianos.consumer.config.RabbitConfig;
import com.sofkianos.consumer.service.KudoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

/**
 * Listens to kudos.queue using the Event-Driven Consumer (Listener) pattern.
 * Processing is parallelized via container concurrency; prefetch=1 ensures fair dispatch.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class KudosConsumer {

  private final KudoService kudoService;

  @RabbitListener(queues = RabbitConfig.QUEUE_NAME)
  public void handleKudo(@Payload String message) {
    log.info("Processing started: [{}]", message);
    long start = System.currentTimeMillis();

    try {
      kudoService.saveKudo(message);
    } catch (Exception e) {
      log.error("Error processing kudo", e);
      // In a real scenario, you might want to throw exception to NACK the message
      // or send it to a Dead Letter Queue (DLQ).
    }

    long elapsed = System.currentTimeMillis() - start;
    log.info("Processing finished: [{}] ({} ms)", message, elapsed);
  }
}