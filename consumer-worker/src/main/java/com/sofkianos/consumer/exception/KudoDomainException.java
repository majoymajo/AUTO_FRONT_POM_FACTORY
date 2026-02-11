package com.sofkianos.consumer.exception;

/**
 * Base abstract exception for the Kudo domain.
 * <p>
 * All domain-specific exceptions within the Kudo bounded context
 * should extend this class. This enables a unified exception-handling
 * strategy at the application boundary (e.g., {@code @ControllerAdvice}).
 * </p>
 */
public abstract class KudoDomainException extends RuntimeException {

    protected KudoDomainException(String message) {
        super(message);
    }

    protected KudoDomainException(String message, Throwable cause) {
        super(message, cause);
    }
}
