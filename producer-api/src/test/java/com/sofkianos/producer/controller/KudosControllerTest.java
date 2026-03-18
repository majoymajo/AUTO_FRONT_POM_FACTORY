package com.sofkianos.producer.controller;

import com.sofkianos.producer.application.dto.KudoRequest;
import com.sofkianos.producer.application.dto.KudoResponse;
import com.sofkianos.producer.application.ports.in.KudoService;
import com.sofkianos.producer.infrastructure.inbound.web.KudosController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KudosControllerTest {

    @Mock
    private KudoService kudoService;

    private KudosController kudosController;

    @BeforeEach
    void setUp() {
        kudosController = new KudosController(kudoService);
    }

    @Test
    void publishKudos_WithValidPayload_ReturnsAccepted() {