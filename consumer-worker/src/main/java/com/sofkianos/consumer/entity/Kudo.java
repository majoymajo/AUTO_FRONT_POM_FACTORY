package com.sofkianos.consumer.entity;

import com.sofkianos.consumer.domain.model.KudoCategory;
import com.sofkianos.consumer.exception.InvalidKudoException;
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

/**
 * Rich Domain Entity representing a Kudo.
 * <p>
 * Instances are created exclusively through the {@link Builder},
 * which enforces all domain invariants at construction time:
 * <ul>
 *   <li>{@code fromUser}, {@code toUser}, and {@code message}
 *       must be non-null and non-blank.</li>
 *   <li>{@code category} must be a valid {@link KudoCategory} enum value.</li>
 *   <li>{@code fromUser} must differ from {@code toUser}
 *       (case-insensitive — self-kudo rule).</li>
 *   <li>{@code createdAt} defaults to {@code LocalDateTime.now()}
 *       when not explicitly set.</li>
 * </ul>
 * </p>
 */
@Entity
@Table(name = "kudos")
@Getter
@NoArgsConstructor // Required by JPA – never call directly from application code
public class Kudo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fromUser;
    private String toUser;

    @Enumerated(EnumType.STRING)
    private KudoCategory category;

    private String message;
    private LocalDateTime createdAt;

    // ── Private constructor — only the Builder can instantiate ──────────
    private Kudo(Long id, String fromUser, String toUser,
                 KudoCategory category, String message, LocalDateTime createdAt) {
        this.id = id;
        this.fromUser = fromUser;
        this.toUser = toUser;
        this.category = category;
        this.message = message;
        this.createdAt = createdAt;
    }

    // ── Factory entry-point ─────────────────────────────────────────────
    public static Builder builder() {
        return new Builder();
    }

    // ══════════════════════════════════════════════════════════════════════
    //  Static Inner Builder — enforces every domain invariant
    // ══════════════════════════════════════════════════════════════════════
    public static class Builder {

        private Long id;
        private String fromUser;
        private String toUser;
        private KudoCategory category;
        private String message;
        private LocalDateTime createdAt;

        private Builder() {
            // intentionally private
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

        /**
         * Accepts a {@link KudoCategory} enum directly.
         */
        public Builder category(KudoCategory category) {
            this.category = category;
            return this;
        }

        /**
         * Convenience overload — accepts a raw String and converts it
         * via {@link KudoCategory#fromString(String)}.
         *
         * @throws IllegalArgumentException if the string is not a valid category
         */
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

        // ── Build with full validation ──────────────────────────────────
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

            if (createdAt == null) {
                createdAt = LocalDateTime.now();
            }

            return new Kudo(id, fromUser, toUser, category, message, createdAt);
        }

        // ── Helper ──────────────────────────────────────────────────────
        private void requireNonBlank(String value, String fieldName) {
            if (value == null || value.isBlank()) {
                throw new InvalidKudoException(
                        String.format("'%s' must not be null or empty", fieldName));
            }
        }
    }
}