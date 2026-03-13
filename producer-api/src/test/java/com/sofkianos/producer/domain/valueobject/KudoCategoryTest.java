package com.sofkianos.producer.domain.valueobject;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * US-004 / RP-08 — KudoCategory enum and fromString() factory method.
 */
class KudoCategoryTest {

    @ParameterizedTest(name = "fromString(\"{0}\") should return matching category")
    @ValueSource(strings = { "Innovation", "Teamwork", "Passion", "Mastery" })
    @DisplayName("Given valid category names — When fromString — Then returns correct enum")
    void givenValidCategory_whenFromString_thenReturnsEnum(String name) {
        KudoCategory result = KudoCategory.fromString(name);
        assertThat(result.name()).isEqualToIgnoringCase(name);
    }

    @ParameterizedTest(name = "fromString(\"{0}\") should be case-insensitive")
    @ValueSource(strings = { "innovation", "TEAMWORK", "pAssIoN", "mastery" })
    @DisplayName("Given mixed-case names — When fromString — Then matches ignoring case")
    void givenMixedCase_whenFromString_thenMatches(String name) {
        KudoCategory result = KudoCategory.fromString(name);
        assertThat(result).isNotNull();
    }

    @Test
    @DisplayName("Given null — When fromString — Then throws IllegalArgumentException")
    void givenNull_whenFromString_thenThrows() {
        assertThatThrownBy(() -> KudoCategory.fromString(null))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("must not be null or empty");
    }

    @Test
    @DisplayName("Given blank string — When fromString — Then throws IllegalArgumentException")
    void givenBlank_whenFromString_thenThrows() {
        assertThatThrownBy(() -> KudoCategory.fromString("   "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("must not be null or empty");
    }

    @ParameterizedTest(name = "fromString(\"{0}\") should throw for invalid value")
    @ValueSource(strings = { "INVALID", "SUPER_KUDO", "random", "" })
    @DisplayName("Given invalid category — When fromString — Then throws IllegalArgumentException")
    void givenInvalidCategory_whenFromString_thenThrows(String name) {
        assertThatThrownBy(() -> KudoCategory.fromString(name))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("Given trimmed input with whitespace — When fromString — Then matches correctly")
    void givenWhitespacePadded_whenFromString_thenTrimsAndMatches() {
        KudoCategory result = KudoCategory.fromString("  Innovation  ");
        assertThat(result).isEqualTo(KudoCategory.Innovation);
    }

    @Test
    @DisplayName("All four categories should exist in the enum")
    void allCategoriesExist() {
        assertThat(KudoCategory.values()).hasSize(4);
        assertThat(KudoCategory.values())
                .containsExactly(KudoCategory.Innovation, KudoCategory.Teamwork,
                        KudoCategory.Passion, KudoCategory.Mastery);
    }
}
