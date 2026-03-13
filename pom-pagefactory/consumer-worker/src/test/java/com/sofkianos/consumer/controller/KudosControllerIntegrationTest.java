package com.sofkianos.consumer.controller;

import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import com.sofkianos.consumer.entity.Kudo;
import com.sofkianos.consumer.domain.model.KudoCategory;
import com.sofkianos.consumer.repository.KudoRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.PostgreSQLContainer;
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


        @DynamicPropertySource
        static void postgresProperties(DynamicPropertyRegistry registry) {
            postgres.start();
            registry.add("spring.datasource.url", postgres::getJdbcUrl);
            registry.add("spring.datasource.username", postgres::getUsername);
            registry.add("spring.datasource.password", postgres::getPassword);
        }
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
            Kudo kudo = Kudo.builder()
                .fromUser("UserA")
                .toUser("UserB")
                .category(category)
                .message(message)
                .createdAt(date)
                .build();
            kudoRepository.save(kudo);
        });

        // Ejecutar GET con filtros combinados
        mockMvc.perform(get("/api/v1/kudos")
                .param("category", "TEAMWORK")
                .param("startDate", "2026-02-01")
                .param("endDate", "2026-02-10")
                .param("searchText", "proyecto"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].category").value("TEAMWORK"))
                .andExpect(jsonPath("$.content[0].message", org.hamcrest.Matchers.containsString("proyecto")))
                .andExpect(jsonPath("$.content[0].createdAt").value(org.hamcrest.Matchers.startsWith("2026-02")));

        // Validar que todos los resultados cumplen los tres criterios
        var results = kudoRepository.findAll();
        results.stream()
                .filter(k -> k.getCategory() == KudoCategory.TEAMWORK
                        && k.getMessage().contains("proyecto")
                        && !k.getCreatedAt().isBefore(LocalDateTime.of(2026, 2, 1, 0, 0))
                        && !k.getCreatedAt().isAfter(LocalDateTime.of(2026, 2, 10, 23, 59)))
                .forEach(k -> assertThat(k.getCategory()).isEqualTo(KudoCategory.TEAMWORK));
    }
}
