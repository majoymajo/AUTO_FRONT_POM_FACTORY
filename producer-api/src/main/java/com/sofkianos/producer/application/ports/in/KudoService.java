package com.sofkianos.producer.application.ports.in;

import com.sofkianos.producer.application.dto.KudoRequest;
import com.sofkianos.producer.application.dto.KudoResponse;


public interface KudoService {
  
  KudoResponse sendKudo(KudoRequest kudoRequest);
}