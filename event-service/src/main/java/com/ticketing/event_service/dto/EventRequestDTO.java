package com.ticketing.event_service.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class EventRequestDTO {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;
    private String category;

    @NotNull(message = "Event date is required")
    private LocalDateTime eventDate;

    private String imageUrl;
    private BigDecimal minPrice;
    private Boolean isHighDemand = false;

    @NotNull(message = "Venue is required")
    private Long venueId;
}