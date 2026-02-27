package com.sofkianos.producer.controller;

import com.sofkianos.producer.domain.model.Kudo;
import com.sofkianos.producer.domain.valueobject.KudoCategory;
import com.sofkianos.producer.infrastructure.repository.KudoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;
import java.util.stream.IntStream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Testcontainers
@SpringBootTest
@AutoConfigureMockMvc
class KudosControllerIntegrationTest {

    @Container
    @ServiceConnection
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:15-alpine");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private KudoRepository kudoRepository;

    @Test
    @DisplayName("INT-002: GET /api/v1/kudos con filtros combinados retorna solo los kudos correctos")
    void getKudosWithCombinedFilters_ReturnsFilteredResults() throws Exception {
        // Poblar la base de datos con 45 kudos en 4 categorías y fechas variadas
        kudoRepository.deleteAll();
        IntStream.rangeClosed(1, 45).forEach(i -> {
            KudoCategory category = KudoCategory.values()[i % 4];
            LocalDateTime date = LocalDateTime.of(2026, 2, (i % 10) + 1, 10, 0);
            String message = (i % 3 == 0) ? "Gran proyecto realizado" : "Otro mensaje";
            Kudo kudo = new Kudo(null, "UserA", "UserB", category, message, date);
            kudoRepository.save(kudo);
        });

        // Ejecutar GET con filtros combinados
        mockMvc.perform(get("/api/v1/kudos")
                .param("category", "TEAMWORK")
                .param("startDate", "2026-02-01")
                .param("endDate", "2026-02-10")
                .param("searchText", "proyecto"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].category").value("TEAMWORK"))
                .andExpect(jsonPath("$[0].message").containsString("proyecto"))
                .andExpect(jsonPath("$[0].timestamp").value(org.hamcrest.Matchers.startsWith("2026-02")));

        // Validar que todos los resultados cumplen los tres criterios
        var results = kudoRepository.findAll();
        results.stream()
                .filter(k -> k.getCategory() == KudoCategory.Teamwork
                        && k.getMessage().contains("proyecto")
                        && !k.getCreatedAt().isBefore(LocalDateTime.of(2026, 2, 1, 0, 0))
                        && !k.getCreatedAt().isAfter(LocalDateTime.of(2026, 2, 10, 23, 59)))
                .forEach(k -> assertThat(k.getCategory()).isEqualTo(KudoCategory.Teamwork));
    }
}
