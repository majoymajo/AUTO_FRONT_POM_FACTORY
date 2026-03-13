package com.sofkianos.producer.infrastructure.exception;

import com.sofkianos.producer.application.exception.KudoMessagingException;
import com.sofkianos.producer.domain.exception.KudoNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

/**
 * US-004 / RP-01 — GlobalExceptionHandler unit tests.
 * Validates correct HTTP status mapping for all exception types.
 */
@ExtendWith(MockitoExtension.class)
class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler handler;

    @Mock
    private HttpServletRequest request;

    @Mock
    private BindingResult bindingResult;

    @BeforeEach
    void setUp() {
        handler = new GlobalExceptionHandler();
        when(request.getRequestURI()).thenReturn("/api/v1/kudos");
    }

    @Test
    @DisplayName("Given validation errors — When handleValidationException — Then returns 400")
    void givenValidationErrors_whenHandle_thenReturns400() {
        FieldError fieldError = new FieldError("kudoRequest", "from",
                "The 'from' email is required");
        when(bindingResult.getFieldErrors()).thenReturn(List.of(fieldError));

        MethodArgumentNotValidException ex = new MethodArgumentNotValidException(null, bindingResult);

        ResponseEntity<ApiError> response = handler.handleValidationException(ex, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(400);
        assertThat(response.getBody().getMessage()).contains("from");
    }

    @Test
    @DisplayName("Given type mismatch — When handleTypeMismatch — Then returns 400")
    void givenTypeMismatch_whenHandle_thenReturns400() {
        MethodArgumentTypeMismatchException ex = new MethodArgumentTypeMismatchException(
                "abc", Integer.class, "page", null,
                new NumberFormatException("abc"));

        ResponseEntity<ApiError> response = handler.handleTypeMismatch(ex, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(400);
    }

    @Test
    @DisplayName("Given missing param — When handleMissingParam — Then returns 400")
    void givenMissingParam_whenHandle_thenReturns400() {
        MissingServletRequestParameterException ex = new MissingServletRequestParameterException("category", "String");

        ResponseEntity<ApiError> response = handler.handleMissingParam(ex, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(400);
    }

    @Test
    @DisplayName("Given KudoNotFound — When handleKudoNotFound — Then returns 404")
    void givenKudoNotFound_whenHandle_thenReturns404() {
        KudoNotFoundException ex = new KudoNotFoundException("Kudo with id 99 not found");

        ResponseEntity<ApiError> response = handler.handleKudoNotFound(ex, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(404);
        assertThat(response.getBody().getMessage()).contains("99");
    }

    @Test
    @DisplayName("Given KudoMessagingException — When handleKudoMessaging — Then returns 503")
    void givenMessagingError_whenHandle_thenReturns503() {
        KudoMessagingException ex = new KudoMessagingException("Broker unreachable");

        ResponseEntity<ApiError> response = handler.handleKudoMessaging(ex, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(503);
    }

    @Test
    @DisplayName("Given KudoPublishingException — When handleKudoPublishing — Then returns 503")
    void givenPublishingError_whenHandle_thenReturns503() {
        KudoPublishingException ex = new KudoPublishingException("Serialization failed");

        ResponseEntity<ApiError> response = handler.handleKudoPublishing(ex, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(503);
    }

    @Test
    @DisplayName("Given generic exception — When handleGenericException — Then returns 500")
    void givenGenericException_whenHandle_thenReturns500() {
        Exception ex = new RuntimeException("Unexpected NPE");

        ResponseEntity<ApiError> response = handler.handleGenericException(ex, request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getStatus()).isEqualTo(500);
        assertThat(response.getBody().getPath()).isEqualTo("/api/v1/kudos");
    }
}
