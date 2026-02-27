package com.sofkianos.producer.infrastructure.exception;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit test for ApiError factory method.
 */
class ApiErrorTest {

    @Test
    @DisplayName("Given HttpStatus and message — When of() — Then all fields populated correctly")
    void givenStatusAndMessage_whenOf_thenFieldsCorrect() {
        ApiError error = ApiError.of(HttpStatus.NOT_FOUND, "Resource not found", "/api/v1/kudos/99");

        assertThat(error.getTimestamp()).isNotNull();
        assertThat(error.getStatus()).isEqualTo(404);
        assertThat(error.getError()).isEqualTo("Not Found");
        assertThat(error.getMessage()).isEqualTo("Resource not found");
        assertThat(error.getPath()).isEqualTo("/api/v1/kudos/99");
    }

    @Test
    @DisplayName("Given 400 Bad Request — When of() — Then maps correctly")
    void given400_whenOf_thenMapsCorrectly() {
        ApiError error = ApiError.of(HttpStatus.BAD_REQUEST, "Invalid input", "/api/v1/kudos");

        assertThat(error.getStatus()).isEqualTo(400);
        assertThat(error.getError()).isEqualTo("Bad Request");
    }

    @Test
    @DisplayName("Given 500 Internal Server Error — When of() — Then maps correctly")
    void given500_whenOf_thenMapsCorrectly() {
        ApiError error = ApiError.of(HttpStatus.INTERNAL_SERVER_ERROR, "Unexpected error", "/api/v1/kudos");

        assertThat(error.getStatus()).isEqualTo(500);
        assertThat(error.getError()).isEqualTo("Internal Server Error");
    }

    @Test
    @DisplayName("Given 503 Service Unavailable — When of() — Then maps correctly")
    void given503_whenOf_thenMapsCorrectly() {
        ApiError error = ApiError.of(HttpStatus.SERVICE_UNAVAILABLE, "Broker down", "/api/v1/kudos");

        assertThat(error.getStatus()).isEqualTo(503);
        assertThat(error.getError()).isEqualTo("Service Unavailable");
    }
}
