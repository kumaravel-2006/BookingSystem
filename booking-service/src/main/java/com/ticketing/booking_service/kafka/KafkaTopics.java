package com.ticketing.booking_service.kafka;

public final class KafkaTopics {

    private KafkaTopics() {}

    public static final String SEAT_LOCKED = "seat-locked";
    public static final String SEAT_RELEASED = "seat-released";
    public static final String BOOKING_CONFIRMED = "booking-confirmed";
    public static final String PAYMENT_FAILED = "payment-failed";
    public static final String PAYMENT_CONFIRMED = "payment-confirmed";
}