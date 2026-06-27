package com.ticketing.queue_service.controller;

import com.ticketing.queue_service.dto.QueueJoinRequestDTO;
import com.ticketing.queue_service.dto.QueueLeaveRequestDTO;
import com.ticketing.queue_service.dto.QueueStatusDTO;
import com.ticketing.queue_service.service.QueueService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/queue")
@RequiredArgsConstructor
public class QueueController {

    private final QueueService queueService;

    @PostMapping("/join")
    public ResponseEntity<QueueStatusDTO> joinQueue(
            @Valid @RequestBody QueueJoinRequestDTO request,
            HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        request.setUserId(userId);
        return ResponseEntity.ok(queueService.joinQueue(request));
    }

    @PostMapping("/leave")
    public ResponseEntity<Void> leaveQueue(
            @RequestBody QueueLeaveRequestDTO request,
            HttpServletRequest httpRequest) {
        Long userId = (Long) httpRequest.getAttribute("userId");
        queueService.leaveQueue(request.getEventId(), userId);
        return ResponseEntity.ok().build();
    }
}