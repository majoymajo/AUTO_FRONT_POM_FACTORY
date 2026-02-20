package com.sofkianos.producer.controller;

import com.sofkianos.producer.dto.KudoRequest;
import com.sofkianos.producer.service.KudoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * REST controller that accepts Kudos and delegates to the service layer.
 */
@RestController
@RequestMapping("/api/v1/kudos")
@RequiredArgsConstructor
public class KudosController {

  private final KudoService kudoService;

  @PostMapping
  public ResponseEntity<com.sofkianos.producer.dto.KudoResponse> publishKudos(@Valid @RequestBody KudoRequest payload) {
    var response = kudoService.sendKudo(payload);
    return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
  }
}