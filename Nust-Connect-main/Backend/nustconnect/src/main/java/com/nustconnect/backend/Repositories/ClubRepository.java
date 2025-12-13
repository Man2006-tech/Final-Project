package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Enums.ClubCategory;
import com.nustconnect.backend.Models.Club;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubRepository extends JpaRepository<Club, Long> {
    List<Club> findByCategory(ClubCategory category);
    List<Club> findByCreatedByUserId(Long userId);
    Optional<Club> findByName(String name);
    List<Club> findByIsApproved(Boolean isApproved);

    @Query("SELECT c FROM Club c WHERE c.name LIKE %:keyword% OR c.description LIKE %:keyword%")
    List<Club> searchClubs(@Param("keyword") String keyword);
}
