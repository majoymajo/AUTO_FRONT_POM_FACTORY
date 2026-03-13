package com.sofkianos.consumer.infrastructure.messaging.mapper;

import com.sofkianos.consumer.domain.events.KudoEvent;
import com.sofkianos.consumer.infrastructure.messaging.dto.KudoEventDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class KudoEventMapperTest {

    private KudoEventMapper mapper;

    @BeforeEach
    void setUp() {
        mapper = new KudoEventMapper();
    }

    @Test
    @DisplayName("Should map DTO to Domain Event correctly")
    void shouldMap_WhenDtoIsValid() {
        LocalDateTime now = LocalDateTime.now();
        KudoEventDTO dto = new KudoEventDTO();
        dto.setFromUser("alice@sofkianos.com");
        dto.setToUser("bob@sofkianos.com");
        dto.setCategory("INNOVATION");
        dto.setMessage("Great job!");
        dto.setCreatedAt(now);

        KudoEvent event = mapper.toDomain(dto);

        assertThat(event.getFrom()).isEqualTo("alice@sofkianos.com");
        assertThat(event.getTo()).isEqualTo("bob@sofkianos.com");
        assertThat(event.getCategory()).isEqualTo("INNOVATION");
        assertThat(event.getMessage()).isEqualTo("Great job!");
        assertThat(event.getTimestamp()).isEqualTo(now);
    }

    @Test
    @DisplayName("Should map DTO with null fields to Domain Event with null fields")
    void shouldMap_WhenDtoFieldsAreNull() {
        KudoEventDTO dto = new KudoEventDTO();
        // All fields null by default

        KudoEvent event = mapper.toDomain(dto);

        assertThat(event.getFrom()).isNull();
        assertThat(event.getTo()).isNull();
        assertThat(event.getCategory()).isNull();
        assertThat(event.getMessage()).isNull();
        assertThat(event.getTimestamp()).isNull();
    }

    @Test
    @DisplayName("Should return null when DTO is null")
    void shouldReturnNullWhenDtoIsNull() {
        assertThat(mapper.toDomain(null)).isNull();
    }
}
