package com.sofkianos.producer.controller;

import java.util.Map;
import com.sofkianos.producer.infrastructure.inbound.web.HealthController;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;

class HealthControllerTest {

    private final HealthController healthController = new HealthController();

    @Test
    void health_ReturnsOkWithStatusMessage() {
        // Act
        ResponseEntity<Map<String, String>> response = healthController.health();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("producer-api", response.getBody().get("service"));
        assertEquals("UP", response.getBody().get("status"));
    }

    @Test
    void root_ReturnsOkWithStatusMessage() {
        // Act
        ResponseEntity<Map<String, String>> response = healthController.root();

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("producer-api", response.getBody().get("service"));
        assertEquals("UP", response.getBody().get("status"));
    }
}
