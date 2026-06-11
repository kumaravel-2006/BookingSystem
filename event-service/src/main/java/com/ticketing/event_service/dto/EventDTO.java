package com.ticketing.event_service.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class EventDTO {
    private Long id;
    private String title;
    private String description;
    private String category;
    private LocalDateTime eventDate;
    private String status;
    private String imageUrl;
    private BigDecimal minPrice;
    private Integer availableSeats;
    private Boolean isHighDemand;
    private VenueDTO venue;
}
