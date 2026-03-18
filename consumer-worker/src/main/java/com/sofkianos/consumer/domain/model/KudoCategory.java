package com.sofkianos.consumer.domain.model;

import java.util.Arrays;


public enum KudoCategory {

    INNOVATION,
    TEAMWORK,
    PASSION,
    MASTERY;

    
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