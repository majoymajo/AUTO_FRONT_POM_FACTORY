package com.sofkianos.producer.application.usecase;

import com.sofkianos.producer.domain.model.Kudo;
import com.sofkianos.producer.domain.ports.out.KudoRepository;
import com.sofkianos.producer.domain.valueobject.KudoCategory;
import com.sofkianos.producer.infrastructure.events.KudoEvent;
import com.sofkianos.producer.domain.ports.out.KudoEventPublisher;
import com.sofkianos.producer.application.dto.KudoListItemDTO;
import com.sofkianos.producer.application.dto.KudoRequest;
import com.sofkianos.producer.application.dto.KudoResponse;
import com.sofkianos.producer.application.dto.KudoSearchCriteria;
import com.sofkianos.producer.infrastructure.exception.KudoPublishingException;
import com.sofkianos.producer.infrastructure.exception.ResourceNotFoundException;
import com.sofkianos.producer.application.ports.in.KudoService;
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
import java.util.UUID;

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
        private final KudoRepository kudoRepository;

        @Override
        public KudoResponse sendKudo(KudoRequest kudoRequest) {
                log.info("Processing Kudo: from={}, to={}", kudoRequest.getFrom(), kudoRequest.getTo());
                Kudo kudo = Kudo.create(
                        kudoRequest.getFrom(),
                        kudoRequest.getTo(),
                        KudoCategory.valueOf(kudoRequest.getCategory()),
                        kudoRequest.getMessage()
                );
                Optional.ofNullable(kudo)
                        .map(e -> {
                                kudoEventPublisher.publish(e);
                                return e;
                        })
                        .orElseThrow(() -> new KudoPublishingException("Kudo was null"));

                String trackingId = UUID.randomUUID().toString();
                log.info("Kudo published successfully: from={}, to={}, trackingId={}",
                        kudo.fromUser(), kudo.toUser(), trackingId);

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
                // Usar el puerto de salida, no JPA directo
                Page<Kudo> result = kudoRepository.search(criteria);

                return Optional.of(result)
                        .filter(page -> !page.isEmpty())
                        .orElseThrow(() -> new ResourceNotFoundException(
                                "No kudos found for the given criteria"))
                        .map(kudo -> KudoListItemDTO.builder()
                                .receptor(EmailMaskingUtil.toDisplayName(kudo.toUser()))
                                .emisor(EmailMaskingUtil.toDisplayName(kudo.fromUser()))
                                .mensaje(kudo.message())
                                .fecha(kudo.createdAt())
                                .categoria(kudo.category() != null ? kudo.category().name() : null)
                                .build());
        }
}
