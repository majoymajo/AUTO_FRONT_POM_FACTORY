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
 * Rich domain entity representing a persisted Kudo.
 *
 * <p>This entity is the <strong>storage model</strong> for the Consumer Worker. Messages consumed from RabbitMQ
 * (see {@code KudoEvent}) are mapped into this entity and then stored via Spring Data JPA.</p>
 *
 * <h2>Construction</h2>
 * <p>Instances are created exclusively through the {@link Builder}, which enforces domain invariants at
 * construction time:</p>
 * <ul>
 *   <li>{@code fromUser}, {@code toUser}, and {@code message} must be non-null and non-blank.</li>
 *   <li>{@code category} must be a valid {@link KudoCategory}.</li>
 *   <li>{@code fromUser} must differ from {@code toUser} (case-insensitive — self-kudo rule).</li>
 *   <li>{@code createdAt} defaults to {@link LocalDateTime#now()} when not explicitly set.</li>
 * </ul>
 *
 * <h2>Example</h2>
 * <pre>{@code
 * Kudo kudo = Kudo.builder()
 *     .fromUser("alice")
 *     .toUser("bob")
 *     .category("TEAMWORK")
 *     .message("Thanks for the help!")
 *     .build();
 * }</pre>
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
    /**
     * Creates a new {@link Builder} instance.
     *
     * @return a builder that validates all required fields on {@link Builder#build()}.
     */
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

        /**
         * Sets the entity identifier.
         * <p>Typically left {@code null} for new entities so JPA can generate it.</p>
         *
         * @param id the database id
         * @return this builder
         */
        public Builder id(Long id) {
            this.id = id;
            return this;
        }

        /**
         * Sets the username/id of the sender.
         *
         * @param fromUser the sender
         * @return this builder
         */
        public Builder fromUser(String fromUser) {
            this.fromUser = fromUser;
            return this;
        }

        /**
         * Sets the username/id of the receiver.
         *
         * @param toUser the receiver
         * @return this builder
         */
        public Builder toUser(String toUser) {
            this.toUser = toUser;
            return this;
        }

        /**
         * Accepts a {@link KudoCategory} enum directly.
         *
         * @param category the kudo category
         * @return this builder
         */
        public Builder category(KudoCategory category) {
            this.category = category;
            return this;
        }

        /**
         * Convenience overload — accepts a raw String and converts it
         * via {@link KudoCategory#fromString(String)}.
         *
         * @param category the raw category value (case/format accepted by {@link KudoCategory#fromString(String)})
         * @return this builder
         * @throws IllegalArgumentException if the string is not a valid category
         */
        public Builder category(String category) {
            this.category = KudoCategory.fromString(category);
            return this;
        }

        /**
         * Sets the kudo message.
         *
         * @param message free-text message
         * @return this builder
         */
        public Builder message(String message) {
            this.message = message;
            return this;
        }

        /**
         * Sets the creation timestamp.
         * <p>If {@code null}, {@link LocalDateTime#now()} is used during {@link #build()}.</p>
         *
         * @param createdAt the timestamp
         * @return this builder
         */
        public Builder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        // ── Build with full validation ──────────────────────────────────
        /**
         * Validates the accumulated state and creates an immutable {@link Kudo} instance.
         *
         * @return a valid {@link Kudo}
         * @throws InvalidKudoException if required fields are missing/blank, if the category is null,
         *                              or if a self-kudo is attempted
         * @throws IllegalArgumentException if a raw string category cannot be converted
         */
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