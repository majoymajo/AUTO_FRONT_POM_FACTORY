package com.sofkianos.consumer.infrastructure.messaging.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.time.LocalDateTime;

public class KudoEventDTO implements Serializable {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("from")