package com.ticketing.queue_service.controller;

import com.ticketing.queue_service.dto.QueueStatusDTO;
import com.ticketing.queue_service.service.QueueService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/queue")
@RequiredArgsConstructor
public class QueueStatusController {

    private final QueueService queueService;

    @GetMapping("/status")
    public ResponseEntity<QueueStatusDTO> getStatus(
            @RequestParam Long eventId,
            HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        return ResponseEntity.ok(queueService.getQueueStatus(eventId, userId));
    }
}