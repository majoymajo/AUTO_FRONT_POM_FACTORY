package com.sofkianos.producer.infrastructure.controller.advice;

import com.sofkianos.producer.exception.KudoPublishingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Global exception handler for the Producer API.
 * <p>
 * Translates domain and infrastructure exceptions into
 * well-structured HTTP error responses.
 * </p>
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ── 503 Service Unavailable — messaging infrastructure failure ──────
    @ExceptionHandler(KudoPublishingException.class)
    public ResponseEntity<Map<String, Object>> handleKudoPublishingException(
            KudoPublishingException ex) {

        log.error("Messaging failure: {}", ex.getMessage(), ex);

        Map<String, Object> body = errorBody(
                HttpStatus.SERVICE_UNAVAILABLE,
                "The messaging service is temporarily unavailable. Please try again later.",
                ex.getMessage()
        );

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(body);
    }

    // ── 400 Bad Request — Bean Validation failures ──────────────────────
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        String errors = ex.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.joining("; "));

        log.warn("Validation failed: {}", errors);

        Map<String, Object> body = errorBody(
                HttpStatus.BAD_REQUEST,
                "Validation failed",
                errors
        );

        return ResponseEntity.badRequest().body(body);
    }

    // ── 404 Not Found — static resource requests (favicon, /, etc.) ────
    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<Map<String, Object>> handleNoResourceFound(
            NoResourceFoundException ex) {

        log.debug("Resource not found: {}", ex.getMessage());

        Map<String, Object> body = errorBody(
                HttpStatus.NOT_FOUND,
                "Resource not found",
                ex.getMessage()
        );

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    // ── 500 Internal Server Error — catch-all ───────────────────────────
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex) {

        log.error("Unexpected error: {}", ex.getMessage(), ex);

        Map<String, Object> body = errorBody(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred. Please contact support.",
                ex.getMessage()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    // ── Helper ──────────────────────────────────────────────────────────
    private Map<String, Object> errorBody(HttpStatus status, String error, String detail) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now().toString());
        body.put("status", status.value());
        body.put("error", error);
        body.put("detail", detail);
        return body;
    }
}
