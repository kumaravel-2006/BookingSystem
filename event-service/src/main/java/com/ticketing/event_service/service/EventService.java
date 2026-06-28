package com.ticketing.event_service.service;

import com.ticketing.event_service.model.Event;
import com.ticketing.event_service.model.Venue;
import com.ticketing.event_service.dto.VenueDTO;
import com.ticketing.event_service.model.enums.EventStatus;
import com.ticketing.event_service.repository.EventRepository;
import com.ticketing.event_service.dto.EventDTO;
import com.ticketing.event_service.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;

    private final VenueRepository venueRepository;

    private final com.ticketing.event_service.repository.SeatRepository seatRepository;

    public List<EventDTO> getAllEvents(){
        return eventRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public EventDTO getEventById(Long id){
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event Not found"));
        return toDTO(event);
    }

    public EventDTO createEvent(EventDTO dto){
        Event event = new Event();
        event.setTitle(dto.getTitle());
        event.setCategory(dto.getCategory());
        event.setDescription(dto.getDescription());
        event.setEventDate(dto.getEventDate());
        event.setStatus(EventStatus.valueOf(dto.getStatus()));
        event.setImageUrl(dto.getImageUrl());
        event.setMinPrice(dto.getMinPrice());
        event.setAvailableSeats(dto.getAvailableSeats());
        event.setIsHighDemand(dto.getIsHighDemand());

        Venue venue = venueRepository.findById(dto.getVenue().getId())
                .orElseThrow(() -> new RuntimeException("Venue not found"));
        event.setVenue(venue);

        return toDTO(eventRepository.save(event));

    }

    public EventDTO updateEvent(Long id , EventDTO dto){
        Event event = eventRepository.findById(id).orElseThrow(() -> new RuntimeException("Event Not Found"));
        event.setTitle(dto.getTitle());
        event.setCategory(dto.getCategory());
        event.setDescription(dto.getDescription());
        event.setEventDate(dto.getEventDate());
        event.setStatus(EventStatus.valueOf(dto.getStatus()));
        event.setImageUrl(dto.getImageUrl());
        event.setMinPrice(dto.getMinPrice());
        event.setAvailableSeats(dto.getAvailableSeats());
        event.setIsHighDemand(dto.getIsHighDemand());

        Venue venue = venueRepository.findById(dto.getVenue().getId())
                .orElseThrow(() -> new RuntimeException("Venue not found"));
        event.setVenue(venue);

        return toDTO(eventRepository.save(event));
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteEvent(Long id){
        seatRepository.deleteByEventId(id);
        eventRepository.deleteById(id);
    }

    private EventDTO toDTO(Event event){
        EventDTO dto = new EventDTO();
        dto.setId(event.getId());
        dto.setTitle(event.getTitle());
        dto.setCategory(event.getCategory());
        dto.setDescription(event.getDescription());
        dto.setEventDate(event.getEventDate());
        dto.setStatus(String.valueOf(event.getStatus()));
        dto.setImageUrl(event.getImageUrl());
        dto.setMinPrice(event.getMinPrice());
        dto.setAvailableSeats(event.getAvailableSeats());
        dto.setIsHighDemand(event.getIsHighDemand());

        if (event.getVenue() != null) {
            VenueDTO venueDTO = new VenueDTO();
            venueDTO.setId(event.getVenue().getId());
            venueDTO.setName(event.getVenue().getName());
            venueDTO.setCity(event.getVenue().getCity());
            dto.setVenue(venueDTO);
        }
        return dto;

    }
}
