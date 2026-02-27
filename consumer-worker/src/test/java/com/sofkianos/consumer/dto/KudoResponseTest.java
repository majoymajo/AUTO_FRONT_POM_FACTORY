package com.sofkianos.consumer.dto;

import com.sofkianos.consumer.domain.model.KudoCategory;
import com.sofkianos.consumer.entity.Kudo;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

class KudoResponseTest {

    @Test
    @DisplayName("fromEntity() — Should map all fields correctly")
    void fromEntity_mapsAllFields() {
        LocalDateTime now = LocalDateTime.now();
        Kudo kudo = Kudo.builder()
                .id(123L)
                .fromUser("alice@sofka.com")
                .toUser("bob@sofka.com")
                .category(KudoCategory.TEAMWORK)
                .message("Great job!")
                .createdAt(now)
                .build();

        KudoResponse response = KudoResponse.fromEntity(kudo);

        assertThat(response.getId()).isEqualTo(123L);
        assertThat(response.getFromUser()).isEqualTo("alice@sofka.com");
        assertThat(response.getToUser()).isEqualTo("bob@sofka.com");
        assertThat(response.getCategory()).isEqualTo("TEAMWORK");
        assertThat(response.getMessage()).isEqualTo("Great job!");
        assertThat(response.getCreatedAt()).isEqualTo(now);
    }

    @Test
    @DisplayName("fromEntity() — Should handle null category")
    void fromEntity_handlesNullCategory() {
        Kudo kudo = Kudo.builder()
                .fromUser("Alice")
                .toUser("Bob")
                .category(KudoCategory.TEAMWORK)
                .message("Msg")
                .build();

        // Use reflection to nullify category for the mapping test
        org.springframework.test.util.ReflectionTestUtils.setField(kudo, "category", null);

        KudoResponse response = KudoResponse.fromEntity(kudo);

        assertThat(response.getCategory()).isNull();
    }
}
