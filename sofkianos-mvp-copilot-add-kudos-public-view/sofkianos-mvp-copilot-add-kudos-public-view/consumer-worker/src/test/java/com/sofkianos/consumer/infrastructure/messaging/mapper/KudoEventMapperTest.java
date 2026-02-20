package com.sofkianos.consumer.infrastructure.messaging.mapper;

import com.sofkianos.consumer.domain.events.KudoEvent;
import com.sofkianos.consumer.infrastructure.messaging.dto.KudoEventDTO;
import org.junit.jupiter.api.Test;
import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class KudoEventMapperTest {

    private final KudoEventMapper mapper = new KudoEventMapper();

    @Test
    void shouldMapDtoToDomain() {
        // Given
        LocalDateTime now = LocalDateTime.now();
        KudoEventDTO dto = new KudoEventDTO(
                1L,
                "alice@example.com",
                "bob@example.com",
                "TEAMWORK",
                "Great job!",
                now
        );

        // When
        KudoEvent domain = mapper.toDomain(dto);

        // Then
        assertThat(domain).isNotNull();
        assertThat(domain.getFrom()).isEqualTo("alice@example.com");
        assertThat(domain.getTo()).isEqualTo("bob@example.com");
        assertThat(domain.getCategory()).isEqualTo("TEAMWORK");
        assertThat(domain.getMessage()).isEqualTo("Great job!");
        assertThat(domain.getTimestamp()).isEqualTo(now);
    }

    @Test
    void shouldReturnNullWhenDtoIsNull() {
        assertThat(mapper.toDomain(null)).isNull();
    }
}
