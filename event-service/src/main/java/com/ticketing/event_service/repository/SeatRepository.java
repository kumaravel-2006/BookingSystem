package com.ticketing.event_service.repository;

import com.ticketing.event_service.model.Seat;
import com.ticketing.event_service.model.enums.SeatStatus;
import com.ticketing.event_service.model.enums.SeatCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SeatRepository extends JpaRepository<Seat, Long> {

    List<Seat> findByEventId(Long eventId);

    List<Seat> findByEventIdAndStatus(Long eventId, SeatStatus status);
}
