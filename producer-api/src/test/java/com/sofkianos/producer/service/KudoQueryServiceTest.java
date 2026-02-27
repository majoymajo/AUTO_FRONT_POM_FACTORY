package com.sofkianos.producer.service;

import com.sofkianos.producer.domain.ports.out.KudoRepository;
import com.sofkianos.producer.domain.ports.out.KudoEventPublisher;
import com.sofkianos.producer.application.usecase.KudoServiceImpl;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;

@ExtendWith(MockitoExtension.class)
class KudoQueryServiceTest {

    @Mock
    private KudoRepository kudoRepository;

    @Mock
    private KudoEventPublisher kudoEventPublisher;

    @InjectMocks
    private KudoServiceImpl kudoQueryService;

    @Test
    @DisplayName("Should process Kudo and return accepted response")
    void sendKudo_ReturnsAcceptedResponse() {
        var kudoRequest = com.sofkianos.producer.application.dto.KudoRequest.builder()
            .from("juan.perez@sofka.com")
            .to("maria.garcia@sofka.com")
            .category("Teamwork")
            .message("Gran colaboración")
            .build();

        var response = kudoQueryService.sendKudo(kudoRequest);

        assertThat(response.getMessage()).isEqualTo("Kudo queued successfully");
        assertThat(response.getStatus()).isEqualTo("ACCEPTED");
    }

    @Test
    @DisplayName("Should process anonymous Kudo and return accepted response")
    void sendKudo_Anonymous_ReturnsAcceptedResponse() {
        var kudoRequest = com.sofkianos.producer.application.dto.KudoRequest.builder()
            .from(null)
            .to("maria.garcia@sofka.com")
            .category("Innovation")
            .message("Inspirador")
            .build();

        var response = kudoQueryService.sendKudo(kudoRequest);

        assertThat(response.getMessage()).isEqualTo("Kudo queued successfully");
        assertThat(response.getStatus()).isEqualTo("ACCEPTED");
    }
}