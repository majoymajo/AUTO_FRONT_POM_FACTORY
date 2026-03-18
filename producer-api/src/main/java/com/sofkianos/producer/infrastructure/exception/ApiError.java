package com.sofkianos.producer.infrastructure.exception;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.HttpStatus;

import java.time.OffsetDateTime;


@Getter
@Setter
@Builder
public class ApiError {

    
    private OffsetDateTime timestamp;

    
    private int status;

    
    private String error;

    
    private String message;

    
    private String path;

    
    public static ApiError of(HttpStatus status, String message, String path) {
        return ApiError.builder()
                .timestamp(OffsetDateTime.now())
                .status(status.value())
                .error(status.getReasonPhrase())
                .message(message != null ? message : "No message provided")
                .path(path != null ? path : "")
                .build();
    }
}