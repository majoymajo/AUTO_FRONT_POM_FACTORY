package com.sofkianos.producer.domain.ports.in.validation;

import com.sofkianos.producer.domain.model.Kudo;


public interface KudoValidationStrategy {
    
    void validate(Kudo kudo);
}