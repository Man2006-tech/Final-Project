package com.nustconnect.backend.DTOs.Marketplace;

import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
import com.nustconnect.backend.Enums.MarketplaceOrderStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MarketplaceOrderResponseDTO {
    private Long id;
    private MarketplaceItemResponseDTO item;
    private UserSummaryDTO buyer;
    private MarketplaceOrderStatus status;
    private Double orderPrice;
    private String deliveryAddress;
    private String contactNumber;
    private String notes;
    private LocalDateTime createdAt;
}