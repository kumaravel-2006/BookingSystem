package com.ticketing.queue_service.service;

import com.ticketing.queue_service.cache.QueueCacheService;
import com.ticketing.queue_service.kafka.QueueKafkaProducer;
import com.ticketing.queue_service.model.QueueEntry;
import com.ticketing.queue_service.model.enums.QueueStatus;
import com.ticketing.queue_service.repository.QueueEntryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class QueueAllocationService {

    private final QueueCacheService queueCacheService;
    private final QueueEntryRepository queueEntryRepository;
    private final QueueKafkaProducer queueKafkaProducer;
    private final QueueNotificationService queueNotificationService;

    /**
     * Promotes the next 'n' waiting users to allow them to book available seats.
     */
    @Transactional
    public void allocateSeats(Long eventId, int availableSeatsCount) {
        if (availableSeatsCount <= 0) return;

        // 1. Pull the top waiters from Redis sorted set
        Set<String> topWaiters = queueCacheService.getTopWaiters(eventId, availableSeatsCount);

        if (topWaiters == null || topWaiters.isEmpty()) {
            log.info("No users waiting in queue for event {}", eventId);
            return;
        }

        for (String waiterIdStr : topWaiters) {
            Long userId = Long.valueOf(waiterIdStr);

            // 2. Update status in PostgreSQL to ALLOCATED
            queueEntryRepository.findByUserIdAndEventIdAndStatus(userId, eventId, QueueStatus.WAITING)
                    .ifPresent(entry -> {
                        entry.setStatus(QueueStatus.ALLOCATED);
                        entry.setAllocatedAt(LocalDateTime.now());
                        entry.setExpiresAt(LocalDateTime.now().plusMinutes(5)); // 5 minute booking window
                        queueEntryRepository.save(entry);

                        log.info("User {} allocated a spot for event {}", userId, eventId);
                    });

            // 3. Remove them from Redis waiting queue since they are no longer waiting
            queueCacheService.leaveQueue(eventId, userId);

            // 4. Notify other services and frontend via Kafka
            queueKafkaProducer.sendQueueUpdate(eventId, userId, "ALLOCATED");
        }

        // 5. Notify the remaining waiters of their updated positions
        Set<String> remainingWaiters = queueCacheService.getAllWaiters(eventId);
        if (remainingWaiters != null) {
            for (String waiterIdStr : remainingWaiters) {
                Long uId = Long.valueOf(waiterIdStr);
                Long position = queueCacheService.getQueuePosition(eventId, uId);
                if (position > 0) {
                    queueNotificationService.sendRealTimeQueueUpdate(uId, eventId, QueueStatus.WAITING, position);
                }
            }
        }
    }
}