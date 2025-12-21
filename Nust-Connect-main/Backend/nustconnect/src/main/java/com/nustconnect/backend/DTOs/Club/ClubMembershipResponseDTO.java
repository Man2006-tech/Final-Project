package com.nustconnect.backend.DTOs.Club;

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
public class ClubMembershipResponseDTO {
    private Long membershipId;
    private ClubSummaryDTO club;
    private UserSummaryDTO user;
    private String memberRole;
    private String status;
    private LocalDateTime joinedAt;
}