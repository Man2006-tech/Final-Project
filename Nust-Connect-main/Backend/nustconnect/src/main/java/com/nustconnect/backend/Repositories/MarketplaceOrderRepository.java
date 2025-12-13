package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Enums.MarketplaceOrderStatus;
import com.nustconnect.backend.Models.MarketplaceOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketplaceOrderRepository extends JpaRepository<MarketplaceOrder, Long> {
    List<MarketplaceOrder> findByBuyerUserId(Long buyerId);
    List<MarketplaceOrder> findByItemId(Long itemId);
    List<MarketplaceOrder> findByStatus(MarketplaceOrderStatus status);
    Page<MarketplaceOrder> findByBuyerUserIdOrderByCreatedAtDesc(Long buyerId, Pageable pageable);
}
