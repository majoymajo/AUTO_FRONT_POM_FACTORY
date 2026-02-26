package com.sofkianos.producer.domain.ports.out;

import com.sofkianos.producer.domain.model.Kudo;
import com.sofkianos.producer.domain.model.PagedResult;

import java.util.Optional;

/**
 * Puerto de Salida para persistencia de Kudos.
 * Desacopla el dominio de Spring Data JPA.
 */
public interface KudoRepository {
    Kudo save(Kudo kudo);
    Optional<Kudo> findById(Long id);
    PagedResult<Kudo> search(String category, String searchText, int page, int size, String sortDirection);
}
