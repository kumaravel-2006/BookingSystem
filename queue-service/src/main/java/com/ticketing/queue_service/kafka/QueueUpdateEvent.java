package com.ticketing.queue_service.kafka;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QueueUpdateEvent {
    private Long eventId;
    private Long userId;
    private String status;
}
