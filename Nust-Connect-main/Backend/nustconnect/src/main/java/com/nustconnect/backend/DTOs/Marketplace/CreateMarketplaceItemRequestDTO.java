package com.nustconnect.backend.DTOs.Marketplace;

import com.nustconnect.backend.Enums.MarketplaceCondition;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateMarketplaceItemRequestDTO {
    @NotBlank
    @Size(min = 3, max = 200)
    private String title;

    @NotBlank
    @Size(max = 2000)
    private String description;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private Double price;

    @NotNull
    private MarketplaceCondition conditionStatus;

    private Long categoryId;
    private List<String> imageUrls;
    private String location;
    private Boolean isNegotiable;
}