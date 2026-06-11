package com.ticketing.event_service.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class SeatDTO {
    private Long id;
    private String row;
    private Integer number;
    private String category;
    private String status;
    private BigDecimal price;
}