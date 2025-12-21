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
public class CommentResponseDTO {
    private Long commentId;
    private Long postId;
    private String content;
    private Boolean isEdited;
    private Long parentCommentId;
    private UserSummaryDTO author;
    private LocalDateTime createdAt;
}