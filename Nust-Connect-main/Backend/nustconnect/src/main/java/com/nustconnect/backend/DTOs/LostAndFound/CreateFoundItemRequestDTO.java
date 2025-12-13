package com.nustconnect.backend.DTOs.LostAndFound;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
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
public class CreateFoundItemRequestDTO {
    @NotBlank
    @Size(min = 2, max = 150)
    private String itemName;

    @NotBlank
    @Size(max = 1000)
    private String description;

    @NotBlank
    @Size(max = 200)
    private String locationFound;

    @PastOrPresent
    private LocalDateTime dateFound;

    @Size(max = 20)
    private String contactInfo;

    private String imageUrl;
}