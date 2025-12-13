package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Models.RideRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RideRequestRepository extends JpaRepository<RideRequest, Long> {
    List<RideRequest> findByRideRideId(Long rideId);
    List<RideRequest> findByPassengerUserId(Long passengerId);
    List<RideRequest> findByRideRideIdAndStatus(Long rideId, String status);
    Optional<RideRequest> findByRideRideIdAndPassengerUserId(Long rideId, Long passengerId);
    Long countByRideRideIdAndStatus(Long rideId, String status);
}
