package com.ticketing.queue_service.controller;

import com.ticketing.queue_service.service.QueueAllocationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/queue")
@RequiredArgsConstructor
public class AdminQueueController {

    private final QueueAllocationService queueAllocationService;

    /**
     * Manually forces the queue to allocate seats for next batch of users.
     */
    @PostMapping("/allocate")
    @PreAuthorize("hasRole('EVENT_MANAGER')") // Restricts access to managers only
    public ResponseEntity<Void> manuallyAllocateSeats(
            @RequestParam Long eventId,
            @RequestParam int availableSeatsCount) {

        queueAllocationService.allocateSeats(eventId, availableSeatsCount);
        return ResponseEntity.ok().build();
    }

    // You can add endpoints here to toggle a "paused" flag in Redis if needed!
}