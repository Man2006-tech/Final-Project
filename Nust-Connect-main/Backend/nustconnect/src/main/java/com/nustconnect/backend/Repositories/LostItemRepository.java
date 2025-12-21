package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Models.LostItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LostItemRepository extends JpaRepository<LostItem, Long> {
    List<LostItem> findByReportedByUserId(Long userId);
    List<LostItem> findByLocationLostContaining(String location);

    @Query("SELECT l FROM LostItem l WHERE l.deletedAt IS NULL ORDER BY l.dateLost DESC")
    List<LostItem> findAllActiveLostItems();

    @Query("SELECT l FROM LostItem l WHERE (l.itemName LIKE %:keyword% OR l.description LIKE %:keyword%) AND l.deletedAt IS NULL")
    List<LostItem> searchLostItems(@Param("keyword") String keyword);
}
