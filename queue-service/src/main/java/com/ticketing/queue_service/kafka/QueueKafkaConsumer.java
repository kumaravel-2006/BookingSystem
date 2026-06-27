package com.ticketing.queue_service.kafka;

import com.ticketing.queue_service.model.enums.QueueStatus;
import com.ticketing.queue_service.service.QueueAllocationService;
import com.ticketing.queue_service.service.QueueNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class QueueKafkaConsumer {

    private final QueueAllocationService queueAllocationService;
    private final QueueNotificationService queueNotificationService;

    @KafkaListener(topics = "seat-released", groupId = "queue-service-group")
    public void consumeSeatReleased(SeatEventDTO seatEvent) {
        log.info("Received seat-released message from Kafka: {}", seatEvent);
        try {
            if (seatEvent != null && seatEvent.getEventId() != null) {
                // Re-allocate waiting pool seats
                queueAllocationService.allocateSeats(seatEvent.getEventId(), 1);
            }
        } catch (Exception e) {
            log.error("Failed processing seat-released step mechanics", e);
        }
    }

    @KafkaListener(topics = "queue-updated", groupId = "queue-service-group")
    public void consumeQueueUpdated(QueueUpdateEvent event) {
        log.info("Intercepted queue-updated status payload message: {}", event);
        try {
            if (event != null) {
                Long eventId = event.getEventId();
                Long userId = event.getUserId();
                QueueStatus status = QueueStatus.valueOf(event.getStatus());

                // Send live WebSocket push to the user (0 position because they are now ALLOCATED)
                queueNotificationService.sendRealTimeQueueUpdate(userId, eventId, status, 0L);
            }
        } catch (Exception e) {
            log.error("Failed transmitting real-time WebSocket state update", e);
        }
    }
}