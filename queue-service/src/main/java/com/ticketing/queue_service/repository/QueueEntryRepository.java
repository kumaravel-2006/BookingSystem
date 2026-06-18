package com.ticketing.queue_service.repository;

import com.ticketing.queue_service.model.QueueEntry;
import com.ticketing.queue_service.model.enums.QueueStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QueueEntryRepository extends JpaRepository<QueueEntry, Long> {

    // Finds a user's active status tracking for a specific event
    Optional<QueueEntry> findByUserIdAndEventIdAndStatus(Long userId, Long eventId, QueueStatus status);
}