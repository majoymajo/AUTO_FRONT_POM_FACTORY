package com.sofkianos.producer.application.usecase;

import com.sofkianos.producer.application.dto.KudoRequest;
import com.sofkianos.producer.application.dto.KudoResponse;
import com.sofkianos.producer.application.exception.KudoMessagingException;
import com.sofkianos.producer.domain.ports.out.KudoEventPublisher;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

/**
 * US-004 / RP-01 — KudoServiceImpl unit tests.
 * Validates Kudo creation, publishing, and error handling
 * after Clean Architecture migration.
 */
@ExtendWith(MockitoExtension.class)
class KudoServiceImplTest {

    @Mock
    private KudoEventPublisher kudoEventPublisher;

    private KudoServiceImpl kudoService;

    @BeforeEach
    void setUp() {
        kudoService = new KudoServiceImpl(kudoEventPublisher);
    }

    @Test
    @DisplayName("Given valid request — When sendKudo — Then returns ACCEPTED response with trackingId")
    void givenValidRequest_whenSendKudo_thenReturnsAccepted() {
        KudoRequest request = KudoRequest.builder()
                .from("alice@sofka.com")
                .to("bob@sofka.com")
                .category("Teamwork")
                .message("Great sprint delivery!")
                .build();

        KudoResponse response = kudoService.sendKudo(request);

        assertThat(response.getStatus()).isEqualTo("ACCEPTED");
        assertThat(response.getMessage()).isEqualTo("Kudo queued successfully");
        assertThat(response.getId()).isNotBlank();
        assertThat(response.getTimestamp()).isNotNull();
    }

    @Test
    @DisplayName("Given valid request — When sendKudo — Then publisher is called exactly once")
    void givenValidRequest_whenSendKudo_thenPublisherCalledOnce() {
        KudoRequest request = KudoRequest.builder()
                .from("alice@sofka.com")
                .to("bob@sofka.com")
                .category("Innovation")
                .message("Amazing idea!")
                .build();

        kudoService.sendKudo(request);

        verify(kudoEventPublisher, times(1)).publish(any());
    }

    @Test
    @DisplayName("Given publisher throws — When sendKudo — Then KudoMessagingException propagates")
    void givenPublisherThrows_whenSendKudo_thenExceptionPropagates() {
        doThrow(new KudoMessagingException("Broker down"))
                .when(kudoEventPublisher).publish(any());

        KudoRequest request = KudoRequest.builder()
                .from("alice@sofka.com")
                .to("bob@sofka.com")
                .category("Passion")
                .message("Keep up the great work!")
                .build();

        assertThatThrownBy(() -> kudoService.sendKudo(request))
                .isInstanceOf(KudoMessagingException.class)
                .hasMessageContaining("Broker down");
    }

    @Test
    @DisplayName("Given invalid category — When sendKudo — Then throws IllegalArgumentException")
    void givenInvalidCategory_whenSendKudo_thenThrowsIllegalArgument() {
        KudoRequest request = KudoRequest.builder()
                .from("alice@sofka.com")
                .to("bob@sofka.com")
                .category("INVALID_CATEGORY")
                .message("Test message here")
                .build();

        assertThatThrownBy(() -> kudoService.sendKudo(request))
                .isInstanceOf(IllegalArgumentException.class);

        verify(kudoEventPublisher, never()).publish(any());
    }

    @Test
    @DisplayName("Given all valid categories — When sendKudo — Then each succeeds")
    void givenAllCategories_whenSendKudo_thenEachSucceeds() {
        String[] categories = { "Innovation", "Teamwork", "Passion", "Mastery" };

        for (String cat : categories) {
            KudoRequest request = KudoRequest.builder()
                    .from("a@sofka.com")
                    .to("b@sofka.com")
                    .category(cat)
                    .message("Valid message for " + cat)
                    .build();

            KudoResponse response = kudoService.sendKudo(request);
            assertThat(response.getStatus()).isEqualTo("ACCEPTED");
        }

        verify(kudoEventPublisher, times(4)).publish(any());
    }
}
