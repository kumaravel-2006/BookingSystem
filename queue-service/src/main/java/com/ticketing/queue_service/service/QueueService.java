package com.ticketing.queue_service.service;

import com.ticketing.queue_service.cache.QueueCacheService;
import com.ticketing.queue_service.dto.QueueJoinRequestDTO;
import com.ticketing.queue_service.dto.QueueStatusDTO;
import com.ticketing.queue_service.model.QueueEntry;
import com.ticketing.queue_service.model.enums.QueueStatus;
import com.ticketing.queue_service.repository.QueueEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class QueueService {

    private final QueueCacheService queueCacheService;
    private final QueueEntryRepository queueEntryRepository;
    private final QueueNotificationService queueNotificationService;

    private static final long ESTIMATED_TIME_PER_PERSON_SECONDS = 30L;

    /**
     * Handles a user requesting to join the waiting queue for an event.
     */
    @Transactional
    public QueueStatusDTO joinQueue(QueueJoinRequestDTO request) {
        Long userId = request.getUserId();
        Long eventId = request.getEventId();

        // 1. Check if the user already has an active WAITING or ALLOCATED record in Postgres
        Optional<QueueEntry> existingRecord = queueEntryRepository
                .findByUserIdAndEventIdAndStatus(userId, eventId, QueueStatus.WAITING);

        if (existingRecord.isEmpty()) {
            existingRecord = queueEntryRepository
                    .findByUserIdAndEventIdAndStatus(userId, eventId, QueueStatus.ALLOCATED);
        }

        // If they are already in an active state, just return their current standing
        if (existingRecord.isPresent()) {
            return getStatusDTO(userId, eventId, existingRecord.get().getStatus());
        }

        // 2. Persist transaction history log to PostgreSQL
        QueueEntry newEntry = new QueueEntry();
        newEntry.setUserId(userId);
        newEntry.setEventId(eventId);
        newEntry.setStatus(QueueStatus.WAITING);
        newEntry.setJoinedAt(LocalDateTime.now());
        queueEntryRepository.save(newEntry);

        // 3. Push to high-performance Redis cache queue
        queueCacheService.joinQueue(eventId, userId);

        // 4. Calculate position and return response payload
        return getStatusDTO(userId, eventId, QueueStatus.WAITING);
    }

    /**
     * Handles a user voluntarily leaving the waiting queue.
     */
    @Transactional
    public void leaveQueue(Long eventId, Long userId) {
        // 1. Update status in PostgreSQL to track historic trail
        queueEntryRepository.findByUserIdAndEventIdAndStatus(userId, eventId, QueueStatus.WAITING)
                .ifPresent(entry -> {
                    entry.setStatus(QueueStatus.LEFT);
                    queueEntryRepository.save(entry);
                });

        // 2. Evict them from the Redis collection immediately
        queueCacheService.leaveQueue(eventId, userId);

        // 3. Notify remaining waiters of their new positions
        notifyRemainingWaiters(eventId);
    }

    /**
     * Formulates current positional state for a given user.
     */
    public QueueStatusDTO getQueueStatus(Long eventId, Long userId) {
        // Check database to see if they are ALLOCATED or still WAITING
        QueueStatus currentStatus = queueEntryRepository
                .findByUserIdAndEventIdAndStatus(userId, eventId, QueueStatus.ALLOCATED)
                .map(QueueEntry::getStatus)
                .orElse(QueueStatus.WAITING);

        return getStatusDTO(userId, eventId, currentStatus);
    }

    /**
     * Broadcasts queue updates to all active waiters for an event.
     */
    public void notifyRemainingWaiters(Long eventId) {
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

    // Helper method to compute wait time estimates and wrap into a DTO
    private QueueStatusDTO getStatusDTO(Long userId, Long eventId, QueueStatus status) {
        long position = 0L;
        long estimatedWaitTime = 0L;
        long estimatedWaitMinutes = 0L;

        if (status == QueueStatus.WAITING) {
            position = queueCacheService.getQueuePosition(eventId, userId);

            // If position returns -1, it means they dropped out of cache but are marked waiting
            if (position > 0) {
                estimatedWaitTime = position * ESTIMATED_TIME_PER_PERSON_SECONDS;
                estimatedWaitMinutes = (long) Math.ceil((double) estimatedWaitTime / 60.0);
            } else {
                position = 0L; // Fallback reset
            }
        }

        return QueueStatusDTO.builder()
                .userId(userId)
                .eventId(eventId)
                .status(status)
                .position(position)
                .estimatedWaitTimeSeconds(estimatedWaitTime)
                .estimatedWaitMinutes(estimatedWaitMinutes)
                .build();
      }
}