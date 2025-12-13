package com.nustconnect.backend.DTOs.RideShare;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateRideShareRequestDTO {
    @NotBlank
    @Size(max = 200)
    private String pickupLocation;

    @NotBlank
    @Size(max = 200)
    private String destination;

    @NotNull
    @Future
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime departureTime;

    @NotNull
    @Min(1)
    @Max(8)
    private Integer availableSeats;

    private Double pricePerSeat;

    @Size(max = 500)
    private String notes;

    @Size(max = 20)
    private String contactNumber;
}