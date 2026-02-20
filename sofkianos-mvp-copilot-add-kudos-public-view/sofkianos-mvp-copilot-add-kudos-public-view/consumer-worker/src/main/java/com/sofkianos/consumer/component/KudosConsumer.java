package com.sofkianos.consumer.component;

import com.sofkianos.consumer.config.RabbitConfig;
import com.sofkianos.consumer.domain.events.KudoEvent;
import com.sofkianos.consumer.service.KudoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Component;

/**
 * Event-Driven Consumer — listens to {@code kudos.queue} and delegates
 * processing to the {@link KudoService}.
 * <p>
 * <strong>DLQ-aware:</strong> exceptions are no longer swallowed.
 * If processing fails, the exception propagates to Spring AMQP, which
 * NACKs the message and RabbitMQ routes it to the Dead Letter Queue
 * ({@code kudos.dlq}) via the configured DLX.
 * </p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class KudosConsumer {

    private final KudoService kudoService;

    @RabbitListener(queues = RabbitConfig.QUEUE_NAME)
    public void handleKudo(@Payload KudoEvent event) {
        log.info("Processing started: from={}, to={}, category={}",
                event.getFrom(), event.getTo(), event.getCategory());

        long start = System.currentTimeMillis();

        kudoService.saveKudo(event);

        long elapsed = System.currentTimeMillis() - start;
        log.info("Processing finished: from={}, to={} ({} ms)",
                event.getFrom(), event.getTo(), elapsed);
    }
}