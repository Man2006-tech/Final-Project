package com.nustconnect.backend.DTOs.Post;

import com.nustconnect.backend.Enums.PostVisibility;
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
public class CreatePostRequestDTO {
    @NotBlank(message = "Post content cannot be empty")
    @Size(max = 5000, message = "Post content too long")
    private String contentText;

    private String mediaUrl;
    private PostVisibility visibility;
}