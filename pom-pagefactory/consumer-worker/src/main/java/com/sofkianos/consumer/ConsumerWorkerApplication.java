package com.sofkianos.consumer;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/** Microservice entry point. Bootstrap pattern: starts Spring context and auto-configuration (AMQP, web). */
@SpringBootApplication
public class ConsumerWorkerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ConsumerWorkerApplication.class, args);
    }
}
