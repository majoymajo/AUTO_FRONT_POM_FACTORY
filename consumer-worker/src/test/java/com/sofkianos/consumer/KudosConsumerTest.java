package com.sofkianos.consumer;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

/**
 * Unit tests for {@link KudosConsumer}.
 */
class KudosConsumerTest {

    @Test
    @DisplayName("receiveKudo processes message and completes without exception")
    void receiveKudo_processesMessageWithoutException() {
        KudosConsumer consumer = new KudosConsumer();
        String message = "Great job on the release!";

        assertDoesNotThrow(() -> consumer.handleKudo(message));
    }
}
