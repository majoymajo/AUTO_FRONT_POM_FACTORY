package com.sofkianos.consumer.domain.model;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * RP-08 — KudoCategory enum and fromString() for Consumer.
 */
class KudoCategoryTest {

    @ParameterizedTest(name = "fromString(\"{0}\") should return matching category")
    @ValueSource(strings = { "INNOVATION", "TEAMWORK", "PASSION", "MASTERY" })
    @DisplayName("Given valid category names — When fromString — Then returns correct enum")
    void givenValidCategory_whenFromString_thenReturnsEnum(String name) {
        KudoCategory result = KudoCategory.fromString(name);
        assertThat(result.name()).isEqualTo(name);
    }

    @ParameterizedTest(name = "fromString(\"{0}\") should be case-insensitive")
    @ValueSource(strings = { "innovation", "Teamwork", "pAssIoN", "MASTERY" })
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
}
