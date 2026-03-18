package com.sofkianos.consumer.infrastructure.exception;


public abstract class KudoDomainException extends RuntimeException {

    
    protected KudoDomainException(String message) {
        super(message);
    }

    
    protected KudoDomainException(String message, Throwable cause) {
        super(message, cause);
    }
}