package com.nustconnect.backend.DTOs.Post;

import com.nustconnect.backend.Enums.PostVisibility;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequestDTO {
    private String contentText;

    private String mediaUrl;
    private PostVisibility visibility;
}