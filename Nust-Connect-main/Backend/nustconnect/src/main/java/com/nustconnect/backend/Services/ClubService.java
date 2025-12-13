package com.nustconnect.backend.Services;

import com.nustconnect.backend.Enums.ClubCategory;
import com.nustconnect.backend.Models.Club;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.ClubRepository;
import com.nustconnect.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ClubService {

    private final ClubRepository clubRepository;
    private final UserRepository userRepository;

    // ==================== CREATE ====================
    public Club createClub(Long creatorId, Club club) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if club name already exists
        if (clubRepository.findByName(club.getName()).isPresent()) {
            throw new IllegalArgumentException("Club name already exists");
        }

        club.setCreatedBy(creator);
        club.setMemberCount(0);
        club.setIsActive(true);
        club.setIsApproved(false); // Needs admin approval

        return clubRepository.save(club);
    }

    // ==================== READ ====================
    public Club getClubById(Long clubId) {
        return clubRepository.findById(clubId)
                .orElseThrow(() -> new IllegalArgumentException("Club not found with id: " + clubId));
    }

    public Club getClubByName(String name) {
        return clubRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Club not found with name: " + name));
    }

    public List<Club> getAllClubs() {
        return clubRepository.findAll();
    }

    public List<Club> getClubsByCategory(ClubCategory category) {
        return clubRepository.findByCategory(category);
    }

    public List<Club> getClubsByCreator(Long creatorId) {
        return clubRepository.findByCreatedByUserId(creatorId);
    }

    public List<Club> getApprovedClubs() {
        return clubRepository.findByIsApproved(true);
    }

    public List<Club> getPendingClubs() {
        return clubRepository.findByIsApproved(false);
    }

    public List<Club> searchClubs(String keyword) {
        return clubRepository.searchClubs(keyword);
    }

    // ==================== UPDATE ====================
    public Club updateClub(Long clubId, Club updatedClub) {
        Club existingClub = getClubById(clubId);

        if (updatedClub.getName() != null) {
            existingClub.setName(updatedClub.getName());
        }
        if (updatedClub.getDescription() != null) {
            existingClub.setDescription(updatedClub.getDescription());
        }
        if (updatedClub.getCategory() != null) {
            existingClub.setCategory(updatedClub.getCategory());
        }
        if (updatedClub.getLogoUrl() != null) {
            existingClub.setLogoUrl(updatedClub.getLogoUrl());
        }
        if (updatedClub.getCoverImageUrl() != null) {
            existingClub.setCoverImageUrl(updatedClub.getCoverImageUrl());
        }
        if (updatedClub.getContactEmail() != null) {
            existingClub.setContactEmail(updatedClub.getContactEmail());
        }

        return clubRepository.save(existingClub);
    }

    public Club updateClubLogo(Long clubId, String logoUrl) {
        Club club = getClubById(clubId);
        club.setLogoUrl(logoUrl);
        return clubRepository.save(club);
    }

    public Club updateClubCoverImage(Long clubId, String coverImageUrl) {
        Club club = getClubById(clubId);
        club.setCoverImageUrl(coverImageUrl);
        return clubRepository.save(club);
    }

    // ==================== APPROVAL ====================
    public Club approveClub(Long clubId) {
        Club club = getClubById(clubId);
        club.setIsApproved(true);
        return clubRepository.save(club);
    }

    public Club rejectClub(Long clubId) {
        Club club = getClubById(clubId);
        club.setIsApproved(false);
        return clubRepository.save(club);
    }

    // ==================== ACTIVATION ====================
    public Club activateClub(Long clubId) {
        Club club = getClubById(clubId);
        club.setIsActive(true);
        return clubRepository.save(club);
    }

    public Club deactivateClub(Long clubId) {
        Club club = getClubById(clubId);
        club.setIsActive(false);
        return clubRepository.save(club);
    }

    // ==================== DELETE ====================
    public void deleteClub(Long clubId) {
        Club club = getClubById(clubId);
        club.softDelete();
        clubRepository.save(club);
    }

    public void hardDeleteClub(Long clubId) {
        if (!clubRepository.existsById(clubId)) {
            throw new IllegalArgumentException("Club not found");
        }
        clubRepository.deleteById(clubId);
    }

    // ==================== MEMBER COUNT ====================
    public void incrementMemberCount(Long clubId) {
        Club club = getClubById(clubId);
        club.incrementMemberCount();
        clubRepository.save(club);
    }

    public void decrementMemberCount(Long clubId) {
        Club club = getClubById(clubId);
        club.decrementMemberCount();
        clubRepository.save(club);
    }

    // ==================== VALIDATION ====================
    public boolean isClubNameAvailable(String name) {
        return clubRepository.findByName(name).isEmpty();
    }

    public boolean isClubActive(Long clubId) {
        Club club = getClubById(clubId);
        return club.getIsActive();
    }

    public boolean isClubApproved(Long clubId) {
        Club club = getClubById(clubId);
        return club.getIsApproved();
    }

    public boolean isClubCreator(Long clubId, Long userId) {
        Club club = getClubById(clubId);
        return club.getCreatedBy().getUserId().equals(userId);
    }

    // ==================== STATISTICS ====================
    public long getTotalClubCount() {
        return clubRepository.count();
    }

    public long getApprovedClubCount() {
        return clubRepository.findByIsApproved(true).size();
    }

    public long getPendingClubCount() {
        return clubRepository.findByIsApproved(false).size();
    }

    public long getClubCountByCategory(ClubCategory category) {
        return clubRepository.findByCategory(category).size();
    }

    public Integer getClubMemberCount(Long clubId) {
        Club club = getClubById(clubId);
        return club.getMemberCount();
    }
}