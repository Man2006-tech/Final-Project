package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Models.Venue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VenueRepository extends JpaRepository<Venue, Long> {
    List<Venue> findByAvailabilityStatus(String status);
    Optional<Venue> findByName(String name);

    @Query("SELECT v FROM Venue v WHERE v.capacity >= :minCapacity")
    List<Venue> findByMinimumCapacity(@Param("minCapacity") Integer minCapacity);
}
