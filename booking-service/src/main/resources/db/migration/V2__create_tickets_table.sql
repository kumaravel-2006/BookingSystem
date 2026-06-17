CREATE TABLE ticket (
    id BIGSERIAL PRIMARY KEY,
    booking_id BIGINT NOT NULL UNIQUE REFERENCES booking(id),
    qr_code_data TEXT NOT NULL,
    ticket_code VARCHAR(50) NOT NULL UNIQUE,
    generated_at TIMESTAMP NOT NULL
);