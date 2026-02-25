package com.sofkianos.consumer.service.impl;

import com.sofkianos.consumer.domain.events.KudoEvent;
import com.sofkianos.consumer.domain.ports.out.KudoPersistencePort;
import com.sofkianos.consumer.entity.Kudo;
import com.sofkianos.consumer.infrastructure.exception.InvalidKudoException;
import com.sofkianos.consumer.service.KudoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * Domain Service — maps a typed {@link KudoEvent} to a {@link Kudo} entity
 * and persists it through the {@link KudoPersistencePort} abstraction.
 * <p>
 * This class is <strong>pure domain</strong>:
 * <ul>
 * <li>No {@code KudoRepository} — persistence is delegated to the port.</li>
 * <li>No JPA imports — infrastructure lives in the adapter.</li>
 * <li>No {@code ObjectMapper} — deserialization is handled by Spring AMQP.</li>
 * </ul>
 * The Kudo Builder (Wave 1) enforces all domain invariants at construction.
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KudoServiceImpl implements KudoService {
        private final KudoPersistencePort persistencePort;

        @Override
        public void saveKudo(KudoEvent event) {
                Kudo kudo = Optional.ofNullable(event)
                                .filter(e -> e.getFrom() != null && !e.getFrom().isBlank())
                                .filter(e -> e.getTo() != null && !e.getTo().isBlank())
                                .filter(e -> e.getMessage() != null && !e.getMessage().isBlank())
                                .map(e -> {
                                        log.info("Mapping KudoEvent to entity: from={}, to={}", e.getFrom(), e.getTo());
                                        return Kudo.builder()
                                                        .fromUser(e.getFrom())
                                                        .toUser(e.getTo())
                                                        .category(e.getCategory())
                                                        .message(e.getMessage())
                                                        .createdAt(e.getTimestamp())
                                                        .build();
                                }).orElseThrow(() -> new InvalidKudoException(
                                                "KudoEvent is missing required fields: from, to or message"));

                persistencePort.save(kudo);
                log.info("Kudo persisted successfully: from={}, to={}, category={}",
                                kudo.getFromUser(), kudo.getToUser(), kudo.getCategory());
        }
}