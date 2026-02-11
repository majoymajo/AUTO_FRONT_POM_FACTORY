package com.sofkianos.producer.exception;

/**
 * Thrown when publishing a {@link com.sofkianos.producer.domain.events.KudoEvent}
 * to the message broker fails (e.g., serialization error, broker unavailability).
 * <p>
 * Caught by the {@code GlobalExceptionHandler} and mapped to
 * <strong>503 Service Unavailable</strong>.
 * </p>
 */
public class KudoPublishingException extends RuntimeException {

    public KudoPublishingException(String message) {
        super(message);
    }

    public KudoPublishingException(String message, Throwable cause) {
        super(message, cause);
    }
}
