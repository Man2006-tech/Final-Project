package com.nustconnect.backend.DTOs.Post;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateCommentRequestDTO {
    @NotBlank(message = "Comment cannot be empty")
    @Size(max = 1000, message = "Comment too long")
    private String content;

    private Long parentCommentId;
}