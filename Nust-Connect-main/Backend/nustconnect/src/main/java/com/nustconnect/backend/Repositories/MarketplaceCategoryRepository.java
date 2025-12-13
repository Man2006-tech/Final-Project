package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Models.MarketplaceCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarketplaceCategoryRepository extends JpaRepository<MarketplaceCategory, Long> {
    Optional<MarketplaceCategory> findByName(String name);
    List<MarketplaceCategory> findByIsActive(Boolean isActive);
}
