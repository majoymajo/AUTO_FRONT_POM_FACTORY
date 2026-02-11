package com.sofkianos.consumer.service.impl;

import com.sofkianos.consumer.domain.events.KudoEvent;
import com.sofkianos.consumer.entity.Kudo;
import com.sofkianos.consumer.repository.KudoRepository;
import com.sofkianos.consumer.service.KudoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Domain Service — maps a typed {@link KudoEvent} to a {@link Kudo} entity
 * and persists it via the repository.
 * <p>
 * This class is <strong>free of infrastructure concerns</strong>:
 * <ul>
 *   <li>No {@code ObjectMapper} — deserialization is handled by the
 *       {@code Jackson2JsonMessageConverter} in RabbitConfig.</li>
 *   <li>No manual JSON parsing ({@code readTree}, {@code path()}, etc.).</li>
 * </ul>
 * The Kudo Builder (Wave 1) enforces all domain invariants at construction.
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KudoServiceImpl implements KudoService {

    private final KudoRepository kudoRepository;

    @Override
    public void saveKudo(KudoEvent event) {
        log.info("Mapping KudoEvent to entity: from={}, to={}",
                event.getFrom(), event.getTo());

        Kudo kudo = Kudo.builder()
                .fromUser(event.getFrom())
                .toUser(event.getTo())
                .category(event.getCategory())   // String → KudoCategory via Builder overload
                .message(event.getMessage())
                .createdAt(event.getTimestamp())   // Preserves original event timestamp
                .build();

        kudoRepository.save(kudo);
        log.info("Kudo persisted successfully: from={}, to={}, category={}",
                kudo.getFromUser(), kudo.getToUser(), kudo.getCategory());
    }
}