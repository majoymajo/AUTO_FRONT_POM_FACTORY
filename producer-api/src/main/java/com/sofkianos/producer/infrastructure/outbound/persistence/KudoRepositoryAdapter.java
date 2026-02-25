package com.sofkianos.producer.infrastructure.outbound.persistence;

import com.sofkianos.producer.application.dto.KudoSearchCriteria;
import com.sofkianos.producer.domain.model.Kudo;
import com.sofkianos.producer.domain.ports.out.KudoRepository;
import com.sofkianos.producer.specification.KudoSpecifications;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@RequiredArgsConstructor
@Repository
public class KudoRepositoryAdapter implements KudoRepository {
    private final KudoQueryRepository jpaRepo;

    @Override
    public Kudo save(Kudo kudo) {
        // convertir dominio → entidad JPA
        return jpaRepo.save(KudoEntity.fromDomain(kudo)).toDomain();
    }

    @Override
    public Optional<Kudo> findById(Long id) {
        return jpaRepo.findById(id).map(KudoEntity::toDomain);
    }

    @Override
    public Page<Kudo> search(KudoSearchCriteria criteria) {
        Sort.Direction direction = "ASC".equalsIgnoreCase(criteria.getSortDirection())
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        PageRequest pageable = PageRequest.of(
                criteria.getPage(),
                criteria.getEffectiveSize(),
                Sort.by(direction, "createdAt"));

        return jpaRepo.findAll(KudoSpecifications.fromCriteria(criteria), pageable)
                .map(KudoEntity::toDomain);
    }

}
