package com.nustconnect.backend.Services;

import com.nustconnect.backend.Enums.MarketplaceCondition;
import com.nustconnect.backend.Enums.MarketplaceItemStatus;
import com.nustconnect.backend.Enums.MarketplaceOrderStatus;
import com.nustconnect.backend.Models.MarketplaceCategory;
import com.nustconnect.backend.Models.MarketplaceItem;
import com.nustconnect.backend.Models.MarketplaceOrder;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.MarketplaceCategoryRepository;
import com.nustconnect.backend.Repositories.MarketplaceItemRepository;
import com.nustconnect.backend.Repositories.MarketplaceOrderRepository;
import com.nustconnect.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MarketplaceService {

    private final MarketplaceItemRepository itemRepository;
    private final MarketplaceOrderRepository orderRepository;
    private final MarketplaceCategoryRepository categoryRepository;
    private final UserRepository userRepository;

    // ==================== ITEM CRUD ====================
    public MarketplaceItem createItem(Long sellerId, MarketplaceItem item) {
        User seller = userRepository.findById(sellerId)
                .orElseThrow(() -> new IllegalArgumentException("Seller not found"));

        item.setSeller(seller);
        item.setStatus(MarketplaceItemStatus.AVAILABLE);
        item.setViewCount(0);

        if (item.getCategory() != null && item.getCategory().getId() != null) {
            MarketplaceCategory category = categoryRepository.findById(item.getCategory().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found"));
            item.setCategory(category);
        }

        return itemRepository.save(item);
    }

    public MarketplaceItem getItemById(Long itemId) {
        return itemRepository.findById(itemId)
                .orElseThrow(() -> new IllegalArgumentException("Item not found"));
    }

    public List<MarketplaceItem> getAllItems() {
        return itemRepository.findAll();
    }

    public Page<MarketplaceItem> getAllActiveItems(Pageable pageable) {
        return itemRepository.findAllActiveItems(pageable);
    }

    public List<MarketplaceItem> getItemsBySeller(Long sellerId) {
        return itemRepository.findBySellerUserId(sellerId);
    }

    public List<MarketplaceItem> getItemsByCategory(Long categoryId) {
        return itemRepository.findByCategoryId(categoryId);
    }

    public List<MarketplaceItem> searchItems(String keyword) {
        return itemRepository.searchItems(keyword);
    }

    public List<MarketplaceItem> getItemsByPriceRange(Double minPrice, Double maxPrice) {
        return itemRepository.findByPriceRange(minPrice, maxPrice);
    }

    public Page<MarketplaceItem> getItemsByCondition(MarketplaceCondition condition, Pageable pageable) {
        return itemRepository.findByConditionStatus(condition, pageable);
    }

    public MarketplaceItem updateItem(Long itemId, MarketplaceItem updatedItem) {
        MarketplaceItem existingItem = getItemById(itemId);

        if (updatedItem.getTitle() != null) {
            existingItem.setTitle(updatedItem.getTitle());
        }
        if (updatedItem.getDescription() != null) {
            existingItem.setDescription(updatedItem.getDescription());
        }
        if (updatedItem.getPrice() != null) {
            existingItem.setPrice(updatedItem.getPrice());
        }
        if (updatedItem.getConditionStatus() != null) {
            existingItem.setConditionStatus(updatedItem.getConditionStatus());
        }
        if (updatedItem.getLocation() != null) {
            existingItem.setLocation(updatedItem.getLocation());
        }
        if (updatedItem.getIsNegotiable() != null) {
            existingItem.setIsNegotiable(updatedItem.getIsNegotiable());
        }

        return itemRepository.save(existingItem);
    }

    public void deleteItem(Long itemId) {
        MarketplaceItem item = getItemById(itemId);
        item.softDelete();
        itemRepository.save(item);
    }

    public void hardDeleteItem(Long itemId) {
        if (!itemRepository.existsById(itemId)) {
            throw new IllegalArgumentException("Item not found");
        }
        itemRepository.deleteById(itemId);
    }

    // ==================== ITEM STATUS ====================
    public MarketplaceItem markAsSold(Long itemId) {
        MarketplaceItem item = getItemById(itemId);
        item.markAsSold();
        return itemRepository.save(item);
    }

    public MarketplaceItem markAsReserved(Long itemId) {
        MarketplaceItem item = getItemById(itemId);
        item.markAsReserved();
        return itemRepository.save(item);
    }

    public MarketplaceItem markAsAvailable(Long itemId) {
        MarketplaceItem item = getItemById(itemId);
        item.markAsAvailable();
        return itemRepository.save(item);
    }

    public void incrementViewCount(Long itemId) {
        MarketplaceItem item = getItemById(itemId);
        item.incrementViewCount();
        itemRepository.save(item);
    }

    // ==================== ORDER CRUD ====================
    public MarketplaceOrder createOrder(Long buyerId, Long itemId, MarketplaceOrder order) {
        User buyer = userRepository.findById(buyerId)
                .orElseThrow(() -> new IllegalArgumentException("Buyer not found"));
        MarketplaceItem item = getItemById(itemId);

        // Validate item is available
        if (!item.isAvailable()) {
            throw new IllegalArgumentException("Item is not available for purchase");
        }

        // Validate buyer is not seller
        if (item.getSeller().getUserId().equals(buyerId)) {
            throw new IllegalArgumentException("Cannot buy your own item");
        }

        order.setItem(item);
        order.setBuyer(buyer);
        order.setStatus(MarketplaceOrderStatus.PENDING);
        order.setOrderPrice(item.getPrice());

        MarketplaceOrder savedOrder = orderRepository.save(order);

        // Mark item as reserved
        markAsReserved(itemId);

        return savedOrder;
    }

    public MarketplaceOrder getOrderById(Long orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
    }

    public List<MarketplaceOrder> getAllOrders() {
        return orderRepository.findAll();
    }

    public List<MarketplaceOrder> getOrdersByBuyer(Long buyerId) {
        return orderRepository.findByBuyerUserId(buyerId);
    }

    public Page<MarketplaceOrder> getOrdersByBuyerPaginated(Long buyerId, Pageable pageable) {
        return orderRepository.findByBuyerUserIdOrderByCreatedAtDesc(buyerId, pageable);
    }

    public List<MarketplaceOrder> getOrdersByItem(Long itemId) {
        return orderRepository.findByItemId(itemId);
    }

    public List<MarketplaceOrder> getOrdersByStatus(MarketplaceOrderStatus status) {
        return orderRepository.findByStatus(status);
    }

    // ==================== ORDER STATUS ====================
    public MarketplaceOrder completeOrder(Long orderId) {
        MarketplaceOrder order = getOrderById(orderId);
        order.complete();

        // Mark item as sold
        markAsSold(order.getItem().getId());

        return orderRepository.save(order);
    }

    public MarketplaceOrder cancelOrder(Long orderId) {
        MarketplaceOrder order = getOrderById(orderId);
        order.cancel();

        // Mark item as available again
        markAsAvailable(order.getItem().getId());

        return orderRepository.save(order);
    }

    public void deleteOrder(Long orderId) {
        if (!orderRepository.existsById(orderId)) {
            throw new IllegalArgumentException("Order not found");
        }
        orderRepository.deleteById(orderId);
    }

    // ==================== CATEGORY CRUD ====================
    public MarketplaceCategory createCategory(MarketplaceCategory category) {
        if (categoryRepository.findByName(category.getName()).isPresent()) {
            throw new IllegalArgumentException("Category name already exists");
        }
        return categoryRepository.save(category);
    }

    public MarketplaceCategory getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
    }

    public MarketplaceCategory getCategoryByName(String name) {
        return categoryRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
    }

    public List<MarketplaceCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<MarketplaceCategory> getActiveCategories() {
        return categoryRepository.findByIsActive(true);
    }

    public void deleteCategory(Long categoryId) {
        if (!categoryRepository.existsById(categoryId)) {
            throw new IllegalArgumentException("Category not found");
        }
        categoryRepository.deleteById(categoryId);
    }

    // ==================== VALIDATION ====================
    public boolean isItemOwner(Long itemId, Long userId) {
        MarketplaceItem item = getItemById(itemId);
        return item.getSeller().getUserId().equals(userId);
    }

    public boolean isOrderBuyer(Long orderId, Long userId) {
        MarketplaceOrder order = getOrderById(orderId);
        return order.getBuyer().getUserId().equals(userId);
    }

    public boolean isOrderSeller(Long orderId, Long userId) {
        MarketplaceOrder order = getOrderById(orderId);
        return order.getItem().getSeller().getUserId().equals(userId);
    }

    public boolean isItemAvailable(Long itemId) {
        MarketplaceItem item = getItemById(itemId);
        return item.isAvailable();
    }

    // ==================== STATISTICS ====================
    public long getTotalItemCount() {
        return itemRepository.count();
    }

    public long getTotalOrderCount() {
        return orderRepository.count();
    }

    public long getUserItemCount(Long sellerId) {
        return itemRepository.findBySellerUserId(sellerId).size();
    }

    public long getUserOrderCount(Long buyerId) {
        return orderRepository.findByBuyerUserId(buyerId).size();
    }

    // ==================== SELLER DASHBOARD ====================
    public List<MarketplaceItem> getSellerActiveItems(Long sellerId) {
        return itemRepository.findBySellerUserId(sellerId).stream()
                .filter(MarketplaceItem::isAvailable)
                .toList();
    }

    public List<MarketplaceOrder> getSellerOrders(Long sellerId) {
        return itemRepository.findBySellerUserId(sellerId).stream()
                .flatMap(item -> orderRepository.findByItemId(item.getId()).stream())
                .toList();
    }
}