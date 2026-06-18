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

    public void publishSeatsLocked(
            Long eventId,
            List<Long> seatIds,
            Long userId) {

        for (Long seatId : seatIds) {

            SeatEventDTO event = new SeatEventDTO(
                    eventId,
                    seatId,
                    null,
                    userId,
                    "LOCKED"
            );

            kafkaTemplate.send(KafkaTopics.SEAT_LOCKED, event);
        }
    }

    public void publishSeatsReleased(
            Long eventId,
            List<Long> seatIds,
            Long userId) {

        for (Long seatId : seatIds) {

            SeatEventDTO event = new SeatEventDTO(
                    eventId,
                    seatId,
                    null,
                    userId,
                    "RELEASED"
            );

            kafkaTemplate.send(KafkaTopics.SEAT_RELEASED, event);
        }
    }

    public void publishBookingConfirmed(
            Long eventId,
            Long bookingId,
            Long userId) {

        SeatEventDTO event = new SeatEventDTO(
                eventId,
                null,
                bookingId,
                userId,
                "CONFIRMED"
        );

        kafkaTemplate.send(KafkaTopics.BOOKING_CONFIRMED, event);
    }

    public void publishPaymentFailed(
            Long eventId,
            List<Long> seatIds,
            Long userId) {

        for (Long seatId : seatIds) {

            SeatEventDTO event = new SeatEventDTO(
                    eventId,
                    seatId,
                    null,
                    userId,
                    "PAYMENT_FAILED"
            );

            kafkaTemplate.send(KafkaTopics.PAYMENT_FAILED, event);
        }
    }
}