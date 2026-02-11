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
 * Thanks to the {@code Jackson2JsonMessageConverter} registered in
 * {@link RabbitConfig}, the incoming JSON payload is automatically
 * deserialized into a typed {@link KudoEvent} — no manual parsing needed.
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

        try {
            kudoService.saveKudo(event);
        } catch (Exception e) {
            log.error("Error processing kudo: from={}, to={}",
                    event.getFrom(), event.getTo(), e);
            // In production: throw to NACK the message or route to a DLQ
        }

        long elapsed = System.currentTimeMillis() - start;
        log.info("Processing finished: from={}, to={} ({} ms)",
                event.getFrom(), event.getTo(), elapsed);
    }
}