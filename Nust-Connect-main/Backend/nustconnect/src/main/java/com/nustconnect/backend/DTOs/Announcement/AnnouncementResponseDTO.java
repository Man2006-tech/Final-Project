package com.nustconnect.backend.DTOs.Announcement;

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
public class AnnouncementResponseDTO {
    private Long announcementId;
    private String title;
    private String content;
    private UserSummaryDTO postedBy;
    private String priority;
    private String category;
    private String department;
    private LocalDateTime expiryDate;
    private Boolean isPinned;
    private Integer viewCount;
    private String attachmentUrl;
    private LocalDateTime createdAt;
}