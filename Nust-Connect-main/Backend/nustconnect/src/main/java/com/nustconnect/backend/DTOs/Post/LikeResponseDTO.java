package com.nustconnect.backend.DTOs.Post;

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
public class LikeResponseDTO {
    private Long likeId;
    private Long postId;
    private UserSummaryDTO user;
    private LocalDateTime createdAt;
}