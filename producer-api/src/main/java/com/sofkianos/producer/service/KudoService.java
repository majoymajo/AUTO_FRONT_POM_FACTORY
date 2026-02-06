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
   */
  void sendKudo(KudoRequest kudoRequest);
}