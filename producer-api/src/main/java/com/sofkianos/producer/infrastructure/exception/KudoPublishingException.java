package com.sofkianos.producer.infrastructure.exception;


public class KudoPublishingException extends RuntimeException {

    
    public KudoPublishingException(String message) {
        super(message);
    }

    
    public KudoPublishingException(String message, Throwable cause) {
        super(message, cause);
    }
}