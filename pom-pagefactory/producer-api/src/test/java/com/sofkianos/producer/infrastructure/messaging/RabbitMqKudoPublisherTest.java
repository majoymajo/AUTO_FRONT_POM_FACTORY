package com.sofkianos.producer.infrastructure.messaging;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sofkianos.producer.domain.model.Kudo;
import com.sofkianos.producer.domain.valueobject.KudoCategory;
import com.sofkianos.producer.infrastructure.messaging.events.KudoEvent;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.RabbitMQContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@Testcontainers
@SpringBootTest
class RabbitMqKudoPublisherTest {

    @Container
    @ServiceConnection
    static RabbitMQContainer rabbit = new RabbitMQContainer("rabbitmq:3-management");

    @Autowired
    private RabbitMqKudoPublisher publisherAdapter;

    @Autowired
    private RabbitTemplate rabbitTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("INT-001: KudoEvent timestamp is ISO-8601 string in JSON (not array)")
    void shouldPublishJsonWithIsoDates() throws Exception {
        // Arrange
        LocalDateTime now = LocalDateTime.of(2026, 2, 11, 12, 0, 0);
        Kudo event = new Kudo(
                null,
                "Alice",
                "Bob",
                KudoCategory.Teamwork,
                "Integration Test",
                now);

        // Act
        publisherAdapter.publish(event);

        // Assert: Consume raw JSON from queue and verify contract
        org.springframework.amqp.core.Message message = rabbitTemplate.receive("kudos.queue", 5000);
        assertThat(message).isNotNull();

        // Convert body to String
        String json = new String(message.getBody());
        assertThat(json).contains("timestamp");

        // Parse JSON and check timestamp field
        com.fasterxml.jackson.databind.JsonNode node = objectMapper.readTree(json);
        String timestampValue = node.get("timestamp").asText();
        assertThat(timestampValue).isEqualTo("2026-02-11T12:00:00");

        // Ensure timestamp is not an array
        assertThat(node.get("timestamp").isArray()).isFalse();
    }
}