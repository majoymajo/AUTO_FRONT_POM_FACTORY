package com.sofkianos.producer.service;

import com.sofkianos.producer.application.dto.KudoListItemDTO;
import com.sofkianos.producer.application.dto.KudoSearchCriteria;
import com.sofkianos.producer.domain.model.Kudo;
import com.sofkianos.producer.domain.model.PagedResult;
import com.sofkianos.producer.domain.ports.out.KudoRepository;
import com.sofkianos.producer.domain.valueobject.KudoCategory;
import com.sofkianos.producer.application.usecase.KudoServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class KudoQueryServiceTest {
        @Mock
        private KudoRepository kudoRepository;

        @InjectMocks
        private KudoServiceImpl kudoQueryService;

        @Test
        @DisplayName("Should map Kudo model to KudoListItemDTO without sensitive data")
        void searchKudos_MapsEntityToDTO_NoSensitiveData() {
                var kudo = new Kudo(1L, "juan.perez@sofka.com", "maria.garcia@sofka.com",
                                KudoCategory.Teamwork, "Gran colaboración", LocalDateTime.now());

                var pagedResult = new PagedResult<>(List.of(kudo), 1, 1, 0, 10);

                when(kudoRepository.search(anyString(), anyString(), anyInt(), anyInt(), anyString()))
                                .thenReturn(pagedResult);

                var criteria = KudoSearchCriteria.builder().build();

                PagedResult<KudoListItemDTO> result = kudoQueryService.searchKudos(criteria);

                assertThat(result.content()).hasSize(1);
                var dto = result.content().get(0);
                assertThat(dto.getReceptor()).doesNotContain("@");
                assertThat(dto.getEmisor()).doesNotContain("@");
                assertThat(dto.getMensaje()).isEqualTo("Gran colaboración");
        }

        @Test
        @DisplayName("Should handle null emisor (anonymous kudo) gracefully")
        void searchKudos_NullEmisor_ReturnsAnonymous() {
                var kudo = new Kudo(1L, null, "maria.garcia@sofka.com",
                                KudoCategory.Innovation, "Inspirador", LocalDateTime.now());

                var pagedResult = new PagedResult<>(List.of(kudo), 1, 1, 0, 10);

                when(kudoRepository.search(anyString(), anyString(), anyInt(), anyInt(), anyString()))
                                .thenReturn(pagedResult);

                var criteria = KudoSearchCriteria.builder().build();

                PagedResult<KudoListItemDTO> result = kudoQueryService.searchKudos(criteria);

                var dto = result.content().get(0);
                assertThat(dto.getEmisor()).isEqualTo("Anónimo");
        }
}
