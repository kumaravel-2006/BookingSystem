package com.ticketing.booking_service.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BookingResponseDTO {
    private Long id;
    private Long userId;
    private Long eventId;
    private List<Long> seatIds;
    private Double totalAmount;
    private String status;
    private String paymentStatus;
    private LocalDateTime createdAt;
    private LocalDateTime lockExpiresAt;
    private String ticketCode;

}
