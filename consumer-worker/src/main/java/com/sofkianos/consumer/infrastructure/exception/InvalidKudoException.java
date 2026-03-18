package com.sofkianos.consumer.infrastructure.exception;


public class InvalidKudoException extends KudoDomainException {

    
    public InvalidKudoException(String message) {
        super(message);
    }

    
    public InvalidKudoException(String message, Throwable cause) {
        super(message, cause);
    }
}