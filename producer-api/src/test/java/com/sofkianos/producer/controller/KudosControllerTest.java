package com.sofkianos.producer.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KudosControllerTest {

    @Mock
    private RabbitTemplate rabbitTemplate;

    private final String exchangeName = "test-exchange";
    private final String routingKey = "test-key";

    private KudosController kudosController;

    @BeforeEach
    void setUp() {
        kudosController = new KudosController(rabbitTemplate, exchangeName, routingKey);
    }

    @Test
    void publishKudos_WithValidPayload_ReturnsAccepted() {
        // Arrange
        String payload = "Great job!";

        // Act
        ResponseEntity<Void> response = kudosController.publishKudos(payload);

        // Assert
        assertEquals(HttpStatus.ACCEPTED, response.getStatusCode());
        verify(rabbitTemplate, times(1)).convertAndSend(eq(exchangeName), eq(routingKey), eq(payload));
    }

    @Test
    void publishKudos_WithEmptyPayload_ReturnsBadRequest() {
        // Arrange
        String payload = "";

        // Act
        ResponseEntity<Void> response = kudosController.publishKudos(payload);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verifyNoInteractions(rabbitTemplate);
    }

    @Test
    void publishKudos_WithNullPayload_ReturnsBadRequest() {
        // Arrange
        String payload = null;

        // Act
        ResponseEntity<Void> response = kudosController.publishKudos(payload);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verifyNoInteractions(rabbitTemplate);
    }

    @Test
    void publishKudos_WithWhitespacePayload_ReturnsBadRequest() {
        // Arrange
        String payload = "   ";

        // Act
        ResponseEntity<Void> response = kudosController.publishKudos(payload);

        // Assert
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verifyNoInteractions(rabbitTemplate);
    }
}
