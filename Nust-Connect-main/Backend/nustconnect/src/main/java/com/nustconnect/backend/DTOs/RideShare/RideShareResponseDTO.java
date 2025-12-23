package com.nustconnect.backend.DTOs.RideShare;

import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RideShareResponseDTO {
    private Long rideId;
    private UserSummaryDTO driver;
    private String pickupLocation;
    private String destination;
    private LocalDateTime departureTime;
    private Integer availableSeats;
    private Double pricePerSeat;
    private String notes;
    private String status;
    private String contactNumber;
    private LocalDateTime createdAt;
    private Boolean hasUserRequested; // Whether the current user has already requested this ride
}