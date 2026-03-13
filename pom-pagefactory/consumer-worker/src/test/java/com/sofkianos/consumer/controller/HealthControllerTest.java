package com.sofkianos.consumer.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;

class HealthControllerTest {

    private final HealthController controller = new HealthController();

    @Test
    @DisplayName("GET /api/v1/health — Returns 200 OK with success message")
    void health_returnsOk() {
        ResponseEntity<String> response = controller.health();
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).contains("running correctly");
    }
}
