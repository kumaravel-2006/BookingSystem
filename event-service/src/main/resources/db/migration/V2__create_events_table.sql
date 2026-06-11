CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    event_date TIMESTAMP NOT NULL,
    status VARCHAR(50) DEFAULT 'DRAFT',
    image_url VARCHAR(500),
    min_price DECIMAL(10,2),
    available_seats INTEGER DEFAULT 0,
    is_high_demand BOOLEAN DEFAULT FALSE,
    venue_id BIGINT REFERENCES venues(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);