package com.ticketing.booking_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class SeatLockService {

    private final RedisTemplate<String, String> redisTemplate;

    private static final long LOCK_TTL_SECONDS = 300; // 5 minutes

    private String buildKey(Long eventId, Long seatId) {
        return "seat:lock:" + eventId + ":" + seatId;
    }

    /**
     * Lock a single seat atomically.
     * setIfAbsent = Redis SET NX EX — only sets if key doesn't exist.
     * Returns true if lock was acquired.
     */
    public boolean lockSeat(Long eventId, Long seatId, Long userId) {
        String key = buildKey(eventId, seatId);
        Boolean acquired = redisTemplate.opsForValue()
                .setIfAbsent(key, String.valueOf(userId), Duration.ofSeconds(LOCK_TTL_SECONDS));
        return Boolean.TRUE.equals(acquired);
    }

    /**
     * Lock multiple seats — all or nothing.
     * If any seat is already locked, rolls back all acquired locks and throws.
     */
    public void lockSeats(Long eventId, List<Long> seatIds, Long userId) {
        List<Long> locked = new java.util.ArrayList<>();

        for (Long seatId : seatIds) {
            if (lockSeat(eventId, seatId, userId)) {
                locked.add(seatId);
            } else {
                // Rollback what we already locked
                releaseSeats(eventId, locked, userId);
                log.warn("Seat {} already locked for event {} — rolling back", seatId, eventId);
                throw new RuntimeException("Seat " + seatId + " is already locked. Please choose different seats.");
            }
        }

        log.info("Locked {} seats for user {} on event {}", seatIds.size(), userId, eventId);
    }

    /**
     * Release seats — only if the requesting user owns the lock.
     * Prevents user A from releasing user B's lock.
     */
    public void releaseSeats(Long eventId, List<Long> seatIds, Long userId) {
        for (Long seatId : seatIds) {
            String key = buildKey(eventId, seatId);
            String owner = redisTemplate.opsForValue().get(key);
            if (String.valueOf(userId).equals(owner)) {
                redisTemplate.delete(key);
                log.info("Released seat {} for user {} on event {}", seatId, userId, eventId);
            } else {
                log.warn("User {} tried to release seat {} but doesn't own it (owner={})", userId, seatId, owner);
            }
        }
    }

    public boolean isSeatLocked(Long eventId, Long seatId) {
        return Boolean.TRUE.equals(redisTemplate.hasKey(buildKey(eventId, seatId)));
    }

    public Long getRemainingTTL(Long eventId, Long seatId) {
        return redisTemplate.getExpire(buildKey(eventId, seatId));
    }
}