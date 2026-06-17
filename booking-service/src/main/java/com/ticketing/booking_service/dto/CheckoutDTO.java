package com.ticketing.booking_service.dto;

import lombok.Data;
import java.util.List;

@Data
public class CheckoutDTO {
    private Long BookingId;
    private Long eventId;
    private List<Long> seatIds;
    private Double subtotal;
    private Double tax;
    private Double totalAmount;
    private Long lockExpiresInSeconds;
}