package com.sofkianos.consumer.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sofkianos.consumer.entity.Kudo;
import com.sofkianos.consumer.repository.KudoRepository;
import com.sofkianos.consumer.service.KudoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Slf4j
@Service
@RequiredArgsConstructor
public class KudoServiceImpl implements KudoService {

  private final KudoRepository kudoRepository;
  private final ObjectMapper objectMapper;

  @Override
  public void saveKudo(String kudoJson) {
    try {
      JsonNode root = objectMapper.readTree(kudoJson);

      Kudo kudo = Kudo.builder()
          .fromUser(root.path("from").asText())
          .toUser(root.path("to").asText())
          .category(root.path("category").asText())
          .message(root.path("message").asText())
          .createdAt(LocalDateTime.now())
          .build();

      kudoRepository.save(kudo);
      log.info("Kudo persisted successfully: {}", kudo);
    } catch (JsonProcessingException e) {
      log.error("Failed to parse kudo JSON: {}", kudoJson, e);
      throw new RuntimeException("Error parsing message", e);
    }
  }
}