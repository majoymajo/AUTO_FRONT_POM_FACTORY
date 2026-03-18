package com.sofkianos.consumer.entity;

import com.sofkianos.consumer.domain.model.KudoCategory;
import com.sofkianos.consumer.infrastructure.exception.InvalidKudoException;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "kudos")
@Getter
@NoArgsConstructor
public class Kudo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fromUser;
    private String toUser;

    @Enumerated(EnumType.STRING)
    private KudoCategory category;

    @jakarta.persistence.Column(columnDefinition = "text")
    private String message;

    @jakarta.persistence.Column(name = "created_at")
    private LocalDateTime createdAt;

    private Kudo(Long id, String fromUser, String toUser,
                 KudoCategory category, String message, LocalDateTime createdAt) {
        this.id = id;
        this.fromUser = fromUser;
        this.toUser = toUser;
        this.category = category;
        this.message = message;
        this.createdAt = createdAt;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {

        private Long id;
        private String fromUser;
        private String toUser;
        private KudoCategory category;
        private String message;
        private LocalDateTime createdAt;

        private Builder() {

        }

        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        public Builder fromUser(String fromUser) {
            this.fromUser = fromUser;
            return this;
        }

        
        public Builder toUser(String toUser) {
            this.toUser = toUser;
            return this;
        }

        
        public Builder category(KudoCategory category) {
            this.category = category;
            return this;
        }

        
        public Builder category(String category) {
            this.category = KudoCategory.fromString(category);
            return this;
        }

        
        public Builder message(String message) {
            this.message = message;
            return this;
        }

        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        
        public Kudo build() {
            requireNonBlank(fromUser, "fromUser");
            requireNonBlank(toUser, "toUser");
            requireNonBlank(message, "message");

            if (category == null) {
                throw new InvalidKudoException("'category' must not be null");
            }

            if (fromUser.equalsIgnoreCase(toUser)) {
                throw new InvalidKudoException("Cannot send kudo to yourself");
            }

            return new Kudo(id, fromUser, toUser, category, message, createdAt);
        }