package com.sofkianos.consumer.exception;

/**
 * Thrown when a {@link com.sofkianos.consumer.entity.Kudo} fails
 * domain-level validation (e.g., null fields, self-kudo attempt).
 */
public class InvalidKudoException extends KudoDomainException {

    public InvalidKudoException(String message) {
        super(message);
    }

    public InvalidKudoException(String message, Throwable cause) {
        super(message, cause);
    }
}
