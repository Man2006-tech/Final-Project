package com.nustconnect.backend.DTOs.Event;

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
public class UpdateEventRequestDTO {
    @Size(min = 3, max = 200)
    private String title;

    @Size(max = 5000)
    private String description;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer maxAttendees;
    private Boolean isPublic;
    private String eventImageUrl;
    private Double ticketPrice;
}