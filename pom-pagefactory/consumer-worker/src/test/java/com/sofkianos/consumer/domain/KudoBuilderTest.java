package com.sofkianos.consumer.domain;

import com.sofkianos.consumer.domain.model.KudoCategory;
import com.sofkianos.consumer.entity.Kudo;
import com.sofkianos.consumer.infrastructure.exception.InvalidKudoException;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class KudoBuilderTest {

    @Test
    @DisplayName("Should build a valid Kudo when all invariants are met")
    void shouldBuildValidKudo() {
        Kudo kudo = Kudo.builder()
                .fromUser("Alice")
                .toUser("Bob")
                .category(KudoCategory.INNOVATION)
                .message("Great idea!")
                .createdAt(LocalDateTime.now())
                .build();

        assertThat(kudo).isNotNull();
        assertThat(kudo.getFromUser()).isEqualTo("Alice");
    }

    @Test
    @DisplayName("Should throw exception when sender equals receiver (Self-Kudo Protection)")
    void shouldThrowException_WhenSenderIsSameAsReceiver() {
        assertThatThrownBy(() -> Kudo.builder()
                .fromUser("Alice")
                .toUser("alice") // Case insensitive check
                .category(KudoCategory.MASTERY)
                .message("I am the best")
                .build())
                .isInstanceOf(InvalidKudoException.class)
                .hasMessageContaining("Cannot send kudo to yourself");
    }

    @Test
    @DisplayName("Should throw exception when message is empty")
    void shouldThrowException_WhenMessageIsEmpty() {
        assertThatThrownBy(() -> Kudo.builder()
                .fromUser("Alice")
                .toUser("Bob")
                .category(KudoCategory.TEAMWORK)
                .message("   ") // Blank message
                .build())
                .isInstanceOf(InvalidKudoException.class)
                .hasMessage("'message' must not be null or empty");
    }

    @Test
    @DisplayName("Should throw exception when category is null")
    void shouldThrowException_WhenCategoryIsNull() {
        assertThatThrownBy(() -> Kudo.builder()
                .fromUser("Alice")
                .toUser("Bob")
                .category((KudoCategory) null)
                .message("Great job!")
                .build())
                .isInstanceOf(InvalidKudoException.class)
                .hasMessage("'category' must not be null");
    }

    @Test
    @DisplayName("Should throw exception when fromUser is blank")
    void shouldThrowException_WhenFromUserIsBlank() {
        assertThatThrownBy(() -> Kudo.builder()
                .fromUser("")
                .toUser("Bob")
                .category(KudoCategory.TEAMWORK)
                .message("Great job!")
                .build())
                .isInstanceOf(InvalidKudoException.class)
                .hasMessage("'fromUser' must not be null or empty");
    }

    @Test
    @DisplayName("Should throw exception when toUser is blank")
    void shouldThrowException_WhenToUserIsBlank() {
        assertThatThrownBy(() -> Kudo.builder()
                .fromUser("Alice")
                .toUser("  ")
                .category(KudoCategory.TEAMWORK)
                .message("Great job!")
                .build())
                .isInstanceOf(InvalidKudoException.class)
                .hasMessage("'toUser' must not be null or empty");
    }

    @Test
    @DisplayName("Should build valid Kudo using raw string category")
    void shouldBuildWithRawStringCategory() {
        Kudo kudo = Kudo.builder()
                .fromUser("Alice")
                .toUser("Bob")
                .category("INNOVATION")
                .message("Great job!")
                .build();
        assertThat(kudo.getCategory()).isEqualTo(KudoCategory.INNOVATION);
    }
}
