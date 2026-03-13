package com.sofkianos.producer.infrastructure.messaging;

import com.sofkianos.producer.application.exception.KudoMessagingException;
import com.sofkianos.producer.domain.model.Kudo;
import com.sofkianos.producer.domain.valueobject.KudoCategory;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.amqp.AmqpException;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.test.util.ReflectionTestUtils;

import com.sofkianos.producer.infrastructure.messaging.events.KudoEvent;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * RP-02 — RabbitMqKudoPublisher pure unit tests (no Testcontainers).
 * Validates Kudo → KudoEvent mapping and error handling.
 */
@ExtendWith(MockitoExtension.class)
class RabbitMqKudoPublisherUnitTest {

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private RabbitMqKudoPublisher publisher;

    private void setFields() {
        ReflectionTestUtils.setField(publisher, "exchangeName", "kudo.exchange");
        ReflectionTestUtils.setField(publisher, "routingKey", "kudo.routing.key");
    }

    @Test
    @DisplayName("Given valid Kudo — When publish — Then RabbitTemplate is called with correct exchange and routing key")
    void givenValidKudo_whenPublish_thenRabbitTemplateCalledCorrectly() {
        setFields();
        LocalDateTime now = LocalDateTime.of(2026, 2, 11, 12, 0);
        Kudo kudo = new Kudo(null, "Alice", "Bob", KudoCategory.Teamwork, "Great!", now);

        publisher.publish(kudo);

        verify(rabbitTemplate, times(1))
                .convertAndSend(eq("kudo.exchange"), eq("kudo.routing.key"), any(KudoEvent.class));
    }

    @Test
    @DisplayName("Given valid Kudo — When publish — Then KudoEvent has correct field mapping")
    void givenValidKudo_whenPublish_thenEventFieldsMatch() {
        setFields();
        LocalDateTime now = LocalDateTime.of(2026, 2, 11, 12, 0);
        Kudo kudo = new Kudo(null, "alice@sofka.com", "bob@sofka.com",
                KudoCategory.Innovation, "Great idea!", now);

        ArgumentCaptor<KudoEvent> captor = ArgumentCaptor.forClass(KudoEvent.class);

        publisher.publish(kudo);

        verify(rabbitTemplate).convertAndSend(any(), any(), captor.capture());
        KudoEvent event = captor.getValue();

        assertThat(event.getFrom()).isEqualTo("alice@sofka.com");
        assertThat(event.getTo()).isEqualTo("bob@sofka.com");
        assertThat(event.getCategory()).isEqualTo("Innovation");
        assertThat(event.getMessage()).isEqualTo("Great idea!");
        assertThat(event.getTimestamp()).isEqualTo(now);
    }

    @Test
    @DisplayName("Given Kudo with null category — When publish — Then event category is null")
    void givenNullCategory_whenPublish_thenEventCategoryNull() {
        setFields();
        Kudo kudo = new Kudo(null, "Alice", "Bob", null, "Test", LocalDateTime.now());

        ArgumentCaptor<KudoEvent> captor = ArgumentCaptor.forClass(KudoEvent.class);

        publisher.publish(kudo);

        verify(rabbitTemplate).convertAndSend(any(), any(), captor.capture());
        assertThat(captor.getValue().getCategory()).isNull();
    }

    @Test
    @DisplayName("Given AmqpException — When publish — Then wraps in KudoMessagingException")
    void givenAmqpException_whenPublish_thenWrapsInMessagingException() {
        setFields();
        doThrow(new AmqpException("Connection refused"))
                .when(rabbitTemplate).convertAndSend(any(String.class), any(String.class), any(KudoEvent.class));

        Kudo kudo = new Kudo(null, "Alice", "Bob", KudoCategory.Mastery,
                "Test", LocalDateTime.now());

        assertThatThrownBy(() -> publisher.publish(kudo))
                .isInstanceOf(KudoMessagingException.class)
                .hasMessageContaining("Error publishing KudoEvent");
    }
}
