package com.sofkianos.producer.infrastructure.exception;

import com.sofkianos.producer.domain.exception.KudoNotFoundException;
import com.sofkianos.producer.application.exception.KudoMessagingException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.bind.MissingServletRequestParameterException;

import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiError> handleValidationException(MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        String errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .collect(Collectors.joining(", "));
        log.warn("Validation failed: {}", errors);
        ApiError apiError = ApiError.of(HttpStatus.BAD_REQUEST, "Validation failed: " + errors,
                request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiError);
    }

    
    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiError> handleTypeMismatch(MethodArgumentTypeMismatchException ex,
            HttpServletRequest request) {
        String message = "Invalid value for parameter '" + ex.getName() + "': " + ex.getValue();
        ApiError apiError = ApiError.of(HttpStatus.BAD_REQUEST, message, request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiError);
    }

    
    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ApiError> handleMissingParam(MissingServletRequestParameterException ex,
            HttpServletRequest request) {
        String message = "Missing required parameter: '" + ex.getParameterName() + "'";
        ApiError apiError = ApiError.of(HttpStatus.BAD_REQUEST, message, request.getRequestURI());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(apiError);
    }

    
    @ExceptionHandler(KudoNotFoundException.class)
    public ResponseEntity<ApiError> handleKudoNotFound(KudoNotFoundException ex, HttpServletRequest request) {
        log.warn("Domain resource not found: {}", ex.getMessage());
        ApiError apiError = ApiError.of(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(apiError);
    }

    
    @ExceptionHandler(KudoMessagingException.class)
    public ResponseEntity<ApiError> handleKudoMessaging(KudoMessagingException ex, HttpServletRequest request) {
        log.error("Application messaging failure: {}", ex.getMessage());
        ApiError apiError = ApiError.of(HttpStatus.SERVICE_UNAVAILABLE, "Communication error: " + ex.getMessage(),
                request.getRequestURI());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(apiError);
    }

    
    @ExceptionHandler(KudoPublishingException.class)
    public ResponseEntity<ApiError> handleKudoPublishing(KudoPublishingException ex, HttpServletRequest request) {
        ApiError apiError = ApiError.of(HttpStatus.SERVICE_UNAVAILABLE, ex.getMessage(), request.getRequestURI());
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(apiError);
    }

    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(Exception ex, HttpServletRequest request) {
        log.error("Unexpected error: {}", ex.getMessage(), ex);
        ApiError apiError = ApiError.of(HttpStatus.INTERNAL_SERVER_ERROR, "Internal server error: " + ex.getMessage(),
                request.getRequestURI());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(apiError);
    }
}