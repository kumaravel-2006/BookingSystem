package com.ticketing.queue_service.dto;

import com.ticketing.queue_service.model.enums.QueueStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class QueueStatusDTO {
    private Long userId;
    private Long eventId;
    private QueueStatus status;
    private Long position;
    private Long estimatedWaitTimeSeconds;

}
