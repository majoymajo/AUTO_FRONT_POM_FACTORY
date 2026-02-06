package com.sofkianos.producer.service.impl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sofkianos.producer.dto.KudoRequest;
import com.sofkianos.producer.service.KudoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/**
 * Implementation of KudoService.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KudoServiceImpl implements KudoService {

  private final RabbitTemplate rabbitTemplate;
  private final ObjectMapper objectMapper;

  @Value("${app.rabbitmq.exchange}")
  private String exchangeName;

  @Value("${app.rabbitmq.routing-key}")
  private String routingKey;

  @Override
  public void sendKudo(KudoRequest kudoRequest) {
    try {
      String jsonPayload = objectMapper.writeValueAsString(kudoRequest);
      log.info("Transitioning Kudo to messaging system: from={}, to={}", kudoRequest.getFrom(),
          kudoRequest.getTo());
      rabbitTemplate.convertAndSend(exchangeName, routingKey, jsonPayload);
    } catch (JsonProcessingException e) {
      log.error("Failed to serialize KudoRequest", e);
      throw new RuntimeException("Error processing message", e);
    }
  }
}