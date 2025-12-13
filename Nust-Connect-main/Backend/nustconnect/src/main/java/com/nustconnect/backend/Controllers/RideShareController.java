package com.nustconnect.backend.Controllers;

import com.nustconnect.backend.DTOs.RideShare.*;
import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
import com.nustconnect.backend.Models.*;
import com.nustconnect.backend.Services.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class RideShareController {

    private final RideShareService rideShareService;
    private final ProfileService profileService;

    // ==================== RIDES ====================
    @PostMapping
    public ResponseEntity<RideShareResponseDTO> createRide(
            @RequestParam Long driverId,
            @Valid @RequestBody CreateRideShareRequestDTO request) {
        RideShare ride = RideShare.builder()
                .pickupLocation(request.getPickupLocation())
                .destination(request.getDestination())
                .departureTime(request.getDepartureTime())
                .availableSeats(request.getAvailableSeats())
                .pricePerSeat(request.getPricePerSeat())
                .notes(request.getNotes())
                .contactNumber(request.getContactNumber())
                .build();

        RideShare createdRide = rideShareService.createRide(driverId, ride);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToRideResponseDTO(createdRide));
    }

    @GetMapping("/{rideId}")
    public ResponseEntity<RideShareResponseDTO> getRideById(@PathVariable Long rideId) {
        RideShare ride = rideShareService.getRideById(rideId);
        return ResponseEntity.ok(mapToRideResponseDTO(ride));
    }

    @GetMapping
    public ResponseEntity<List<RideShareResponseDTO>> getAllRides() {
        List<RideShare> rides = rideShareService.getActiveRides();
        return ResponseEntity.ok(rides.stream().map(this::mapToRideResponseDTO).collect(Collectors.toList()));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<RideShareResponseDTO>> getUpcomingRides() {
        List<RideShare> rides = rideShareService.getUpcomingRides();
        return ResponseEntity.ok(rides.stream().map(this::mapToRideResponseDTO).collect(Collectors.toList()));
    }

    @GetMapping("/search")
    public ResponseEntity<List<RideShareResponseDTO>> searchRides(@RequestParam String keyword) {
        List<RideShare> rides = rideShareService.searchRides(keyword);
        return ResponseEntity.ok(rides.stream().map(this::mapToRideResponseDTO).collect(Collectors.toList()));
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<RideShareResponseDTO>> getDriverRides(@PathVariable Long driverId) {
        List<RideShare> rides = rideShareService.getRidesByDriver(driverId);
        return ResponseEntity.ok(rides.stream().map(this::mapToRideResponseDTO).collect(Collectors.toList()));
    }

    @PutMapping("/{rideId}")
    public ResponseEntity<RideShareResponseDTO> updateRide(
            @PathVariable Long rideId,
            @Valid @RequestBody CreateRideShareRequestDTO request) {
        RideShare updatedRide = RideShare.builder()
                .pickupLocation(request.getPickupLocation())
                .destination(request.getDestination())
                .departureTime(request.getDepartureTime())
                .availableSeats(request.getAvailableSeats())
                .pricePerSeat(request.getPricePerSeat())
                .notes(request.getNotes())
                .contactNumber(request.getContactNumber())
                .build();

        RideShare ride = rideShareService.updateRide(rideId, updatedRide);
        return ResponseEntity.ok(mapToRideResponseDTO(ride));
    }

    @PatchMapping("/{rideId}/complete")
    public ResponseEntity<RideShareResponseDTO> completeRide(@PathVariable Long rideId) {
        RideShare ride = rideShareService.completeRide(rideId);
        return ResponseEntity.ok(mapToRideResponseDTO(ride));
    }

    @PatchMapping("/{rideId}/cancel")
    public ResponseEntity<RideShareResponseDTO> cancelRide(@PathVariable Long rideId) {
        RideShare ride = rideShareService.cancelRide(rideId);
        return ResponseEntity.ok(mapToRideResponseDTO(ride));
    }

    @DeleteMapping("/{rideId}")
    public ResponseEntity<String> deleteRide(@PathVariable Long rideId) {
        rideShareService.deleteRide(rideId);
        return ResponseEntity.ok("Ride deleted successfully");
    }

    // ==================== RIDE REQUESTS ====================
    @PostMapping("/{rideId}/request")
    public ResponseEntity<RideRequestResponseDTO> createRequest(
            @PathVariable Long rideId,
            @RequestParam Long passengerId,
            @Valid @RequestBody CreateRideRequestDTO request) {
        RideRequest rideRequest = RideRequest.builder()
                .seatsRequested(request.getSeatsRequested())
                .message(request.getMessage())
                .build();

        RideRequest createdRequest = rideShareService.createRequest(passengerId, rideId, rideRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToRequestResponseDTO(createdRequest));
    }

    @GetMapping("/{rideId}/requests")
    public ResponseEntity<List<RideRequestResponseDTO>> getRideRequests(@PathVariable Long rideId) {
        List<RideRequest> requests = rideShareService.getRequestsByRide(rideId);
        return ResponseEntity.ok(requests.stream().map(this::mapToRequestResponseDTO).collect(Collectors.toList()));
    }

    @GetMapping("/requests/passenger/{passengerId}")
    public ResponseEntity<List<RideRequestResponseDTO>> getPassengerRequests(@PathVariable Long passengerId) {
        List<RideRequest> requests = rideShareService.getRequestsByPassenger(passengerId);
        return ResponseEntity.ok(requests.stream().map(this::mapToRequestResponseDTO).collect(Collectors.toList()));
    }

    @PatchMapping("/requests/{requestId}/accept")
    public ResponseEntity<RideRequestResponseDTO> acceptRequest(@PathVariable Long requestId) {
        RideRequest request = rideShareService.acceptRequest(requestId);
        return ResponseEntity.ok(mapToRequestResponseDTO(request));
    }

    @PatchMapping("/requests/{requestId}/reject")
    public ResponseEntity<RideRequestResponseDTO> rejectRequest(@PathVariable Long requestId) {
        RideRequest request = rideShareService.rejectRequest(requestId);
        return ResponseEntity.ok(mapToRequestResponseDTO(request));
    }

    @DeleteMapping("/requests/{requestId}")
    public ResponseEntity<String> deleteRequest(@PathVariable Long requestId) {
        rideShareService.deleteRequest(requestId);
        return ResponseEntity.ok("Request deleted successfully");
    }

    // ==================== MAPPERS ====================
    private RideShareResponseDTO mapToRideResponseDTO(RideShare ride) {
        return RideShareResponseDTO.builder()
                .rideId(ride.getRideId())
                .driver(mapToUserSummaryDTO(ride.getDriver()))
                .pickupLocation(ride.getPickupLocation())
                .destination(ride.getDestination())
                .departureTime(ride.getDepartureTime())
                .availableSeats(ride.getAvailableSeats())
                .pricePerSeat(ride.getPricePerSeat())
                .notes(ride.getNotes())
                .status(ride.getStatus())
                .contactNumber(ride.getContactNumber())
                .createdAt(ride.getCreatedAt())
                .build();
    }

    private RideRequestResponseDTO mapToRequestResponseDTO(RideRequest request) {
        return RideRequestResponseDTO.builder()
                .requestId(request.getRequestId())
                .ride(mapToRideResponseDTO(request.getRide()))
                .passenger(mapToUserSummaryDTO(request.getPassenger()))
                .seatsRequested(request.getSeatsRequested())
                .status(request.getStatus())
                .message(request.getMessage())
                .createdAt(request.getCreatedAt())
                .build();
    }

    private UserSummaryDTO mapToUserSummaryDTO(User user) {
        String profilePicture = null;
        try {
            Profile profile = profileService.getProfileByUserId(user.getUserId());
            profilePicture = profile.getProfilePicture();
        } catch (Exception e) {
            // Profile doesn't exist, use null
        }

        return UserSummaryDTO.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .profilePicture(profilePicture)
                .department(user.getDepartment())
                .build();
    }
}