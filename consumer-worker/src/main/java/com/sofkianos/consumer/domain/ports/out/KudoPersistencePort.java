package com.sofkianos.consumer.domain.ports.out;

import com.sofkianos.consumer.entity.Kudo;

/**
 * Output Port — defines the contract for persisting a {@link Kudo} entity.
 * <p>
 * The domain service depends on this <strong>abstraction</strong>;
 * the infrastructure layer provides the concrete implementation
 * (e.g., JPA, MongoDB, in-memory for tests).
 * This is Dependency Inversion applied to the persistence layer.
 * </p>
 */
public interface KudoPersistencePort {

    /**
     * Persists the given Kudo entity and returns the saved instance
     * (potentially with a generated ID).
     *
     * @param kudo the entity to persist — must not be {@code null}
     * @return the persisted entity
     */
    Kudo save(Kudo kudo);
}
