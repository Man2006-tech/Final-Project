package com.nustconnect.backend.DTOs.Club;

import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
import com.nustconnect.backend.Enums.ClubCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClubResponseDTO {
    private Long clubId;
    private String name;
    private String description;
    private ClubCategory category;
    private String logoUrl;
    private String coverImageUrl;
    private Integer memberCount;
    private Boolean isActive;
    private Boolean isApproved;
    private Boolean isRecruitmentOpen;
    private String contactEmail;
    private UserSummaryDTO createdBy;
    private LocalDateTime createdAt;
}