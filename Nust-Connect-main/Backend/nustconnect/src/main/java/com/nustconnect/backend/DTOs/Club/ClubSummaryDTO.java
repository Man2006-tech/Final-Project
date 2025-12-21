package com.nustconnect.backend.DTOs.Club;

import com.nustconnect.backend.Enums.ClubCategory;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClubSummaryDTO {
    private Long clubId;
    private String name;
    private String logoUrl;
    private ClubCategory category;
    private Integer memberCount;
}