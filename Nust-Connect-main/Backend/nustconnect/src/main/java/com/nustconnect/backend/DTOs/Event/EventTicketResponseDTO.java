package com.nustconnect.backend.DTOs.Event;

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
public class EventTicketResponseDTO {
    private Long ticketId;
    private EventSummaryDTO event;
    private UserSummaryDTO user;
    private String qrCode;
    private String ticketNumber;
    private Boolean isCheckedIn;
    private LocalDateTime checkedInAt;
    private LocalDateTime createdAt;
}