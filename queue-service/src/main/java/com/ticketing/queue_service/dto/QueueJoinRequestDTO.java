package com.ticketing.queue_service.dto;

import lombok.Data;

@Data
public class QueueJoinRequestDTO {
    private Long userId;

    private Long eventId;
}
