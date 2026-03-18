package com.sofkianos.producer.application.exception;


public class KudoMessagingException extends KudoApplicationException {
    public KudoMessagingException(String message) {
        super(message);
    }

    public KudoMessagingException(String message, Throwable cause) {
        super(message, cause);
    }
}