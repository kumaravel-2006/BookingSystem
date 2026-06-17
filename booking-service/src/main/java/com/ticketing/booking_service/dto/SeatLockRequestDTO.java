package com.ticketing.booking_service.dto;

import lombok.Data;

import java.util.List;

@Data
public class SeatLockRequestDTO {
    private Long userId;
    private Long eventId;
    private List<Long> seatIds;
    private Double totalAmount;
}
