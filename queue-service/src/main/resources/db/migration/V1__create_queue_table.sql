CREATE TABLE queue_entries (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    status VARCHAR(50) NOT NULL,
    joined_at TIMESTAMP NOT NULL,
    allocated_at TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE INDEX idx_queue_user_event_status ON queue_entries(user_id, event_id, status);