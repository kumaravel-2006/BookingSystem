package com.ticketing.queue_service.service;

import com.ticketing.queue_service.dto.QueueWebSocketPayload;
import com.ticketing.queue_service.model.enums.QueueStatus;
import com.ticketing.queue_service.websocket.QueueWebSocketHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class QueueNotificationService {

    private final QueueWebSocketHandler queueWebSocketHandler;

    /**
     * Pushes real-time status packets directly to the user's frontend screen.
     */
    public void sendRealTimeQueueUpdate(Long userId, Long eventId, QueueStatus status, Long position) {
        String topic = "/topic/queue/" + userId;

        String type = (status == QueueStatus.ALLOCATED) ? "SEAT_ALLOCATED" : "QUEUE_UPDATED";
        long waitSeconds = (status == QueueStatus.WAITING) ? position * 30L : 0L;
        long waitMinutes = (long) Math.ceil((double) waitSeconds / 60.0);

        QueueWebSocketPayload updatePayload = QueueWebSocketPayload.builder()
                .type(type)
                .position(position)
                .estimatedWaitMinutes(waitMinutes)
                .build();

        log.info("Pushing live WebSocket update to client path {}: {}", topic, updatePayload);
        queueWebSocketHandler.sendNotification(topic, updatePayload);
    }
}