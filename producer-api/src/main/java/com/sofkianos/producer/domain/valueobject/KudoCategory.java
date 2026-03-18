package com.sofkianos.producer.domain.valueobject;

import java.util.Arrays;


public enum KudoCategory {

    Innovation,
    Teamwork,
    Passion,
    Mastery;

    
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