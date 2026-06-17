package com.ticketing.booking_service.service;

import com.ticketing.booking_service.model.Booking;
import com.ticketing.booking_service.model.enums.PaymentStatus;
import com.ticketing.booking_service.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final BookingRepository bookingRepository;

    /**
     * Simulated payment — always succeeds for now.
     * Replace this with a real payment gateway (Razorpay, Stripe) later.
     */
    public PaymentStatus processPayment(Booking booking) {
        log.info("Processing payment for bookingId={}, amount={}, userId={}",
                booking.getId(), booking.getTotalAmount(), booking.getUserId());

        // Simulate processing delay (optional — remove in production)
        try {
            Thread.sleep(200);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        log.info("Payment SUCCESS for bookingId={}", booking.getId());
        return PaymentStatus.SUCCESS;
    }
}