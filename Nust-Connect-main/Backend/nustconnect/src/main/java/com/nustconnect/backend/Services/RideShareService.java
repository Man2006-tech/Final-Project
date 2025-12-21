package com.nustconnect.backend.Services;

import com.nustconnect.backend.Models.RideRequest;
import com.nustconnect.backend.Models.RideShare;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.RideRequestRepository;
import com.nustconnect.backend.Repositories.RideShareRepository;
import com.nustconnect.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RideShareService {

    private final RideShareRepository rideRepository;
    private final RideRequestRepository requestRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    // ==================== RIDE CRUD ====================
    public RideShare createRide(Long driverId, RideShare ride) {
        User driver = userRepository.findById(driverId)
                .orElseThrow(() -> new IllegalArgumentException("Driver not found"));

        if (ride.getDepartureTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Departure time must be in the future");
        }

        ride.setDriver(driver);
        ride.setStatus("ACTIVE");

        return rideRepository.save(ride);
    }

    public RideShare getRideById(Long rideId) {
        return rideRepository.findById(rideId)
                .orElseThrow(() -> new IllegalArgumentException("Ride not found"));
    }

    public List<RideShare> getAllRides() {
        return rideRepository.findAll();
    }

    public List<RideShare> getRidesByDriver(Long driverId) {
        return rideRepository.findByDriverUserId(driverId);
    }

    public List<RideShare> getRidesByStatus(String status) {
        return rideRepository.findByStatus(status);
    }

    public List<RideShare> getActiveRides() {
        return rideRepository.findByStatus("ACTIVE");
    }

    public List<RideShare> getUpcomingRides() {
        return rideRepository.findUpcomingRides(LocalDateTime.now());
    }

    public List<RideShare> searchRides(String keyword) {
        return rideRepository.searchRides(keyword);
    }

    public RideShare updateRide(Long rideId, RideShare updatedRide) {
        RideShare existingRide = getRideById(rideId);

        if (updatedRide.getPickupLocation() != null) {
            existingRide.setPickupLocation(updatedRide.getPickupLocation());
        }
        if (updatedRide.getDestination() != null) {
            existingRide.setDestination(updatedRide.getDestination());
        }
        if (updatedRide.getDepartureTime() != null) {
            existingRide.setDepartureTime(updatedRide.getDepartureTime());
        }
        if (updatedRide.getAvailableSeats() != null) {
            existingRide.setAvailableSeats(updatedRide.getAvailableSeats());
        }
        if (updatedRide.getPricePerSeat() != null) {
            existingRide.setPricePerSeat(updatedRide.getPricePerSeat());
        }
        if (updatedRide.getNotes() != null) {
            existingRide.setNotes(updatedRide.getNotes());
        }
        if (updatedRide.getContactNumber() != null) {
            existingRide.setContactNumber(updatedRide.getContactNumber());
        }

        return rideRepository.save(existingRide);
    }

    public void deleteRide(Long rideId) {
        RideShare ride = getRideById(rideId);
        ride.softDelete();
        rideRepository.save(ride);
    }

    public void hardDeleteRide(Long rideId) {
        if (!rideRepository.existsById(rideId)) {
            throw new IllegalArgumentException("Ride not found");
        }
        rideRepository.deleteById(rideId);
    }

    // ==================== RIDE STATUS ====================
    public RideShare completeRide(Long rideId) {
        RideShare ride = getRideById(rideId);
        ride.setStatus("COMPLETED");
        return rideRepository.save(ride);
    }

    public RideShare cancelRide(Long rideId) {
        RideShare ride = getRideById(rideId);
        ride.setStatus("CANCELLED");
        return rideRepository.save(ride);
    }

    public void decrementSeats(Long rideId) {
        RideShare ride = getRideById(rideId);
        ride.decrementSeats();
        rideRepository.save(ride);
    }

    // ==================== REQUEST CRUD ====================
    public RideRequest createRequest(Long passengerId, Long rideId, RideRequest request) {
        User passenger = userRepository.findById(passengerId)
                .orElseThrow(() -> new IllegalArgumentException("Passenger not found"));
        RideShare ride = getRideById(rideId);

        if (ride.getDriver().getUserId().equals(passengerId)) {
            throw new IllegalArgumentException("Cannot request your own ride");
        }
        if (requestRepository.findByRideRideIdAndPassengerUserId(rideId, passengerId).isPresent()) {
            throw new IllegalArgumentException("Already requested this ride");
        }
        if (ride.isFull() || ride.getAvailableSeats() < request.getSeatsRequested()) {
            throw new IllegalArgumentException("Not enough available seats");
        }

        request.setPassenger(passenger);
        request.setRide(ride);
        request.setStatus("PENDING");

        RideRequest savedRequest = requestRepository.save(request);

        // Notify Driver
        notificationService.createNotificationWithEntity(
                ride.getDriver().getUserId(),
                com.nustconnect.backend.Enums.NotificationType.RIDE_REQUEST,
                "New ride request from " + passenger.getName(),
                savedRequest.getRequestId(),
                "/ride-sharing");

        return savedRequest;
    }

    public RideRequest getRequestById(Long requestId) {
        return requestRepository.findById(requestId)
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));
    }

    public List<RideRequest> getAllRequests() {
        return requestRepository.findAll();
    }

    public List<RideRequest> getRequestsByRide(Long rideId) {
        return requestRepository.findByRideRideId(rideId);
    }

    public List<RideRequest> getRequestsByPassenger(Long passengerId) {
        return requestRepository.findByPassengerUserId(passengerId);
    }

    public List<RideRequest> getRequestsByStatus(Long rideId, String status) {
        return requestRepository.findByRideRideIdAndStatus(rideId, status);
    }

    public Long getAcceptedRequestCount(Long rideId) {
        return requestRepository.countByRideRideIdAndStatus(rideId, "ACCEPTED");
    }

    // ==================== REQUEST STATUS ====================
    public RideRequest acceptRequest(Long requestId) {
        RideRequest request = getRequestById(requestId);
        RideShare ride = request.getRide();

        if (ride.isFull() || ride.getAvailableSeats() < request.getSeatsRequested()) {
            throw new IllegalArgumentException("Not enough available seats");
        }

        request.accept();
        requestRepository.save(request);

        for (int i = 0; i < request.getSeatsRequested(); i++) {
            decrementSeats(ride.getRideId());
        }

        // Notify Passenger
        notificationService.createNotificationWithEntity(
                request.getPassenger().getUserId(),
                com.nustconnect.backend.Enums.NotificationType.RIDE_UPDATE,
                "Your ride request to " + ride.getDestination() + " was accepted!",
                ride.getRideId(),
                "/ride-sharing");

        return request;
    }

    public RideRequest rejectRequest(Long requestId) {
        RideRequest request = getRequestById(requestId);
        request.reject();
        RideRequest savedRequest = requestRepository.save(request);

        // Notify Passenger
        notificationService.createNotificationWithEntity(
                request.getPassenger().getUserId(),
                com.nustconnect.backend.Enums.NotificationType.RIDE_UPDATE,
                "Your ride request to " + request.getRide().getDestination() + " was rejected.",
                request.getRide().getRideId(),
                "/ride-sharing");

        return savedRequest;
    }

    public void deleteRequest(Long requestId) {
        if (!requestRepository.existsById(requestId)) {
            throw new IllegalArgumentException("Request not found");
        }
        requestRepository.deleteById(requestId);
    }

    // ==================== VALIDATION ====================
    public boolean isRideDriver(Long rideId, Long userId) {
        RideShare ride = getRideById(rideId);
        return ride.getDriver().getUserId().equals(userId);
    }

    public boolean isRequestPassenger(Long requestId, Long userId) {
        RideRequest request = getRequestById(requestId);
        return request.getPassenger().getUserId().equals(userId);
    }

    public boolean isRideFull(Long rideId) {
        RideShare ride = getRideById(rideId);
        return ride.isFull();
    }

    public boolean hasUserRequestedRide(Long rideId, Long userId) {
        return requestRepository.findByRideRideIdAndPassengerUserId(rideId, userId).isPresent();
    }

    // ==================== STATISTICS ====================
    public long getTotalRideCount() {
        return rideRepository.count();
    }

    public long getTotalRequestCount() {
        return requestRepository.count();
    }

    public long getUserRideCount(Long driverId) {
        return rideRepository.findByDriverUserId(driverId).size();
    }

    public long getUserRequestCount(Long passengerId) {
        return requestRepository.findByPassengerUserId(passengerId).size();
    }

    // ==================== HELPER METHODS ====================
    public List<User> getRidePassengers(Long rideId) {
        return requestRepository.findByRideRideIdAndStatus(rideId, "ACCEPTED").stream()
                .map(RideRequest::getPassenger)
                .toList();
    }

    public List<RideRequest> getPendingRequests(Long rideId) {
        return requestRepository.findByRideRideIdAndStatus(rideId, "PENDING");
    }

    public List<RideRequest> getAcceptedRequests(Long rideId) {
        return requestRepository.findByRideRideIdAndStatus(rideId, "ACCEPTED");
    }
}