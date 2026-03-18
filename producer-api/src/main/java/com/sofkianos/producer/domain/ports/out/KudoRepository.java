package com.sofkianos.producer.domain.ports.out;

import com.sofkianos.producer.domain.model.Kudo;

import java.util.Optional;


public interface KudoRepository {
    Kudo save(Kudo kudo);
    Optional<Kudo> findById(Long id);
}