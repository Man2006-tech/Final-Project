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
    @Query("SELECT r FROM RideShare r LEFT JOIN FETCH r.driver")
    List<RideShare> findAllWithDriver();

    @Query("SELECT r FROM RideShare r LEFT JOIN FETCH r.driver WHERE r.rideId = :rideId")
    RideShare findByRideId(@Param("rideId") Long rideId);

    @Query("SELECT r FROM RideShare r LEFT JOIN FETCH r.driver WHERE r.driver.userId = :driverId")
    List<RideShare> findByDriverUserId(@Param("driverId") Long driverId);

    @Query("SELECT r FROM RideShare r LEFT JOIN FETCH r.driver WHERE r.status = :status")
    List<RideShare> findByStatus(@Param("status") String status);

    @Query("SELECT r FROM RideShare r LEFT JOIN FETCH r.driver WHERE r.departureTime > :dateTime")
    List<RideShare> findByDepartureTimeAfter(@Param("dateTime") LocalDateTime dateTime);

    @Query("SELECT r FROM RideShare r LEFT JOIN FETCH r.driver WHERE r.departureTime >= :now AND r.status = 'ACTIVE' AND r.deletedAt IS NULL ORDER BY r.departureTime ASC")
    List<RideShare> findUpcomingRides(@Param("now") LocalDateTime now);

    @Query("SELECT r FROM RideShare r LEFT JOIN FETCH r.driver WHERE (r.pickupLocation LIKE %:keyword% OR r.destination LIKE %:keyword%) AND r.status = 'ACTIVE' AND r.deletedAt IS NULL")
    List<RideShare> searchRides(@Param("keyword") String keyword);
}
