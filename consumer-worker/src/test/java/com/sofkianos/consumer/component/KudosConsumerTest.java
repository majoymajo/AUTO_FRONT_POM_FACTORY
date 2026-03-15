package com.sofkianos.consumer.component;

import com.sofkianos.consumer.domain.events.KudoEvent;
import com.sofkianos.consumer.service.KudoService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.Mockito.*;

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
    KudoEvent event = KudoEvent.builder()
        .from("alice@sofkianos.com")
        .to("bob@sofkianos.com")
        .category("TEAMWORK")
        .message("Great job on the sprint delivery!")
        .build();

    assertDoesNotThrow(() -> consumer.handleKudo(event));
    verify(kudoService, times(1)).saveKudo(event);
  }

  @Test
  @DisplayName("handleKudo propagates exceptions when service fails (for DLQ processing)")
  void handleKudo_propagatesExceptionOnServiceFailure() {
    KudosConsumer consumer = new KudosConsumer(kudoService);
    KudoEvent event = KudoEvent.builder()
        .from("alice@sofkianos.com")
        .to("bob@sofkianos.com")
        .category("INNOVATION")
        .message("Trigger failure")
        .build();

    doThrow(new RuntimeException("Service failed")).when(kudoService).saveKudo(event);

    org.junit.jupiter.api.Assertions.assertThrows(RuntimeException.class,
        () -> consumer.handleKudo(event));
  }
}