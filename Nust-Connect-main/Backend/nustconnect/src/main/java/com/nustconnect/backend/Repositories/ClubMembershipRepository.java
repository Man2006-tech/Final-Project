package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Models.ClubMembership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClubMembershipRepository extends JpaRepository<ClubMembership, Long> {
    List<ClubMembership> findByClubClubId(Long clubId);
    List<ClubMembership> findByUserUserId(Long userId);
    List<ClubMembership> findByClubClubIdAndStatus(Long clubId, String status);
    Optional<ClubMembership> findByClubClubIdAndUserUserId(Long clubId, Long userId);
    boolean existsByClubClubIdAndUserUserId(Long clubId, Long userId);
    Long countByClubClubIdAndStatus(Long clubId, String status);
}
