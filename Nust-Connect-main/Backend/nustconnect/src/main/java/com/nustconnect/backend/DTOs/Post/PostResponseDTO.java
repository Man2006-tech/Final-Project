package com.nustconnect.backend.DTOs.Post;

import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
import com.nustconnect.backend.Enums.PostVisibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponseDTO {
    private Long postId;
    private String contentText;
    private String mediaUrl;
    private PostVisibility visibility;
    private Integer likeCount;
    private Integer commentCount;
    private Boolean isEdited;
    private UserSummaryDTO author;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}