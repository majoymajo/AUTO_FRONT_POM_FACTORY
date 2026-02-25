package com.sofkianos.producer.infrastructure.outbound.persistence;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

/**
 * Repository for querying kudos with dynamic filtering and pagination.
 */
public interface KudoQueryRepository extends JpaRepository<KudoEntity, Long>, JpaSpecificationExecutor<KudoEntity> {
}
