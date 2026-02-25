package com.sofkianos.producer.infrastructure.outbound.persistence;

import com.sofkianos.producer.domain.model.Kudo;
import com.sofkianos.producer.domain.valueobject.KudoCategory;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * JPA entity representing a persisted Kudo, mapped to the existing {@code kudos} table.
 */
@Entity
@Table(name = "kudos")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KudoEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String fromUser;
    private String toUser;
    @Enumerated(EnumType.STRING)
    private KudoCategory category;
    private String message;
    private LocalDateTime createdAt;

    public static KudoEntity fromDomain(Kudo kudo) {
        KudoEntity entity = new KudoEntity();
        entity.id = kudo.id();
        entity.fromUser = kudo.fromUser();
        entity.toUser = kudo.toUser();
        entity.category = kudo.category();
        entity.message = kudo.message();
        entity.createdAt = kudo.createdAt();
        return entity;
    }

    public Kudo toDomain() {
        return new Kudo(id, fromUser, toUser, category, message, createdAt);
    }
}
