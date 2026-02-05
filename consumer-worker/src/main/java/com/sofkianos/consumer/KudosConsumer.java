package com.sofkianos.consumer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

/** Listens to kudos.queue using the Event-Driven Consumer (Listener) pattern. Processes messages asynchronously. */
@Component
public class KudosConsumer {

    private static final Logger log = LoggerFactory.getLogger(KudosConsumer.class);

    @RabbitListener(queues = RabbitConfig.QUEUE_NAME)
    public void handleKudo(@Payload String message) {
        log.info("Received Kudo: [{}]", message);
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            log.warn("Kudo processing interrupted");
            return;
        }
        log.info("Kudo Processed!");
    }
}
