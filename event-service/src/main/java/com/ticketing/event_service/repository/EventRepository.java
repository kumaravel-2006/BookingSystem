package com.ticketing.event_service.repository;

import com.ticketing.event_service.model.Event;
import com.ticketing.event_service.model.enums.EventStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event , Long>{

    List<Event> findByStatus(EventStatus status);
    List<Event> findByCategory(String category);
    List<Event> findByTitleContainingIgnoreCase(String title);
}
