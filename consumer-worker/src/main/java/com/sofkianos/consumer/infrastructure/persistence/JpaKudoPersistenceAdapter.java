package com.sofkianos.consumer.infrastructure.persistence;

import com.sofkianos.consumer.domain.ports.out.KudoPersistencePort;
import com.sofkianos.consumer.entity.Kudo;
import com.sofkianos.consumer.repository.KudoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Infrastructure Adapter that implements {@link KudoPersistencePort}
 * using the Spring Data {@link KudoRepository}.
 * <p>
 * All JPA/Spring Data concerns are encapsulated here — the domain
 * service never imports any persistence framework classes.
 * </p>
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JpaKudoPersistenceAdapter implements KudoPersistencePort {

    private final KudoRepository kudoRepository;

    @Override
    public Kudo save(Kudo kudo) {
        log.debug("Persisting Kudo via JPA: from={}, to={}",
                kudo.getFromUser(), kudo.getToUser());

        Kudo saved = kudoRepository.save(kudo);

        log.debug("Kudo persisted with id={}", saved.getId());
        return saved;
    }
}
