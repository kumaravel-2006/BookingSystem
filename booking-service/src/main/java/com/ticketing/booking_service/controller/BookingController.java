package com.ticketing.booking_service.controller;

import com.ticketing.booking_service.dto.*;
import com.ticketing.booking_service.service.BookingService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;

    // userId injected by JwtFilter via request attribute — no need to trust client-sent userId
    private Long extractUserId(HttpServletRequest request) {
        return (Long) request.getAttribute("userId");
    }

    @PostMapping("/lock")
    public ResponseEntity<BookingResponseDTO> lockSeats(
            @RequestBody SeatLockRequestDTO request,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(bookingService.lockSeats(request, extractUserId(httpRequest)));
    }

    @PostMapping("/confirm")
    public ResponseEntity<BookingResponseDTO> confirmBooking(
            @RequestBody CheckoutDTO checkout,
            HttpServletRequest httpRequest) {
        return ResponseEntity.ok(bookingService.confirmBooking(checkout, extractUserId(httpRequest)));
    }

    @GetMapping
    public ResponseEntity<List<BookingResponseDTO>> getMyBookings(HttpServletRequest request) {
        return ResponseEntity.ok(bookingService.getMyBookings(extractUserId(request)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookingResponseDTO> getBookingById(
            @PathVariable Long id,
            HttpServletRequest request) {
        return ResponseEntity.ok(bookingService.getBookingById(id, extractUserId(request)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(
            @PathVariable Long id,
            HttpServletRequest request) {
        bookingService.cancelBooking(id, extractUserId(request));
        return ResponseEntity.noContent().build();
    }
}