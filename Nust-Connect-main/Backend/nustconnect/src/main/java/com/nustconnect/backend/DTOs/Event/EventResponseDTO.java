package com.nustconnect.backend.DTOs.Event;

import com.nustconnect.backend.DTOs.Club.ClubSummaryDTO;
import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
import com.nustconnect.backend.Enums.EventApprovalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventResponseDTO {
    private Long eventId;
    private String title;
    private String description;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer maxAttendees;
    private Integer currentAttendees;
    private Boolean isPublic;
    private String eventImageUrl;
    private EventApprovalStatus approvalStatus;
    private String rejectionReason;
    private Double ticketPrice;
    private Boolean hasTickets;
    private Boolean requiresRegistration;
    private ClubSummaryDTO club;
    private UserSummaryDTO createdBy;
    private String venueName;
    private LocalDateTime createdAt;
}