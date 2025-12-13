package com.nustconnect.backend.DTOs.LostAndFound;

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
public class FoundItemResponseDTO {
    private Long id;
    private String itemName;
    private String description;
    private String locationFound;
    private LocalDateTime dateFound;
    private UserSummaryDTO foundBy;
    private String contactInfo;
    private String imageUrl;
    private Boolean isClaimed;
    private UserSummaryDTO claimedBy;
    private String status;
    private LocalDateTime createdAt;
}