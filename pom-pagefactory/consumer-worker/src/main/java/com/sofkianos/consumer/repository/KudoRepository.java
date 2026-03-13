package com.sofkianos.consumer.repository;

import com.sofkianos.consumer.entity.Kudo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface KudoRepository extends JpaRepository<Kudo, Long>, JpaSpecificationExecutor<Kudo> {
}