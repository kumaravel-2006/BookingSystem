CREATE TABLE booking (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    event_id BIGINT NOT NULL,
    total_amount DOUBLE PRECISION NOT NULL,
    status VARCHAR(20) NOT NULL,
    payment_status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    lock_expires_at TIMESTAMP
);

CREATE TABLE booking_seat_ids (
    booking_id BIGINT NOT NULL REFERENCES booking(id),
    seat_ids BIGINT
);