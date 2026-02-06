package com.sofkianos.producer.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class KudosLoadTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private RabbitTemplate rabbitTemplate;

    @Test
    void stressTest_ConcurrentRequests() throws Exception {
        int numberOfRequests = 100;
        int concurrentThreads = 10;
        
        ExecutorService executor = Executors.newFixedThreadPool(concurrentThreads);
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        long startTime = System.currentTimeMillis();

        for (int i = 0; i < numberOfRequests; i++) {
            final int requestId = i;
            futures.add(CompletableFuture.runAsync(() -> {
                try {
                    mockMvc.perform(post("/api/v1/kudos")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("\"Stress test message " + requestId + "\""))
                            .andExpect(status().isAccepted());
                } catch (Exception e) {
                    throw new RuntimeException("Request failed during stress test", e);
                }
            }, executor));
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        
        long endTime = System.currentTimeMillis();
        System.out.println("Stress Test Completed: " + numberOfRequests + " requests in " + (endTime - startTime) + "ms");
        
        executor.shutdown();
    }
}
