package com.sofkianos.producer.service.impl;

import com.sofkianos.producer.infrastructure.events.KudoEvent;
import com.sofkianos.producer.domain.ports.out.KudoEventPublisher;
import com.sofkianos.producer.dto.KudoListItemDTO;
import com.sofkianos.producer.dto.KudoRequest;
import com.sofkianos.producer.dto.KudoResponse;
import com.sofkianos.producer.dto.KudoSearchCriteria;
import com.sofkianos.producer.infrastructure.exception.KudoPublishingException;
import com.sofkianos.producer.infrastructure.exception.ResourceNotFoundException;
import com.sofkianos.producer.repository.KudoQueryRepository;
import com.sofkianos.producer.service.KudoService;
import com.sofkianos.producer.specification.KudoSpecifications;
import com.sofkianos.producer.util.EmailMaskingUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

/**
 * Domain Service — orchestrates the Kudo publishing workflow.
 * <p>
 * This class is <strong>free of infrastructure concerns</strong>:
 * <ul>
 * <li>No {@code RabbitTemplate} — messaging is delegated to
 * the {@link KudoEventPublisher} port.</li>
 * <li>No {@code ObjectMapper} — serialization lives in the adapter.</li>
 * </ul>
 * The service only knows about DTOs, domain events, and port interfaces.
 * </p>
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class KudoServiceImpl implements KudoService {
        private final KudoEventPublisher kudoEventPublisher;
        private final KudoQueryRepository kudoQueryRepository;

        @Override
        public KudoResponse sendKudo(KudoRequest kudoRequest) {
                log.info("Processing Kudo: from={}, to={}", kudoRequest.getFrom(), kudoRequest.getTo());
                KudoEvent event = KudoEvent.builder()
                                .from(kudoRequest.getFrom())
                                .to(kudoRequest.getTo())
                                .category(kudoRequest.getCategory())
                                .message(kudoRequest.getMessage())
                                .timestamp(LocalDateTime.now())
                                .build();

                Optional.of(event)
                                .map(e -> {
                                        kudoEventPublisher.publish(e);
                                        return e;
                                }).orElseThrow(() -> new KudoPublishingException("Event was null"));

                String trackingId = java.util.UUID.randomUUID().toString();
                log.info("Kudo published successfully: from={}, to={}, trackingId={}",
                                event.getFrom(), event.getTo(), trackingId);

                return KudoResponse.builder()
                                .id(trackingId)
                                .message("Kudo queued successfully")
                                .status("ACCEPTED")
                                .timestamp(LocalDateTime.now())
                                .build();
        }

        @Transactional(readOnly = true)
        @Override
        public Page<KudoListItemDTO> searchKudos(KudoSearchCriteria criteria) {
                Sort.Direction direction = "ASC".equalsIgnoreCase(criteria.getSortDirection())
                                ? Sort.Direction.ASC
                                : Sort.Direction.DESC;

                PageRequest pageable = PageRequest.of(
                                criteria.getPage(),
                                criteria.getEffectiveSize(),
                                Sort.by(direction, "createdAt"));

                Page<KudoListItemDTO> result = kudoQueryRepository
                                .findAll(KudoSpecifications.fromCriteria(criteria), pageable)
                                .map(kudo -> KudoListItemDTO.builder()
                                                .receptor(EmailMaskingUtil.toDisplayName(kudo.getToUser()))
                                                .emisor(EmailMaskingUtil.toDisplayName(kudo.getFromUser()))
                                                .mensaje(kudo.getMessage())
                                                .fecha(kudo.getCreatedAt())
                                                .categoria(kudo.getCategory() != null ? kudo.getCategory().name()
                                                                : null)
                                                .build());

                return Optional.of(result)
                                .filter(page -> !page.isEmpty())
                                .orElseThrow(() -> new ResourceNotFoundException(
                                                "No kudos found for the given criteria"));
        }

}