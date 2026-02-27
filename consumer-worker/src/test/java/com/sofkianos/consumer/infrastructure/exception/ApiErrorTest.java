package com.sofkianos.consumer.infrastructure.exception;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;

import static org.assertj.core.api.Assertions.assertThat;

class ApiErrorTest {

    @Test
    @DisplayName("of() — Should create ApiError with correct fields")
    void of_createsCorrectApiError() {
        ApiError error = ApiError.of(HttpStatus.UNPROCESSABLE_ENTITY, "Self-kudo", "/api/v1/kudos");

        assertThat(error.getTimestamp()).isNotNull();
        assertThat(error.getStatus()).isEqualTo(422);
        assertThat(error.getError()).isEqualTo("Unprocessable Entity");
        assertThat(error.getMessage()).isEqualTo("Self-kudo");
        assertThat(error.getPath()).isEqualTo("/api/v1/kudos");
    }

    @Test
    @DisplayName("of() — Should handle different status codes")
    void of_handlesVariousStatus() {
        ApiError error = ApiError.of(HttpStatus.INTERNAL_SERVER_ERROR, "Crash", "/");
        assertThat(error.getStatus()).isEqualTo(500);
        assertThat(error.getError()).isEqualTo("Internal Server Error");
    }
}
