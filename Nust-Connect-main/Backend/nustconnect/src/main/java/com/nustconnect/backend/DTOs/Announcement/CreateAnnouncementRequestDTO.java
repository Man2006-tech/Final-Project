package com.nustconnect.backend.DTOs.Announcement;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateAnnouncementRequestDTO {
    @NotBlank
    @Size(max = 300)
    private String title;

    @NotBlank
    private String content;

    private String priority;
    private String category;

    @Size(max = 100)
    private String department;

    private LocalDateTime expiryDate;
    private String attachmentUrl;
}