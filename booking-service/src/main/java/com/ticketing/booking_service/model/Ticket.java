package com.ticketing.booking_service.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "ticket")
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Column(nullable = false)
    private String qrCodeData;

    @Column(nullable = false, unique = true)
    private String ticketCode;

    @Column(nullable = false)
    private LocalDateTime generatedAt;

}
