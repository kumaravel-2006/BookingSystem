package com.ticketing.event_service.repository;

import com.ticketing.event_service.model.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VenueRepository extends JpaRepository<Venue , Long>{

}
