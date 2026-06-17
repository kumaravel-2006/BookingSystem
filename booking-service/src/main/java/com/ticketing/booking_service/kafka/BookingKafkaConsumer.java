package com.ticketing.booking_service.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class BookingKafkaConsumer {

    // booking-service currently only needs to listen to payment-related events
    // from a future payment-service. Placeholder for now.

    @KafkaListener(topics = "payment-confirmed", groupId = "booking-service-group")
    public void onPaymentConfirmed(String bookingId) {
        // future: update booking status from PENDING to CONFIRMED
        // when a real payment service is integrated
        log.info("Received payment-confirmed for bookingId: {}", bookingId);
    }

    @KafkaListener(topics = "payment-failed", groupId = "booking-service-group")
    public void onPaymentFailed(String bookingId) {
        // future: cancel booking and release seats
        log.info("Received payment-failed for bookingId: {}", bookingId);
    }
}