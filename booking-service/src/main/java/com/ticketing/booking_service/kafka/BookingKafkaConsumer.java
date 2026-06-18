package com.ticketing.booking_service.kafka;

import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
public class BookingKafkaConsumer {

    @KafkaListener(
            topics = KafkaTopics.PAYMENT_CONFIRMED,
            groupId = "booking-service-group"
    )
    public void onPaymentConfirmed(SeatEventDTO event) {

        log.info(
                "Payment confirmed for booking {} by user {}",
                event.getBookingId(),
                event.getUserId()
        );
    }

    @KafkaListener(
            topics = KafkaTopics.PAYMENT_FAILED,
            groupId = "booking-service-group"
    )
    public void onPaymentFailed(SeatEventDTO event) {

        log.info(
                "Payment failed for user {}",
                event.getUserId()
        );
    }
}