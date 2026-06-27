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
        return seatRepository.findByEventId(eventId).stream().map(this::toDTO).collect(Collectors.toList());
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
