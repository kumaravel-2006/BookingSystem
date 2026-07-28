package com.ticketing.event_service.service;

import com.ticketing.event_service.model.Event;
import com.ticketing.event_service.model.Seat;
import com.ticketing.event_service.dto.SeatDTO;
import com.ticketing.event_service.model.enums.SeatCategory;
import com.ticketing.event_service.model.enums.SeatStatus;
import com.ticketing.event_service.repository.EventRepository;
import com.ticketing.event_service.repository.SeatRepository;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
public class SeatService {
    private final SeatRepository seatRepository;
    private final EventRepository eventRepository;

    public List<SeatDTO> createSeats(Long eventId, List<SeatDTO> seatDTOs) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found: " + eventId));

        List<Seat> seats = seatDTOs.stream().map(dto -> {
            Seat seat = new Seat();
            seat.setEvent(event);
            seat.setRow(dto.getRow());
            seat.setNumber(dto.getNumber());
            seat.setCategory(SeatCategory.valueOf(dto.getCategory()));
            seat.setPrice(dto.getPrice());
            seat.setStatus(SeatStatus.AVAILABLE);
            return seat;
        }).collect(Collectors.toList());

        return seatRepository.saveAll(seats).stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<SeatDTO> getSeatsByEventId(Long eventId){
        List<Seat> seats = seatRepository.findByEventId(eventId);
        if (seats.isEmpty()) {
            Event event = eventRepository.findById(eventId).orElse(null);
            if (event != null && event.getVenue() != null) {
                generateSeatsForEventOnTheFly(event, event.getVenue());
                seats = seatRepository.findByEventId(eventId);
            }
        }
        return seats.stream().map(this::toDTO).collect(Collectors.toList());
    }

    private void generateSeatsForEventOnTheFly(Event event, com.ticketing.event_service.model.Venue venue) {
        String layoutClass = venue.getTheatreClass();
        if (layoutClass == null) {
            layoutClass = "STANDARD";
        }
        
        int rows = 5;
        int seatsPerRow = 10;
        
        if ("IMAX".equalsIgnoreCase(layoutClass)) {
            rows = 8;
            seatsPerRow = 10;
        } else if ("PREMIUM".equalsIgnoreCase(layoutClass)) {
            rows = 4;
            seatsPerRow = 10;
        } else if ("STANDARD".equalsIgnoreCase(layoutClass)) {
            rows = 6;
            seatsPerRow = 10;
        }
        
        for (int i = 0; i < rows; i++) {
            char rowChar = (char) ('A' + i);
            String row = String.valueOf(rowChar);
            for (int col = 1; col <= seatsPerRow; col++) {
                Seat seat = new Seat();
                seat.setEvent(event);
                seat.setRow(row);
                seat.setNumber(col);
                
                java.math.BigDecimal basePrice = event.getMinPrice() != null ? event.getMinPrice() : new java.math.BigDecimal("10.0");
                if (i < 2) {
                    seat.setCategory(SeatCategory.VIP);
                    seat.setPrice(basePrice.multiply(new java.math.BigDecimal("2.0")));
                } else if (i < 4) {
                    seat.setCategory(SeatCategory.PREMIUM);
                    seat.setPrice(basePrice.multiply(new java.math.BigDecimal("1.5")));
                } else {
                    seat.setCategory(SeatCategory.STANDARD);
                    seat.setPrice(basePrice);
                }
                
                seat.setStatus(SeatStatus.AVAILABLE);
                seatRepository.save(seat);
            }
        }
        
        event.setAvailableSeats(rows * seatsPerRow);
        eventRepository.save(event);
    }
    public SeatDTO updateSeatStatus(Long id, String status) {
        Seat seat = seatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seat not found"));
        seat.setStatus(SeatStatus.valueOf(status));
        return toDTO(seatRepository.save(seat));
    }

    private SeatDTO toDTO(Seat seat){
        SeatDTO dto = new SeatDTO();

        dto.setId(seat.getId());
        dto.setStatus(String.valueOf(seat.getStatus()));
        dto.setCategory(String.valueOf(seat.getCategory()));
        dto.setRow(seat.getRow());
        dto.setPrice(seat.getPrice());
        dto.setNumber(seat.getNumber());


        return dto;
    }
}
