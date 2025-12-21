package com.nustconnect.backend.DTOs.Feedback;

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
public class CreateFeedbackRequestDTO {
    @NotBlank
    @Size(max = 200)
    private String subject;

    @NotBlank
    private String message;

    private String feedbackType;
    private String category;
}