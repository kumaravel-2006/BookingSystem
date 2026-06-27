package com.ticketing.queue_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QueueWebSocketPayload {
    private String type; // "QUEUE_UPDATED" or "SEAT_ALLOCATED"
    private Long position;
    private Long estimatedWaitMinutes;
}
