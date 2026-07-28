ALTER TABLE venues ADD COLUMN theatre_class VARCHAR(50) DEFAULT 'STANDARD';

INSERT INTO venues (name, address, city, capacity, theatre_class) VALUES
('Wembley Arena', 'Lakeside, London HA9', 'London', 80, 'IMAX'),
('Royal Opera House', 'Bow St, London WC2E', 'London', 40, 'PREMIUM'),
('Metro Cinema', 'Mount Rd, Chennai 600002', 'Chennai', 60, 'STANDARD');
