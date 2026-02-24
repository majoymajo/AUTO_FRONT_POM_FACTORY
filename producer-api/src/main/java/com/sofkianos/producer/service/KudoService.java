package com.sofkianos.producer.service;

import com.sofkianos.producer.dto.KudoRequest;

/**
 * Service interface for handling Kudos.
 */
public interface KudoService {

  /**
   * Processes a Kudo request and publishes it to the messaging system.
   *
   * @param kudoRequest the kudo to process
   * @return the response containing tracking details
   */
  com.sofkianos.producer.dto.KudoResponse sendKudo(KudoRequest kudoRequest);

  /**
   * Searches kudos matching the given criteria with pagination.
   *
   * @param criteria the search and pagination parameters
   * @return a page of {@link com.sofkianos.producer.dto.KudoListItemDTO} with safe, non-sensitive fields
   */
  org.springframework.data.domain.Page<com.sofkianos.producer.dto.KudoListItemDTO> searchKudos(com.sofkianos.producer.dto.KudoSearchCriteria criteria);
}
}