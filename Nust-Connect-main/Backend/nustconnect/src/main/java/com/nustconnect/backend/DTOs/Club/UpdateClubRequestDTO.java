package com.nustconnect.backend.DTOs.Club;

import com.nustconnect.backend.Enums.ClubCategory;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateClubRequestDTO {
    @Size(min = 3, max = 150)
    private String name;

    @Size(max = 2000)
    private String description;

    private ClubCategory category;
    private String logoUrl;
    private String coverImageUrl;
    private String contactEmail;
}