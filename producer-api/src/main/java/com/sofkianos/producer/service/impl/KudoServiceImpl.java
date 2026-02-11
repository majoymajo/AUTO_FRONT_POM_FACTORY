package com.sofkianos.producer.service.impl;

import com.sofkianos.producer.domain.events.KudoEvent;
import com.sofkianos.producer.domain.ports.out.KudoEventPublisher;
import com.sofkianos.producer.dto.KudoRequest;
import com.sofkianos.producer.service.KudoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Domain Service — orchestrates the Kudo publishing workflow.
 * <p>
 * This class is <strong>free of infrastructure concerns</strong>:
 * <ul>
 *   <li>No {@code RabbitTemplate} — messaging is delegated to
 *       the {@link KudoEventPublisher} port.</li>
 *   <li>No {@code ObjectMapper} — serialization lives in the adapter.</li>
 * </ul>
 * The service only knows about DTOs, domain events, and port interfaces.
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KudoServiceImpl implements KudoService {

    private final KudoEventPublisher kudoEventPublisher;

    @Override
    public void sendKudo(KudoRequest kudoRequest) {
        log.info("Processing Kudo: from={}, to={}", kudoRequest.getFrom(), kudoRequest.getTo());

        KudoEvent event = KudoEvent.builder()
                .from(kudoRequest.getFrom())
                .to(kudoRequest.getTo())
                .category(kudoRequest.getCategory())
                .message(kudoRequest.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        kudoEventPublisher.publish(event);

        log.info("Kudo published successfully: from={}, to={}", event.getFrom(), event.getTo());
    }
}