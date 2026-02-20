package com.sofkianos.consumer.domain.model;

import java.util.Arrays;

/**
 * Enum representing the valid categories for a Kudo.
 * <p>
 * Eliminates "Primitive Obsession" — the domain no longer accepts
 * arbitrary Strings as categories.
 * </p>
 */
public enum KudoCategory {

    INNOVATION,
    TEAMWORK,
    PASSION,
    MASTERY;

    /**
     * Case-insensitive factory method.
     *
     * @param text the raw category string (e.g. from JSON or user input)
     * @return the matching {@link KudoCategory}
     * @throws IllegalArgumentException if no match is found
     */
    public static KudoCategory fromString(String text) {
        if (text == null || text.isBlank()) {
            throw new IllegalArgumentException("Category must not be null or empty");
        }

        return Arrays.stream(values())
                .filter(c -> c.name().equalsIgnoreCase(text.trim()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException(
                        String.format("Unknown KudoCategory: '%s'. Valid values: %s",
                                text, Arrays.toString(values()))));
    }
}
