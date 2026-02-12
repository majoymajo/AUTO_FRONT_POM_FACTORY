package com.sofkianos.consumer.infrastructure.messaging.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.time.LocalDateTime;

public class KudoEventDTO implements Serializable {

    @JsonProperty("id")
    private Long id;

    @JsonProperty("from") // Matches producer's JSON field name
    private String fromUser;

    @JsonProperty("to")   // Matches producer's JSON field name
    private String toUser;

    @JsonProperty("category")
    private String category;

    @JsonProperty("message")
    private String message;

    @JsonProperty("timestamp")
    private LocalDateTime createdAt;

    public KudoEventDTO() {
    }

    public KudoEventDTO(Long id, String fromUser, String toUser, String category, String message, LocalDateTime createdAt) {
        this.id = id;
        this.fromUser = fromUser;
        this.toUser = toUser;
        this.category = category;
        this.message = message;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFromUser() { return fromUser; }
    public void setFromUser(String fromUser) { this.fromUser = fromUser; }

    public String getToUser() { return toUser; }
    public void setToUser(String toUser) { this.toUser = toUser; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    @Override
    public String toString() {
        return "KudoEventDTO{" +
                "id=" + id +
                ", from='" + fromUser + '\'' +
                ", to='" + toUser + '\'' +
                ", category='" + category + '\'' +
                ", message='" + message + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
