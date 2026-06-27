package com.ticketing.queue_service.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class QueueKafkaProducer {

    private final KafkaTemplate<String, Object> kafkaTemplate;
    private static final String TOPIC = "queue-updated";

    public void sendQueueUpdate(Long eventId, Long userId, String status) {
        QueueUpdateEvent event = new QueueUpdateEvent(eventId, userId, status);
        log.info("Publishing queue update event to Kafka: {}", event);
        kafkaTemplate.send(TOPIC, String.valueOf(eventId), event);
    }
}