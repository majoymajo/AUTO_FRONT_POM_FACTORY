package com.sofkianos.producer.application.exception;


public abstract class KudoApplicationException extends RuntimeException {
    protected KudoApplicationException(String message) {
        super(message);
    }

    protected KudoApplicationException(String message, Throwable cause) {
        super(message, cause);
    }
}