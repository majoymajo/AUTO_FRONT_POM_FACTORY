package com.sofkianos.producer.application.ports.in;

import com.sofkianos.producer.application.dto.KudoListItemDTO;
import com.sofkianos.producer.application.dto.KudoRequest;
import com.sofkianos.producer.application.dto.KudoResponse;
import com.sofkianos.producer.application.dto.KudoSearchCriteria;
import org.springframework.data.domain.Page;

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
  KudoResponse sendKudo(KudoRequest kudoRequest);

  /**
   * Searches kudos matching the given criteria with pagination.
   *
   * @param criteria the search and pagination parameters
   * @return a page of {@link KudoListItemDTO} with safe, non-sensitive fields
   */
  Page<KudoListItemDTO> searchKudos(KudoSearchCriteria criteria);
}