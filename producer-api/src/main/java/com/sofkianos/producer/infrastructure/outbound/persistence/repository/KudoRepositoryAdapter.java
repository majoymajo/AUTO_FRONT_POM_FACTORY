//package com.sofkianos.producer.infrastructure.outbound.persistence.repository;
//
//import com.sofkianos.producer.application.dto.KudoSearchCriteria;
//import com.sofkianos.producer.domain.model.Kudo;
//import com.sofkianos.producer.domain.model.PagedResult;
//import com.sofkianos.producer.domain.ports.out.KudoRepository;
//import com.sofkianos.producer.infrastructure.outbound.persistence.specification.KudoSpecifications;
//import com.sofkianos.producer.infrastructure.outbound.persistence.entity.KudoEntity;
//import lombok.RequiredArgsConstructor;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.PageRequest;
//import org.springframework.data.domain.Sort;
//import org.springframework.stereotype.Repository;
//
//import java.util.Optional;
//
//@RequiredArgsConstructor
//@Repository
//public class KudoRepositoryAdapter implements KudoRepository {
//    private final KudoQueryRepository jpaRepo;
//
//    @Override
//    public Kudo save(Kudo kudo) {
//        // convertir dominio → entidad JPA
//        return jpaRepo.save(KudoEntity.fromDomain(kudo)).toDomain();
//    }
//
//    @Override
//    public Optional<Kudo> findById(Long id) {
//        return jpaRepo.findById(id).map(KudoEntity::toDomain);
//    }
//
//    @Override
//    public PagedResult<Kudo> search(String category, String searchText, int page, int size, String sortDirection) {
//        Sort.Direction direction = "ASC".equalsIgnoreCase(sortDirection)
//                ? Sort.Direction.ASC
//                : Sort.Direction.DESC;
//
//        PageRequest pageable = PageRequest.of(page, size, Sort.by(direction, "createdAt"));
//
//        KudoSearchCriteria criteria = KudoSearchCriteria.builder()
//                .category(category)
//                .searchText(searchText)
//                .page(page)
//                .size(size)
//                .sortDirection(sortDirection)
//                .build();
//
//        Page<KudoEntity> entityPage = jpaRepo.findAll(KudoSpecifications.fromCriteria(criteria), pageable);
//
//        return new PagedResult<>(
//                entityPage.getContent().stream().map(KudoEntity::toDomain).toList(),
//                entityPage.getTotalElements(),
//                entityPage.getTotalPages(),
//                entityPage.getNumber(),
//                entityPage.getSize());
//    }
//
//}
