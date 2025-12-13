package com.nustconnect.backend.DTOs.Feedback;

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
public class FeedbackResponseDTO {
    private Long feedbackId;
    private UserSummaryDTO submittedBy;
    private String subject;
    private String message;
    private String feedbackType;
    private String category;
    private String status;
    private String priority;
    private UserSummaryDTO assignedTo;
    private String adminResponse;
    private LocalDateTime resolvedAt;
    private LocalDateTime createdAt;
}