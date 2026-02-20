package com.sofkianos.consumer.repository;

import com.sofkianos.consumer.entity.Kudo;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KudoRepository extends CrudRepository<Kudo, Long> {
}