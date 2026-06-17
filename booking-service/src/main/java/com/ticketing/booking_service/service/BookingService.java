package com.ticketing.booking_service.service;

import com.ticketing.booking_service.dto.*;
import com.ticketing.booking_service.kafka.BookingKafkaProducer;
import com.ticketing.booking_service.model.Booking;
import com.ticketing.booking_service.model.enums.BookingStatus;
import com.ticketing.booking_service.model.enums.PaymentStatus;
import com.ticketing.booking_service.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class BookingService {

    private final BookingRepository bookingRepository;
    private final SeatLockService seatLockService;
    private final PaymentService paymentService;
    private final TicketService ticketService;
    private final BookingKafkaProducer kafkaProducer;

    /**
     * Step 1 — Lock seats in Redis + create PENDING booking in DB.
     * Called when user clicks "Proceed" on seat selection page.
     */
    public BookingResponseDTO lockSeats(SeatLockRequestDTO request, Long userId) {
        if (request.getSeatIds().size() > 6) {
            throw new RuntimeException("Maximum 6 seats allowed per booking.");
        }

        // Lock all seats atomically — throws if any seat is taken
        seatLockService.lockSeats(request.getEventId(), request.getSeatIds(), userId);

        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setEventId(request.getEventId());
        booking.setSeatIds(request.getSeatIds());
        booking.setTotalAmount(request.getTotalAmount());
        booking.setStatus(BookingStatus.PENDING);
        booking.setPaymentStatus(PaymentStatus.PENDING);
        booking.setCreatedAt(LocalDateTime.now());
        booking.setLockExpiresAt(LocalDateTime.now().plusSeconds(300));

        Booking saved = bookingRepository.save(booking);

        // Notify queue-service that these seats are now locked
        kafkaProducer.publishSeatsLocked(request.getEventId(), request.getSeatIds(), userId);

        log.info("Booking {} created PENDING for userId={}", saved.getId(), userId);
        return toResponseDTO(saved);
    }

    /**
     * Step 2 — Process payment + confirm booking + generate ticket.
     * Called when user clicks "Confirm & Pay" on checkout page.
     */
    public BookingResponseDTO confirmBooking(CheckoutDTO checkout, Long userId) {
        Booking booking = bookingRepository.findById(checkout.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found: " + checkout.getBookingId()));

        // Ownership check
        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized — this booking belongs to a different user.");
        }

        // Lock expiry check
        if (booking.getLockExpiresAt().isBefore(LocalDateTime.now())) {
            booking.setStatus(BookingStatus.CANCELLED);
            booking.setPaymentStatus(PaymentStatus.FAILED);
            bookingRepository.save(booking);
            kafkaProducer.publishSeatsReleased(booking.getEventId(), booking.getSeatIds(), userId);
            throw new RuntimeException("Seat lock expired. Please select seats again.");
        }

        // Process payment
        PaymentStatus paymentResult = paymentService.processPayment(booking);

        if (paymentResult == PaymentStatus.FAILED) {
            booking.setStatus(BookingStatus.CANCELLED);
            booking.setPaymentStatus(PaymentStatus.FAILED);
            bookingRepository.save(booking);
            seatLockService.releaseSeats(booking.getEventId(), booking.getSeatIds(), userId);
            kafkaProducer.publishPaymentFailed(booking.getEventId(), booking.getSeatIds(), userId);
            throw new RuntimeException("Payment failed. Seats have been released.");
        }

        booking.setStatus(BookingStatus.CONFIRMED);
        booking.setPaymentStatus(PaymentStatus.SUCCESS);
        Booking saved = bookingRepository.save(booking);

        // Generate ticket
        ticketService.generateTicket(saved);

        // Notify queue-service — booking confirmed, seats permanently taken
        kafkaProducer.publishBookingConfirmed(saved.getEventId(), saved.getId(), userId);

        log.info("Booking {} CONFIRMED for userId={}", saved.getId(), userId);
        return toResponseDTO(saved);
    }

    public List<BookingResponseDTO> getMyBookings(Long userId) {
        return bookingRepository.findByUserId(userId)
                .stream().map(this::toResponseDTO).toList();
    }

    public BookingResponseDTO getBookingById(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized — this booking belongs to a different user.");
        }

        return toResponseDTO(booking);
    }

    public void cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found: " + bookingId));

        if (!booking.getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized — this booking belongs to a different user.");
        }

        if (booking.getStatus() == BookingStatus.CONFIRMED) {
            throw new RuntimeException("Confirmed bookings cannot be cancelled directly. Contact support.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        seatLockService.releaseSeats(booking.getEventId(), booking.getSeatIds(), userId);
        kafkaProducer.publishSeatsReleased(booking.getEventId(), booking.getSeatIds(), userId);

        log.info("Booking {} CANCELLED by userId={}", bookingId, userId);
    }

    private BookingResponseDTO toResponseDTO(Booking booking) {
        BookingResponseDTO dto = new BookingResponseDTO();
        dto.setId(booking.getId());
        dto.setUserId(booking.getUserId());
        dto.setEventId(booking.getEventId());
        dto.setSeatIds(booking.getSeatIds());
        dto.setTotalAmount(booking.getTotalAmount());
        dto.setStatus(booking.getStatus().toString());
        dto.setPaymentStatus(booking.getPaymentStatus().toString());
        dto.setCreatedAt(booking.getCreatedAt());
        dto.setLockExpiresAt(booking.getLockExpiresAt());
        return dto;
    }
}