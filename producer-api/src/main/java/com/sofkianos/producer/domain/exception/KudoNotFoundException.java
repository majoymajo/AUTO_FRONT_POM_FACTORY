package com.sofkianos.producer.domain.exception;


public class KudoNotFoundException extends DomainException {
    public KudoNotFoundException(String message) {
        super(message);
    }
}