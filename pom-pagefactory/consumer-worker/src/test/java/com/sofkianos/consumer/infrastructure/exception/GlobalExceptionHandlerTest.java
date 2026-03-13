package com.sofkianos.consumer.infrastructure.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler handler;

    @Mock
    private HttpServletRequest request;

    @BeforeEach
    void setUp() {
        handler = new GlobalExceptionHandler();
        when(request.getRequestURI()).thenReturn("/api/v1/kudos");
    }

    @Test
    @DisplayName("Given InvalidKudoException — When handle — Then returns 422")
    void handleInvalidKudo_returns422() {
        InvalidKudoException ex = new InvalidKudoException("Validation failed");
        ResponseEntity<ApiError> response = handler.handleInvalidKudo(ex, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);
        assertThat(response.getBody().getMessage()).isEqualTo("Validation failed");
    }

    @Test
    @DisplayName("Given KudoDomainException — When handle — Then returns 422")
    void handleDomainException_returns422() {
        KudoDomainException ex = new KudoDomainException("Domain error") {
        };
        ResponseEntity<ApiError> response = handler.handleDomainException(ex, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNPROCESSABLE_ENTITY);
        assertThat(response.getBody().getMessage()).isEqualTo("Domain error");
    }

    @Test
    @DisplayName("Given generic Exception — When handle — Then returns 500")
    void handleGenericException_returns500() {
        Exception ex = new RuntimeException("Crash");
        ResponseEntity<ApiError> response = handler.handleGenericException(ex, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody().getMessage()).isEqualTo("Crash");
    }
}
