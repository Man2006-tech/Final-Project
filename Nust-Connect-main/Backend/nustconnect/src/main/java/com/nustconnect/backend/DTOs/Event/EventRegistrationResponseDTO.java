package com.nustconnect.backend.DTOs.Event;

import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
import com.nustconnect.backend.Enums.EventRegistrationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventRegistrationResponseDTO {
    private Long registrationId;
    private EventSummaryDTO event;
    private UserSummaryDTO user;
    private EventRegistrationStatus status;
    private Boolean attended;
    private LocalDateTime registrationDate;
}