package com.ticketing.booking_service.controller;

import com.ticketing.booking_service.service.SeatLockService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/seats")
@RequiredArgsConstructor
public class SeatLockController {

    private final SeatLockService seatLockService;

    // Check if a specific seat is locked — frontend uses this to grey out seats on the map
    @GetMapping("/{eventId}/{seatId}/status")
    public ResponseEntity<Map<String, Object>> getSeatStatus(
            @PathVariable Long eventId,
            @PathVariable Long seatId) {

        boolean locked = seatLockService.isSeatLocked(eventId, seatId);
        Long ttl = locked ? seatLockService.getRemainingTTL(eventId, seatId) : null;

        return ResponseEntity.ok(Map.of(
                "seatId", seatId,
                "eventId", eventId,
                "locked", locked,
                "remainingTtlSeconds", ttl != null ? ttl : 0
        ));
    }
}