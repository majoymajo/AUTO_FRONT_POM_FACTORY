package com.sofkianos.producer.domain.ports.out;

import com.sofkianos.producer.application.dto.KudoSearchCriteria;
import com.sofkianos.producer.domain.model.Kudo;
import org.springframework.data.domain.Page;

import java.util.Optional;

/**
 * Output Port for Kudo persistence operations.
 * Decouples the domain from Spring Data JPA.
 */
public interface KudoRepository {
    Kudo save(Kudo kudo);
    Optional<Kudo> findById(Long id);
    Page<Kudo> search(KudoSearchCriteria criteria);
}
