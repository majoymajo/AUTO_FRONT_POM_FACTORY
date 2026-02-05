package com.sofkianos.producer.controller;

import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/kudos")
public class KudosController {

    private final RabbitTemplate rabbitTemplate;
    private final String exchangeName;
    private final String routingKey;

    public KudosController(
            RabbitTemplate rabbitTemplate,
            @Value("${app.rabbitmq.exchange}") String exchangeName,
            @Value("${app.rabbitmq.routing-key}") String routingKey
    ) {
        this.rabbitTemplate = rabbitTemplate;
        this.exchangeName = exchangeName;
        this.routingKey = routingKey;
    }

    @PostMapping
    public ResponseEntity<Void> publishKudos(@RequestBody(required = false) String payload) {
        if (!StringUtils.hasText(payload)) {
            return ResponseEntity.badRequest().build();
        }

        rabbitTemplate.convertAndSend(exchangeName, routingKey, payload);
        return ResponseEntity.status(HttpStatus.ACCEPTED).build();
    }
}
