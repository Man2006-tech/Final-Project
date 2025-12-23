package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Models.RideRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RideRequestRepository extends JpaRepository<RideRequest, Long> {
    @Query("SELECT DISTINCT rr FROM RideRequest rr LEFT JOIN FETCH rr.ride r LEFT JOIN FETCH r.driver LEFT JOIN FETCH rr.passenger WHERE rr.ride.rideId = :rideId")
    List<RideRequest> findByRideRideId(@Param("rideId") Long rideId);

    @Query("SELECT DISTINCT rr FROM RideRequest rr LEFT JOIN FETCH rr.ride r LEFT JOIN FETCH r.driver LEFT JOIN FETCH rr.passenger WHERE rr.passenger.userId = :passengerId")
    List<RideRequest> findByPassengerUserId(@Param("passengerId") Long passengerId);

    @Query("SELECT DISTINCT rr FROM RideRequest rr LEFT JOIN FETCH rr.ride r LEFT JOIN FETCH r.driver LEFT JOIN FETCH rr.passenger WHERE rr.ride.rideId = :rideId AND rr.status = :status")
    List<RideRequest> findByRideRideIdAndStatus(@Param("rideId") Long rideId, @Param("status") String status);

    // Simple query without eager loading for updates/deletes
    @Query("SELECT rr FROM RideRequest rr WHERE rr.ride.rideId = :rideId")
    List<RideRequest> findSimpleByRideId(@Param("rideId") Long rideId);

    Optional<RideRequest> findByRideRideIdAndPassengerUserId(Long rideId, Long passengerId);
    Long countByRideRideIdAndStatus(Long rideId, String status);
}
