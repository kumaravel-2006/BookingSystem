package com.ticketing.booking_service.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class BookingKafkaProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;

    // Published when seats are locked — queue-service listens to notify waiting users
    public void publishSeatsLocked(Long eventId, List<Long> seatIds, Long userId) {
        for (Long seatId : seatIds) {
            SeatEventDTO event = new SeatEventDTO(eventId, seatId, userId, "LOCKED");
            kafkaTemplate.send("seat-locked", event);
            log.info("Published seat-locked: eventId={}, seatId={}, userId={}", eventId, seatId, userId);
        }
    }

    // Published when seats are released — queue-service listens to allocate next person
    public void publishSeatsReleased(Long eventId, List<Long> seatIds, Long userId) {
        for (Long seatId : seatIds) {
            SeatEventDTO event = new SeatEventDTO(eventId, seatId, userId, "RELEASED");
            kafkaTemplate.send("seat-released", event);
            log.info("Published seat-released: eventId={}, seatId={}, userId={}", eventId, seatId, userId);
        }
    }

    // Published after payment confirmed — queue-service removes user from queue
    public void publishBookingConfirmed(Long eventId, Long bookingId, Long userId) {
        SeatEventDTO event = new SeatEventDTO(eventId, bookingId, userId, "CONFIRMED");
        kafkaTemplate.send("booking-confirmed", event);
        log.info("Published booking-confirmed: eventId={}, bookingId={}, userId={}", eventId, bookingId, userId);
    }

    // Published if payment fails — queue-service re-opens seats
    public void publishPaymentFailed(Long eventId, List<Long> seatIds, Long userId) {
        for (Long seatId : seatIds) {
            SeatEventDTO event = new SeatEventDTO(eventId, seatId, userId, "PAYMENT_FAILED");
            kafkaTemplate.send("payment-failed", event);
            log.info("Published payment-failed: eventId={}, seatId={}, userId={}", eventId, seatId, userId);
        }
    }
}