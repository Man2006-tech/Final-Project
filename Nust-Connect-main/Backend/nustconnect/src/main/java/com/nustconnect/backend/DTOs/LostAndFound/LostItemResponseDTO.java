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
public class LostItemResponseDTO {
    private Long id;
    private String itemName;
    private String description;
    private String locationLost;
    private LocalDateTime dateLost;
    private UserSummaryDTO reportedBy;
    private String contactInfo;
    private String imageUrl;
    private Boolean isFound;
    private String status;
    private LocalDateTime createdAt;
}