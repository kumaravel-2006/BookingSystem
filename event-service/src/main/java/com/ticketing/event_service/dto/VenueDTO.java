package com.ticketing.event_service.dto;

import lombok.Data;

@Data
public class VenueDTO {
    private Long id;
    private String name;
    private String address;
    private String city;
    private Integer capacity;
}
