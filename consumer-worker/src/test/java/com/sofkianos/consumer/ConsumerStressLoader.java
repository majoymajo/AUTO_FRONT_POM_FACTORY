package com.sofkianos.consumer;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Stress loader: publishes 500 messages to the Kudos queue so that
 * consumer throughput can be observed (e.g. in RabbitMQ Management UI).
 * Requires RabbitMQ running on localhost:5672.
 */
@SpringBootTest
class ConsumerStressLoader {

    private static final int MESSAGE_COUNT = 500;
    private static final String MESSAGE_PAYLOAD = "Stress load message #%d";

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Test
    @DisplayName("Load 500 messages into kudos.queue for consumer stress observation")
    void loadQueueWith500Messages() {
        for (int i = 1; i <= MESSAGE_COUNT; i++) {
            String payload = String.format(MESSAGE_PAYLOAD, i);
            rabbitTemplate.convertAndSend(
                    RabbitConfig.EXCHANGE_NAME,
                    RabbitConfig.ROUTING_KEY,
                    payload
            );
        }
    }
}
