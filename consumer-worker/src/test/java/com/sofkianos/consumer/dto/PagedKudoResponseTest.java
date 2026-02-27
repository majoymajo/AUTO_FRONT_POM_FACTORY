package com.sofkianos.consumer.dto;

import com.sofkianos.consumer.domain.model.KudoCategory;
import com.sofkianos.consumer.entity.Kudo;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class PagedKudoResponseTest {

    @Test
    @DisplayName("from() — Should map Page Metadata and Content")
    void from_mapsPageCorrectly() {
        Kudo kudo = Kudo.builder()
                .id(1L)
                .fromUser("Alice")
                .toUser("Bob")
                .category(KudoCategory.TEAMWORK)
                .message("Msg")
                .build();
        Page<Kudo> page = new PageImpl<>(List.of(kudo));

        PagedKudoResponse response = PagedKudoResponse.from(page);

        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getContent().get(0).getId()).isEqualTo(1L);
        assertThat(response.getTotalElements()).isEqualTo(1);
        assertThat(response.getTotalPages()).isEqualTo(1);
        assertThat(response.getPage()).isEqualTo(0);
        assertThat(response.getSize()).isEqualTo(1);
    }
}
