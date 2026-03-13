package com.sofkianos.consumer.infrastructure.messaging.mapper;

import com.sofkianos.consumer.domain.events.KudoEvent;
import com.sofkianos.consumer.infrastructure.messaging.dto.KudoEventDTO;
import org.springframework.stereotype.Component;

@Component
public class KudoEventMapper {

    public KudoEvent toDomain(KudoEventDTO dto) {
        if (dto == null) {
            return null;
        }

        KudoEvent domainEvent = new KudoEvent();
        domainEvent.setFrom(dto.getFromUser());
        domainEvent.setTo(dto.getToUser());
        domainEvent.setCategory(dto.getCategory());
        domainEvent.setMessage(dto.getMessage());
        domainEvent.setTimestamp(dto.getCreatedAt());

        return domainEvent;
    }
}
