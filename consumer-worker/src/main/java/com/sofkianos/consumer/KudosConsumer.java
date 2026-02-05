package com.sofkianos.consumer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

/**
 * Listens to kudos.queue using the Event-Driven Consumer (Listener) pattern.
 * Processing is parallelized via container concurrency; prefetch=1 ensures fair dispatch.
 */
@Component
public class KudosConsumer {

    private static final Logger log = LoggerFactory.getLogger(KudosConsumer.class);

    @RabbitListener(queues = RabbitConfig.QUEUE_NAME)
    public void handleKudo(@Payload String message) {
        log.info("Processing started: [{}]", message);
        long start = System.currentTimeMillis();
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("Kudo processing interrupted");
            return;
        }
        long elapsed = System.currentTimeMillis() - start;
        log.info("Processing finished: [{}] ({} ms)", message, elapsed);
    }
}
