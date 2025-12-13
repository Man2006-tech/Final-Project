package com.nustconnect.backend.Services;

import com.nustconnect.backend.Models.Club;
import com.nustconnect.backend.Models.ClubMembership;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.ClubMembershipRepository;
import com.nustconnect.backend.Repositories.ClubRepository;
import com.nustconnect.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ClubMembershipService {

    private final ClubMembershipRepository membershipRepository;
    private final ClubRepository clubRepository;
    private final UserRepository userRepository;
    private final ClubService clubService;

    // ==================== CREATE ====================
    public ClubMembership joinClub(Long userId, Long clubId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new IllegalArgumentException("Club not found"));

        // Check if already a member
        if (membershipRepository.existsByClubClubIdAndUserUserId(clubId, userId)) {
            throw new IllegalArgumentException("User is already a member of this club");
        }

        ClubMembership membership = ClubMembership.builder()
                .club(club)
                .user(user)
                .memberRole("MEMBER")
                .status("ACTIVE")
                .build();

        ClubMembership savedMembership = membershipRepository.save(membership);

        // Increment club member count
        clubService.incrementMemberCount(clubId);

        return savedMembership;
    }

    // ==================== READ ====================
    public ClubMembership getMembershipById(Long membershipId) {
        return membershipRepository.findById(membershipId)
                .orElseThrow(() -> new IllegalArgumentException("Membership not found"));
    }

    public ClubMembership getMembership(Long clubId, Long userId) {
        return membershipRepository.findByClubClubIdAndUserUserId(clubId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Membership not found"));
    }

    public List<ClubMembership> getClubMembers(Long clubId) {
        return membershipRepository.findByClubClubId(clubId);
    }

    public List<ClubMembership> getUserMemberships(Long userId) {
        return membershipRepository.findByUserUserId(userId);
    }

    public List<ClubMembership> getActiveClubMembers(Long clubId) {
        return membershipRepository.findByClubClubIdAndStatus(clubId, "ACTIVE");
    }

    public Long getActiveMemberCount(Long clubId) {
        return membershipRepository.countByClubClubIdAndStatus(clubId, "ACTIVE");
    }

    // ==================== UPDATE ====================
    public ClubMembership updateMemberRole(Long membershipId, String role) {
        ClubMembership membership = getMembershipById(membershipId);
        membership.setMemberRole(role);
        return membershipRepository.save(membership);
    }

    public ClubMembership promoteToPresident(Long clubId, Long userId) {
        ClubMembership membership = getMembership(clubId, userId);
        membership.makePresident();
        return membershipRepository.save(membership);
    }

    public ClubMembership promoteToVicePresident(Long clubId, Long userId) {
        ClubMembership membership = getMembership(clubId, userId);
        membership.makeVicePresident();
        return membershipRepository.save(membership);
    }

    public ClubMembership demoteToMember(Long clubId, Long userId) {
        ClubMembership membership = getMembership(clubId, userId);
        membership.setMemberRole("MEMBER");
        return membershipRepository.save(membership);
    }

    // ==================== ACTIVATION ====================
    public ClubMembership activateMembership(Long membershipId) {
        ClubMembership membership = getMembershipById(membershipId);
        membership.setStatus("ACTIVE");
        return membershipRepository.save(membership);
    }

    public ClubMembership deactivateMembership(Long membershipId) {
        ClubMembership membership = getMembershipById(membershipId);
        membership.setStatus("INACTIVE");
        return membershipRepository.save(membership);
    }

    // ==================== DELETE ====================
    public void leaveClub(Long userId, Long clubId) {
        ClubMembership membership = getMembership(clubId, userId);
        membershipRepository.delete(membership);

        // Decrement club member count
        clubService.decrementMemberCount(clubId);
    }

    public void removeMember(Long membershipId) {
        ClubMembership membership = getMembershipById(membershipId);
        Long clubId = membership.getClub().getClubId();

        membershipRepository.delete(membership);

        // Decrement club member count
        clubService.decrementMemberCount(clubId);
    }

    // ==================== VALIDATION ====================
    public boolean isMember(Long clubId, Long userId) {
        return membershipRepository.existsByClubClubIdAndUserUserId(clubId, userId);
    }

    public boolean isActiveMember(Long clubId, Long userId) {
        return membershipRepository.findByClubClubIdAndUserUserId(clubId, userId)
                .map(membership -> "ACTIVE".equals(membership.getStatus()))
                .orElse(false);
    }

    public boolean isPresident(Long clubId, Long userId) {
        return membershipRepository.findByClubClubIdAndUserUserId(clubId, userId)
                .map(membership -> "PRESIDENT".equals(membership.getMemberRole()))
                .orElse(false);
    }

    public boolean isVicePresident(Long clubId, Long userId) {
        return membershipRepository.findByClubClubIdAndUserUserId(clubId, userId)
                .map(membership -> "VICE_PRESIDENT".equals(membership.getMemberRole()))
                .orElse(false);
    }

    public boolean isClubAdmin(Long clubId, Long userId) {
        return membershipRepository.findByClubClubIdAndUserUserId(clubId, userId)
                .map(membership -> "PRESIDENT".equals(membership.getMemberRole()) ||
                        "VICE_PRESIDENT".equals(membership.getMemberRole()))
                .orElse(false);
    }

    // ==================== STATISTICS ====================
    public long getTotalMembershipCount() {
        return membershipRepository.count();
    }

    public long getClubMemberCount(Long clubId) {
        return membershipRepository.findByClubClubId(clubId).size();
    }

    public long getUserClubCount(Long userId) {
        return membershipRepository.findByUserUserId(userId).size();
    }

    // ==================== HELPER METHODS ====================
    public List<User> getClubMemberUsers(Long clubId) {
        return membershipRepository.findByClubClubId(clubId).stream()
                .map(ClubMembership::getUser)
                .toList();
    }

    public List<Club> getUserClubs(Long userId) {
        return membershipRepository.findByUserUserId(userId).stream()
                .map(ClubMembership::getClub)
                .toList();
    }

    public String getMemberRole(Long clubId, Long userId) {
        return getMembership(clubId, userId).getMemberRole();
    }
}