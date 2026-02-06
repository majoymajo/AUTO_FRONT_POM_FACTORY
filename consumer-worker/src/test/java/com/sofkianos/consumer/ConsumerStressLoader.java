package com.sofkianos.consumer;

import com.sofkianos.consumer.config.RabbitConfig;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import com.sofkianos.consumer.service.KudoService;

/**
 * Stress loader: publishes 500 messages to the Kudos queue.
 */
@SpringBootTest
class ConsumerStressLoader {

  private static final int MESSAGE_COUNT = 500;
  // Valid JSON payload
  private static final String MESSAGE_PAYLOAD = "{\"from\":\"user%d\",\"to\":\"peer\",\"category\":\"Innovation\",\"message\":\"Stress test\"}";

  @Autowired
  private RabbitTemplate rabbitTemplate;

  @MockBean
  private KudoService kudoService; // Mock service to avoid DB connection issues

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