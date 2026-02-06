package com.sofkianos.consumer.controller;

import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/** Provides observability endpoints for container orchestration health checks. */
@RestController
@RequestMapping("/api/v1/health")
public class HealthController {

    @Operation(summary = "Check API status", description = "Returns 200 OK if service is reachable")
    @GetMapping
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Consumer Worker is running correctly!");
    }
}
