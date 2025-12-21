package com.nustconnect.backend.DTOs.Marketplace;

import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
import com.nustconnect.backend.Enums.MarketplaceCondition;
import com.nustconnect.backend.Enums.MarketplaceItemStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarketplaceItemResponseDTO {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private MarketplaceCondition conditionStatus;
    private MarketplaceItemStatus status;
    private UserSummaryDTO seller;
    private String categoryName;
    private List<String> imageUrls;
    private String location;
    private Integer viewCount;
    private Boolean isNegotiable;
    private LocalDateTime postedAt;
}