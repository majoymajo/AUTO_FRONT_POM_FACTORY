package com.sofkianos.consumer.domain.events;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class KudoEvent {
    private String from;
    private String to;
    private String category;
    private String message;
    private LocalDateTime timestamp;
}