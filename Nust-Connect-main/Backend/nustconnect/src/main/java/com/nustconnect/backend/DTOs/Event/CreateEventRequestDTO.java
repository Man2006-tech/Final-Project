package com.nustconnect.backend.DTOs.Event;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateEventRequestDTO {
    @NotNull
    private Long clubId;

    private Long venueId;

    @NotBlank
    @Size(min = 3, max = 200)
    private String title;

    @NotBlank
    @Size(max = 5000)
    private String description;

    @NotNull
    @Future
    private LocalDateTime startTime;

    @NotNull
    private LocalDateTime endTime;

    private Integer maxAttendees;
    private Boolean isPublic;
    private String eventImageUrl;
    private Double ticketPrice;
    private Boolean hasTickets;
    private Boolean requiresRegistration;
    private Boolean qrCodeRequired;
}