package com.ticketing.event_service.service;

import com.ticketing.event_service.dto.VenueDTO;
import com.ticketing.event_service.model.Venue;
import com.ticketing.event_service.repository.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VenueService {

    private final VenueRepository venueRepository;

    public List<VenueDTO> getAllVenues() {
        return venueRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public VenueDTO getVenueById(Long id) {
        Venue venue = venueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found"));
        return toDTO(venue);
    }

    public VenueDTO createVenue(VenueDTO dto) {
        Venue venue = new Venue();
        venue.setName(dto.getName());
        venue.setAddress(dto.getAddress());
        venue.setCity(dto.getCity());
        venue.setCapacity(dto.getCapacity());
        venue.setTheatreClass(dto.getTheatreClass() != null ? dto.getTheatreClass() : "STANDARD");
        return toDTO(venueRepository.save(venue));
    }

    public void deleteVenue(Long id) {
        venueRepository.deleteById(id);
    }

    private VenueDTO toDTO(Venue venue) {
        VenueDTO dto = new VenueDTO();
        dto.setId(venue.getId());
        dto.setName(venue.getName());
        dto.setAddress(venue.getAddress());
        dto.setCity(venue.getCity());
        dto.setCapacity(venue.getCapacity());
        dto.setTheatreClass(venue.getTheatreClass());
        return dto;
    }
}