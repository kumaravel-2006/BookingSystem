package com.ticketing.booking_service.service;

import com.ticketing.booking_service.model.Booking;
import com.ticketing.booking_service.model.Ticket;
import com.ticketing.booking_service.repository.TicketRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;

    /**
     * Generates a ticket with a unique code and QR data string.
     * QR data encodes enough info for venue staff to validate at entry.
     */
    public Ticket generateTicket(Booking booking) {
        String ticketCode = "TKT-" + UUID.randomUUID().toString().toUpperCase().substring(0, 8);

        // QR data format: ticketCode|bookingId|eventId|userId|seats
        String qrCodeData = String.join("|",
                ticketCode,
                String.valueOf(booking.getId()),
                String.valueOf(booking.getEventId()),
                String.valueOf(booking.getUserId()),
                booking.getSeatIds().toString()
        );

        Ticket ticket = new Ticket();
        ticket.setBooking(booking);
        ticket.setTicketCode(ticketCode);
        ticket.setQrCodeData(qrCodeData);
        ticket.setGeneratedAt(LocalDateTime.now());

        Ticket saved = ticketRepository.save(ticket);
        log.info("Ticket generated: {} for bookingId={}", ticketCode, booking.getId());
        return saved;
    }

    public Ticket getTicketByBookingId(Long bookingId) {
        return ticketRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Ticket not found for bookingId: " + bookingId));
    }
}