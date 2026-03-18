package com.sofkianos.producer.domain.ports.out;


import com.sofkianos.producer.domain.model.Kudo;


public interface KudoEventPublisher {
    
    void publish(Kudo kudo);
}