package com.nustconnect.backend.DTOs.Event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventSummaryDTO {
    private Long eventId;
    private String title;
    private String eventImageUrl;
    private LocalDateTime startTime;
    private String clubName;
    private Integer currentAttendees;
    private Integer maxAttendees;
}