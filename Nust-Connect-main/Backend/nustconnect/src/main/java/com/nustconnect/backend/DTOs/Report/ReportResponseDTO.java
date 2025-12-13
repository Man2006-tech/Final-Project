package com.nustconnect.backend.DTOs.Report;

import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
import com.nustconnect.backend.Enums.ReportTargetType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReportResponseDTO {
    private Long id;
    private String reason;
    private ReportTargetType targetType;
    private Long targetId;
    private UserSummaryDTO reportedBy;
    private String status;
    private String adminNotes;
    private UserSummaryDTO reviewedBy;
    private LocalDateTime createdAt;
}