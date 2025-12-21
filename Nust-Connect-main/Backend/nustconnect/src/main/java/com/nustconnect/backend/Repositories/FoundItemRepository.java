package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Models.FoundItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FoundItemRepository extends JpaRepository<FoundItem, Long> {
    List<FoundItem> findByFoundByUserId(Long userId);
    List<FoundItem> findByLocationFoundContaining(String location);

    @Query("SELECT f FROM FoundItem f WHERE f.deletedAt IS NULL ORDER BY f.dateFound DESC")
    List<FoundItem> findAllActiveFoundItems();

    @Query("SELECT f FROM FoundItem f WHERE (f.itemName LIKE %:keyword% OR f.description LIKE %:keyword%) AND f.deletedAt IS NULL")
    List<FoundItem> searchFoundItems(@Param("keyword") String keyword);
}
