package com.ticketing.event_service.controller;

import com.ticketing.event_service.dto.EventDTO;
import com.ticketing.event_service.dto.SeatDTO;
import com.ticketing.event_service.service.EventService;
import com.ticketing.event_service.service.SeatService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import lombok.RequiredArgsConstructor;
import java.util.List;

@RestController
@RequestMapping("/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;
    private final SeatService seatService;

    @GetMapping
    public ResponseEntity<List<EventDTO>> getAllEvents(){
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventDTO> getEventById(@PathVariable Long id){
        return ResponseEntity.ok(eventService.getEventById(id));
    }

    @GetMapping("/{id}/seats")
    public ResponseEntity<List<SeatDTO>> getSeatsByEventId(@PathVariable Long id){
        return ResponseEntity.ok(seatService.getSeatsByEventId(id));
    }

    @PostMapping
    public ResponseEntity<EventDTO> createEvent(@RequestBody EventDTO dto){
        return ResponseEntity.ok(eventService.createEvent(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EventDTO> updateEvent(@PathVariable Long id , @RequestBody EventDTO dto){
        return ResponseEntity.ok(eventService.updateEvent(id , dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id){
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }
}
