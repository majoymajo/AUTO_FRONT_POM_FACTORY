package com.sofkianos.producer.domain.model;

import com.sofkianos.producer.domain.valueobject.KudoCategory;
import java.time.LocalDateTime;


public record Kudo(
        Long id,
        String fromUser,
        String toUser,
        KudoCategory category,
        String message,
        LocalDateTime createdAt) {
    
    public static Kudo create(String from, String to, KudoCategory category, String message) {
        return new Kudo(null, from, to, category, message, LocalDateTime.now());
    }
}