package com.ticketing.queue_service.cache;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class QueueCacheService {

    private final RedisTemplate<String, String> redisTemplate;

    // Helper method to generate consistent Redis keys
    private String getQueueKey(Long eventId) {
        return "queue:event:" + eventId;
    }

    /**
     * 1. Add a user to the event's waiting queue with the current timestamp as the score.
     */
    public void joinQueue(Long eventId, Long userId) {
        String key = getQueueKey(eventId);
        String value = String.valueOf(userId);
        double score = System.currentTimeMillis();

        redisTemplate.opsForZSet().add(key, value, score);
    }

    /**
     * 2. Remove a user completely from the event's waiting queue.
     */
    public void leaveQueue(Long eventId, Long userId) {
        String key = getQueueKey(eventId);
        String value = String.valueOf(userId);

        redisTemplate.opsForZSet().remove(key, value);
    }

    /**
     * 3. Get the absolute 1-indexed position of a user in the queue.
     * @return position (1-based), or -1 if the user is not in the queue.
     */
    public Long getQueuePosition(Long eventId, Long userId) {
        String key = getQueueKey(eventId);
        String value = String.valueOf(userId);

        // rank() returns 0-indexed position based on score ascending (FIFO)
        Long rank = redisTemplate.opsForZSet().rank(key, value);

        if (rank == null) {
            return -1L; // User isn't in this queue
        }

        return rank + 1; // Convert to human-readable 1-indexed position
    }

    /**
     * 4. Pop/Retrieve the top 'n' users who have been waiting the longest.
     */
    public Set<String> getTopWaiters(Long eventId, long count) {
        String key = getQueueKey(eventId);

        // range(key, 0, count - 1) fetches the first 'n' entries with the lowest timestamps
        return redisTemplate.opsForZSet().range(key, 0, count - 1);
    }

    /**
     * 5. Helper to get total active queue size for dashboard monitoring
     */
    public Long getQueueSize(Long eventId) {
        String key = getQueueKey(eventId);
        return redisTemplate.opsForZSet().zCard(key);
    }
}