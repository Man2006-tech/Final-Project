package com.nustconnect.backend.DTOs.Marketplace;

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
public class CreateMarketplaceOrderRequestDTO {
    @Size(max = 300)
    private String deliveryAddress;

    @Size(max = 20)
    private String contactNumber;

    @Size(max = 1000)
    private String notes;
}