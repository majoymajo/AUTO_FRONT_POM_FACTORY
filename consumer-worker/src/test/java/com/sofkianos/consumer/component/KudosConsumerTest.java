package com.sofkianos.consumer.component;

import com.sofkianos.consumer.service.KudoService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.times;

/**
 * Unit tests for {@link KudosConsumer}.
 */
@ExtendWith(MockitoExtension.class)
class KudosConsumerTest {

  @Mock
  private KudoService kudoService;

  @Test
  @DisplayName("receiveKudo processes message and completes without exception")
  void receiveKudo_processesMessageWithoutException() {
    KudosConsumer consumer = new KudosConsumer(kudoService);
    String message = "{\"from\":\"a\",\"to\":\"b\",\"category\":\"Passion\",\"message\":\"msg\"}";

    assertDoesNotThrow(() -> consumer.handleKudo(message));
    verify(kudoService, times(1)).saveKudo(message);
  }
}