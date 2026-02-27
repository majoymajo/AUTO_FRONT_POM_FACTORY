package com.sofkianos.consumer.controller;

import com.sofkianos.consumer.dto.PagedKudoResponse;
import com.sofkianos.consumer.service.KudoService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * Pure unit test for Consumer KudosController.
 */
@ExtendWith(MockitoExtension.class)
class KudosControllerUnitTest {

    @Mock
    private KudoService kudoService;

    private KudosController controller;

    @BeforeEach
    void setUp() {
        controller = new KudosController(kudoService);
    }

    @Test
    @DisplayName("GET /api/v1/kudos — When searchKudos succeeds — Then returns 200 OK with data")
    void getKudos_returnsOkWithData() {
        PagedKudoResponse mockResponse = PagedKudoResponse.builder()
                .content(List.of())
                .page(0)
                .size(20)
                .totalElements(0)
                .totalPages(0)
                .build();

        when(kudoService.searchKudos(any())).thenReturn(mockResponse);

        ResponseEntity<PagedKudoResponse> response = controller.getKudos(0, 20, "DESC", null, null);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(mockResponse);
    }
}
