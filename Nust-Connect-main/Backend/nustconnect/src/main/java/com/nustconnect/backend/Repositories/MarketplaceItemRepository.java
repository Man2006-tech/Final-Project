package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Enums.MarketplaceCondition;
import com.nustconnect.backend.Models.MarketplaceItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MarketplaceItemRepository extends JpaRepository<MarketplaceItem, Long> {
    List<MarketplaceItem> findBySellerUserId(Long sellerId);
    List<MarketplaceItem> findByCategoryId(Long categoryId);

    Page<MarketplaceItem> findByConditionStatusOrderByCreatedAtDesc(MarketplaceCondition condition, Pageable pageable);

    @Query("SELECT m FROM MarketplaceItem m WHERE m.deletedAt IS NULL ORDER BY m.createdAt DESC")
    Page<MarketplaceItem> findAllActiveItems(Pageable pageable);

    @Query("SELECT m FROM MarketplaceItem m WHERE (m.title LIKE %:keyword% OR m.description LIKE %:keyword%) AND m.deletedAt IS NULL")
    List<MarketplaceItem> searchItems(@Param("keyword") String keyword);

    @Query("SELECT m FROM MarketplaceItem m WHERE m.price BETWEEN :minPrice AND :maxPrice AND m.deletedAt IS NULL")
    List<MarketplaceItem> findByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);

    @Query("SELECT m FROM MarketplaceItem m WHERE m.conditionStatus = :condition AND m.deletedAt IS NULL ORDER BY m.createdAt DESC")
    Page<MarketplaceItem> findByConditionStatus(@Param("condition") MarketplaceCondition condition, Pageable pageable);
}