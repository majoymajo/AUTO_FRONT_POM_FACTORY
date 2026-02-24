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
        private final com.sofkianos.producer.repository.KudoQueryRepository kudoQueryRepository;

    @Override
    public com.sofkianos.producer.dto.KudoResponse sendKudo(KudoRequest kudoRequest) {
        log.info("Processing Kudo: from={}, to={}", kudoRequest.getFrom(), kudoRequest.getTo());

        KudoEvent event = KudoEvent.builder()
                .from(kudoRequest.getFrom())
                .to(kudoRequest.getTo())
                .category(kudoRequest.getCategory())
                .message(kudoRequest.getMessage())
                .timestamp(LocalDateTime.now())
                .build();

        kudoEventPublisher.publish(event);

        String trackingId = java.util.UUID.randomUUID().toString();
        log.info("Kudo published successfully: from={}, to={}, trackingId={}", 
                event.getFrom(), event.getTo(), trackingId);
        
        return com.sofkianos.producer.dto.KudoResponse.builder()
                .id(trackingId)
                .message("Kudo queued successfully")
                .status("ACCEPTED")
                .timestamp(LocalDateTime.now())
                .build();
    }

    @Override
    public org.springframework.data.domain.Page<com.sofkianos.producer.dto.KudoListItemDTO> searchKudos(com.sofkianos.producer.dto.KudoSearchCriteria criteria) {
        org.springframework.data.domain.Sort.Direction direction = "ASC".equalsIgnoreCase(criteria.getSortDirection())
                ? org.springframework.data.domain.Sort.Direction.ASC
                : org.springframework.data.domain.Sort.Direction.DESC;

        org.springframework.data.domain.PageRequest pageable = org.springframework.data.domain.PageRequest.of(
                criteria.getPage(),
                criteria.getEffectiveSize(),
                org.springframework.data.domain.Sort.by(direction, "createdAt")
        );

        return kudoQueryRepository
                .findAll(com.sofkianos.producer.specification.KudoSpecifications.fromCriteria(criteria), pageable)
                .map(kudo -> com.sofkianos.producer.dto.KudoListItemDTO.builder()
                        .receptor(com.sofkianos.producer.util.EmailMaskingUtil.toDisplayName(kudo.getToUser()))
                        .emisor(com.sofkianos.producer.util.EmailMaskingUtil.toDisplayName(kudo.getFromUser()))
                        .mensaje(kudo.getMessage())
                        .fecha(kudo.getCreatedAt())
                        .categoria(kudo.getCategory() != null ? kudo.getCategory().name() : null)
                        .build());
    }
}
}