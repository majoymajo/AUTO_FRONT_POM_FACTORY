// package com.sofkianos.producer.controller;

// import com.sofkianos.producer.application.dto.KudoResponse;
// import com.sofkianos.producer.application.ports.in.KudoService;
// import com.sofkianos.producer.infrastructure.inbound.web.KudosController;
// import org.junit.jupiter.api.DisplayName;
// import org.junit.jupiter.api.Test;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
// import org.springframework.boot.test.mock.mockito.MockBean;
// import org.springframework.test.web.servlet.MockMvc;

// import java.time.LocalDateTime;
// import java.util.Collections;
// import java.util.List;

// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.when;
// import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
// import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// @WebMvcTest(KudosController.class)
// class KudosControllerGetTest {

//     @Autowired
//     private MockMvc mockMvc;

//     @MockBean
//     private KudoService kudoService;

//     @Test
//     @DisplayName("GET /api/v1/kudos should return 200 OK with content")
//     void getKudos_ReturnsOkWithContent() throws Exception {
//         var kudoResponse = KudoResponse.builder()
//             .id("1")
//             .message("Gracias!")
//             .status("OK")
//             .timestamp(LocalDateTime.now())
//             .build();
//         when(kudoService.getKudos(any())).thenReturn(List.of(kudoResponse));
//         mockMvc.perform(get("/api/v1/kudos"))
//             .andExpect(status().isOk())
//             .andExpect(jsonPath("$[0].message").value("Gracias!"));
//     }

//     @Test
//     @DisplayName("GET /api/v1/kudos with empty results should return 200 OK")
//     void getKudos_Empty_ReturnsOk() throws Exception {
//         when(kudoService.getKudos(any())).thenReturn(Collections.emptyList());
//         mockMvc.perform(get("/api/v1/kudos"))
//             .andExpect(status().isOk())
//             .andExpect(jsonPath("$").isEmpty());
//     }
// }