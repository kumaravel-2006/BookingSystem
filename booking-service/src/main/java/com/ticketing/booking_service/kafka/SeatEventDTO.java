package com.ticketing.booking_service.kafka;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SeatEventDTO {
    private Long eventId;
    private Long seatId;
    private Long userId;
    private String status;  // LOCKED, RELEASED, CONFIRMED
}