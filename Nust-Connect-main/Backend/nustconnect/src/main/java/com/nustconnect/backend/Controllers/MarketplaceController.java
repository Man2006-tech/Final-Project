package com.nustconnect.backend.Controllers;

import com.nustconnect.backend.DTOs.Marketplace.*;
import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
import com.nustconnect.backend.Models.*;
import com.nustconnect.backend.Services.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import com.nustconnect.backend.Repositories.MarketplaceCategoryRepository;

@RestController
@RequestMapping("/api/marketplace")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MarketplaceController {

    private final MarketplaceService marketplaceService;
    private final ProfileService profileService;
    private final MarketplaceCategoryRepository categoryRepository;

    // ==================== ITEMS ====================
    @PostMapping("/items")
    public ResponseEntity<MarketplaceItemResponseDTO> createItem(
            @RequestParam Long sellerId,
            @Valid @RequestBody CreateMarketplaceItemRequestDTO request) {
        MarketplaceItem item = MarketplaceItem.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .conditionStatus(request.getConditionStatus())
                .imageUrls(request.getImageUrls())
                .location(request.getLocation())
                .isNegotiable(request.getIsNegotiable())
                .build();

        if (request.getCategoryId() != null) {
            MarketplaceCategory category = categoryRepository.findById(request.getCategoryId()).orElse(null);
            item.setCategory(category);
        }

        MarketplaceItem createdItem = marketplaceService.createItem(sellerId, item);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToItemResponseDTO(createdItem));
    }

    @GetMapping("/items/{itemId}")
    public ResponseEntity<MarketplaceItemResponseDTO> getItemById(@PathVariable Long itemId) {
        MarketplaceItem item = marketplaceService.getItemById(itemId);
        marketplaceService.incrementViewCount(itemId);
        return ResponseEntity.ok(mapToItemResponseDTO(item));
    }

    @GetMapping("/items")
    public ResponseEntity<Page<MarketplaceItemResponseDTO>> getAllItems(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<MarketplaceItem> items = marketplaceService.getAllActiveItems(PageRequest.of(page, size));
        return ResponseEntity.ok(items.map(this::mapToItemResponseDTO));
    }

    @GetMapping("/items/search")
    public ResponseEntity<List<MarketplaceItemResponseDTO>> searchItems(@RequestParam String keyword) {
        List<MarketplaceItem> items = marketplaceService.searchItems(keyword);
        return ResponseEntity.ok(items.stream().map(this::mapToItemResponseDTO).collect(Collectors.toList()));
    }

    @GetMapping("/items/seller/{sellerId}")
    public ResponseEntity<List<MarketplaceItemResponseDTO>> getSellerItems(@PathVariable Long sellerId) {
        List<MarketplaceItem> items = marketplaceService.getItemsBySeller(sellerId);
        return ResponseEntity.ok(items.stream().map(this::mapToItemResponseDTO).collect(Collectors.toList()));
    }

    @PatchMapping("/items/{itemId}/mark-sold")
    public ResponseEntity<MarketplaceItemResponseDTO> markAsSold(@PathVariable Long itemId) {
        MarketplaceItem item = marketplaceService.markAsSold(itemId);
        return ResponseEntity.ok(mapToItemResponseDTO(item));
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<String> deleteItem(@PathVariable Long itemId) {
        marketplaceService.deleteItem(itemId);
        return ResponseEntity.ok("Item deleted successfully");
    }

    @GetMapping("/categories")
    public ResponseEntity<List<MarketplaceCategory>> getCategories() {
        return ResponseEntity.ok(categoryRepository.findAll());
    }

    // ==================== ORDERS ====================
    @PostMapping("/items/{itemId}/order")
    public ResponseEntity<MarketplaceOrderResponseDTO> createOrder(
            @PathVariable Long itemId,
            @RequestParam Long buyerId,
            @Valid @RequestBody CreateMarketplaceOrderRequestDTO request) {
        MarketplaceOrder order = MarketplaceOrder.builder()
                .deliveryAddress(request.getDeliveryAddress())
                .contactNumber(request.getContactNumber())
                .notes(request.getNotes())
                .build();

        MarketplaceOrder createdOrder = marketplaceService.createOrder(buyerId, itemId, order);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToOrderResponseDTO(createdOrder));
    }

    @GetMapping("/orders/{orderId}")
    public ResponseEntity<MarketplaceOrderResponseDTO> getOrderById(@PathVariable Long orderId) {
        MarketplaceOrder order = marketplaceService.getOrderById(orderId);
        return ResponseEntity.ok(mapToOrderResponseDTO(order));
    }

    @GetMapping("/orders/buyer/{buyerId}")
    public ResponseEntity<List<MarketplaceOrderResponseDTO>> getBuyerOrders(@PathVariable Long buyerId) {
        List<MarketplaceOrder> orders = marketplaceService.getOrdersByBuyer(buyerId);
        return ResponseEntity.ok(orders.stream().map(this::mapToOrderResponseDTO).collect(Collectors.toList()));
    }

    @PatchMapping("/orders/{orderId}/complete")
    public ResponseEntity<MarketplaceOrderResponseDTO> completeOrder(@PathVariable Long orderId) {
        MarketplaceOrder order = marketplaceService.completeOrder(orderId);
        return ResponseEntity.ok(mapToOrderResponseDTO(order));
    }

    @PatchMapping("/orders/{orderId}/cancel")
    public ResponseEntity<MarketplaceOrderResponseDTO> cancelOrder(@PathVariable Long orderId) {
        MarketplaceOrder order = marketplaceService.cancelOrder(orderId);
        return ResponseEntity.ok(mapToOrderResponseDTO(order));
    }

    // ==================== MAPPERS ====================
    private MarketplaceItemResponseDTO mapToItemResponseDTO(MarketplaceItem item) {
        return MarketplaceItemResponseDTO.builder()
                .id(item.getId())
                .title(item.getTitle())
                .description(item.getDescription())
                .price(item.getPrice())
                .conditionStatus(item.getConditionStatus())
                .status(item.getStatus())
                .seller(mapToUserSummaryDTO(item.getSeller()))
                .categoryName(item.getCategory() != null ? item.getCategory().getName() : null)
                .imageUrls(item.getImageUrls())
                .location(item.getLocation())
                .viewCount(item.getViewCount())
                .isNegotiable(item.getIsNegotiable())
                .postedAt(item.getCreatedAt()) // Using createdAt from BaseEntity
                .build();
    }

    private MarketplaceOrderResponseDTO mapToOrderResponseDTO(MarketplaceOrder order) {
        return MarketplaceOrderResponseDTO.builder()
                .id(order.getId())
                .item(mapToItemResponseDTO(order.getItem()))
                .buyer(mapToUserSummaryDTO(order.getBuyer()))
                .status(order.getStatus())
                .orderPrice(order.getOrderPrice())
                .deliveryAddress(order.getDeliveryAddress())
                .contactNumber(order.getContactNumber())
                .notes(order.getNotes())
                .createdAt(order.getCreatedAt())
                .build();
    }

    private UserSummaryDTO mapToUserSummaryDTO(User user) {
        String profilePicture = null;
        try {
            Profile profile = profileService.getProfileByUserId(user.getUserId());
            profilePicture = profile.getProfilePicture();
        } catch (Exception e) {
        }
        return UserSummaryDTO.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .profilePicture(profilePicture)
                .department(user.getDepartment())
                .build();
    }
}