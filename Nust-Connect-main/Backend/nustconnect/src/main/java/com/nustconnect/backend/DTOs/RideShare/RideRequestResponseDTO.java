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
public class RideRequestResponseDTO {
    private Long requestId;
    private RideShareResponseDTO ride;
    private UserSummaryDTO passenger;
    private Integer seatsRequested;
    private String status;
    private String message;
    private LocalDateTime createdAt;
}