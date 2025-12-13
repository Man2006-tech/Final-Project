package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Models.RideShare;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface RideShareRepository extends JpaRepository<RideShare, Long> {
    List<RideShare> findByDriverUserId(Long driverId);
    List<RideShare> findByStatus(String status);
    List<RideShare> findByDepartureTimeAfter(LocalDateTime dateTime);

    @Query("SELECT r FROM RideShare r WHERE r.departureTime >= :now AND r.status = 'ACTIVE' AND r.deletedAt IS NULL ORDER BY r.departureTime ASC")
    List<RideShare> findUpcomingRides(@Param("now") LocalDateTime now);

    @Query("SELECT r FROM RideShare r WHERE (r.pickupLocation LIKE %:keyword% OR r.destination LIKE %:keyword%) AND r.status = 'ACTIVE' AND r.deletedAt IS NULL")
    List<RideShare> searchRides(@Param("keyword") String keyword);
}
