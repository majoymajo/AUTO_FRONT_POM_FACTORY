package com.sofkianos.consumer.service.impl;

import com.sofkianos.consumer.domain.events.KudoEvent;
import com.sofkianos.consumer.domain.ports.out.KudoPersistencePort;
import com.sofkianos.consumer.dto.KudoSearchCriteria;
import com.sofkianos.consumer.dto.PagedKudoResponse;
import com.sofkianos.consumer.entity.Kudo;
import com.sofkianos.consumer.infrastructure.exception.InvalidKudoException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class KudoServiceImplTest {

    @Mock
    private KudoPersistencePort persistencePort;

    private KudoServiceImpl service;

    @BeforeEach
    void setUp() {
        service = new KudoServiceImpl(persistencePort);
    }

    @Test
    @DisplayName("Given valid KudoEvent — When saveKudo — Then maps and saves to persistence")
    void givenValidEvent_whenSaveKudo_thenSaves() {
        LocalDateTime now = LocalDateTime.now();
        KudoEvent event = KudoEvent.builder()
                .from("alice@sofka.com")
                .to("bob@sofka.com")
                .category("INNOVATION")
                .message("Well done!")
                .timestamp(now)
                .build();

        service.saveKudo(event);

        ArgumentCaptor<Kudo> captor = ArgumentCaptor.forClass(Kudo.class);
        verify(persistencePort).save(captor.capture());

        Kudo saved = captor.getValue();
        assertThat(saved.getFromUser()).isEqualTo("alice@sofka.com");
        assertThat(saved.getToUser()).isEqualTo("bob@sofka.com");
        assertThat(saved.getMessage()).isEqualTo("Well done!");
        assertThat(saved.getCreatedAt()).isEqualTo(now);
    }

    @Test
    @DisplayName("Given event with missing fields — When saveKudo — Then throws InvalidKudoException")
    void givenInvalidEvent_whenSaveKudo_thenThrows() {
        KudoEvent event = KudoEvent.builder()
                .from("")
                .to("bob@sofka.com")
                .message("msg")
                .build();

        assertThatThrownBy(() -> service.saveKudo(event))
                .isInstanceOf(InvalidKudoException.class);

        verify(persistencePort, never()).save(any());
    }

    @Test
    @DisplayName("Given null event — When saveKudo — Then throws InvalidKudoException")
    void givenNullEvent_whenSaveKudo_thenThrows() {
        assertThatThrownBy(() -> service.saveKudo(null))
                .isInstanceOf(InvalidKudoException.class);
    }

    @Test
    @DisplayName("Given valid criteria — When searchKudos — Then calls persistence and returns paged response")
    void givenCriteria_whenSearchKudos_thenReturnsPagedResponse() {
        KudoSearchCriteria criteria = KudoSearchCriteria.builder()
                .page(0)
                .size(10)
                .category("TEAMWORK")
                .searchText("great")
                .build();

        Page<Kudo> page = new PageImpl<>(List.of());
        when(persistencePort.findKudos(any(), any(), any())).thenReturn(page);

        PagedKudoResponse response = service.searchKudos(criteria);

        assertThat(response).isNotNull();
        verify(persistencePort).findKudos(
                eq(Optional.of("TEAMWORK")),
                eq(Optional.of("great")),
                any(Pageable.class));
    }

    @Test
    @DisplayName("Given blank criteria fields — When searchKudos — Then passes empty optionals")
    void givenBlankCriteria_whenSearchKudos_thenPassesEmptyOptionals() {
        KudoSearchCriteria criteria = KudoSearchCriteria.builder()
                .page(0)
                .size(10)
                .category("  ")
                .searchText("")
                .build();

        Page<Kudo> page = new PageImpl<>(List.of());
        when(persistencePort.findKudos(any(), any(), any())).thenReturn(page);

        service.searchKudos(criteria);

        verify(persistencePort).findKudos(
                eq(Optional.empty()),
                eq(Optional.empty()),
                any(Pageable.class));
    }
}
