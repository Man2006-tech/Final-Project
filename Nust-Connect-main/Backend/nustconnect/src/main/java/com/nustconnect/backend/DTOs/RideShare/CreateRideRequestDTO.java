package com.nustconnect.backend.DTOs.RideShare;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRideRequestDTO {
    @Min(1)
    @Max(8)
    private Integer seatsRequested;

    @Size(max = 300)
    private String message;
}