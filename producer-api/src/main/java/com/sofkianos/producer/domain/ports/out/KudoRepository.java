package com.sofkianos.producer.domain.ports.out;

import com.sofkianos.producer.domain.model.Kudo;
import java.util.Optional;

/**
 * Output Port for Kudo persistence operations.
 * Decouples the domain from Spring Data JPA.
 */
public interface KudoRepository {
    /**
     * Persists a Kudo domain model.
     * 
     * @param kudo the kudo to save
     * @return the saved kudo with generated ID
     */
    Kudo save(Kudo kudo);

    /**
     * Finds a kudo by its ID.
     * 
     * @param id the id to search for
     * @return optional containing the found kudo
     */
    Optional<Kudo> findById(Long id);
}
