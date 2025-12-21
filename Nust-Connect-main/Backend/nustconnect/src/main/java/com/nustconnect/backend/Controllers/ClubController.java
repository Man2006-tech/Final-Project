package com.nustconnect.backend.Controllers;

import com.nustconnect.backend.DTOs.Club.*;
import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
import com.nustconnect.backend.Enums.ClubCategory;
import com.nustconnect.backend.Models.*;
import com.nustconnect.backend.Services.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/clubs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ClubController {

    private final ClubService clubService;
    private final ClubMembershipService membershipService;
    private final UserService userService;
    private final ProfileService profileService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClubResponseDTO> createClub(
            @RequestParam Long creatorId,
            @Valid @RequestBody CreateClubRequestDTO request) {
        Club club = Club.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .logoUrl(request.getLogoUrl())
                .coverImageUrl(request.getCoverImageUrl())
                .contactEmail(request.getContactEmail())
                .build();

        Club createdClub = clubService.createClub(creatorId, club);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToClubResponseDTO(createdClub));
    }

    @GetMapping("/{clubId}")
    public ResponseEntity<ClubResponseDTO> getClubById(@PathVariable Long clubId) {
        Club club = clubService.getClubById(clubId);
        return ResponseEntity.ok(mapToClubResponseDTO(club));
    }

    @GetMapping
    public ResponseEntity<List<ClubResponseDTO>> getAllClubs() {
        List<Club> clubs = clubService.getAllClubs();
        return ResponseEntity.ok(clubs.stream().map(this::mapToClubResponseDTO).collect(Collectors.toList()));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ClubResponseDTO>> getClubsByCategory(@PathVariable ClubCategory category) {
        List<Club> clubs = clubService.getClubsByCategory(category);
        return ResponseEntity.ok(clubs.stream().map(this::mapToClubResponseDTO).collect(Collectors.toList()));
    }

    @GetMapping("/search")
    public ResponseEntity<List<ClubResponseDTO>> searchClubs(@RequestParam String keyword) {
        List<Club> clubs = clubService.searchClubs(keyword);
        return ResponseEntity.ok(clubs.stream().map(this::mapToClubResponseDTO).collect(Collectors.toList()));
    }

    @PutMapping("/{clubId}")
    public ResponseEntity<ClubResponseDTO> updateClub(
            @PathVariable Long clubId,
            @Valid @RequestBody UpdateClubRequestDTO request) {
        Club club = Club.builder()
                .name(request.getName())
                .description(request.getDescription())
                .category(request.getCategory())
                .logoUrl(request.getLogoUrl())
                .coverImageUrl(request.getCoverImageUrl())
                .contactEmail(request.getContactEmail())
                .build();

        Club updatedClub = clubService.updateClub(clubId, club);
        return ResponseEntity.ok(mapToClubResponseDTO(updatedClub));
    }

    @PatchMapping("/{clubId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClubResponseDTO> approveClub(@PathVariable Long clubId) {
        Club club = clubService.approveClub(clubId);
        return ResponseEntity.ok(mapToClubResponseDTO(club));
    }

    @PatchMapping("/{clubId}/recruitment")
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<ClubResponseDTO> toggleRecruitment(@PathVariable Long clubId) {
        Club club = clubService.toggleRecruitment(clubId);
        return ResponseEntity.ok(mapToClubResponseDTO(club));
    }

    @DeleteMapping("/{clubId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteClub(@PathVariable Long clubId) {
        clubService.deleteClub(clubId);
        return ResponseEntity.ok("Club deleted successfully");
    }

    @PostMapping("/{clubId}/join")
    public ResponseEntity<ClubMembershipResponseDTO> joinClub(
            @PathVariable Long clubId,
            @RequestParam Long userId) {
        ClubMembership membership = membershipService.joinClub(userId, clubId);
        return ResponseEntity.ok(mapToMembershipResponseDTO(membership));
    }

    @DeleteMapping("/{clubId}/leave")
    public ResponseEntity<String> leaveClub(
            @PathVariable Long clubId,
            @RequestParam Long userId) {
        membershipService.leaveClub(userId, clubId);
        return ResponseEntity.ok("Left club successfully");
    }

    @GetMapping("/{clubId}/members")
    public ResponseEntity<List<ClubMembershipResponseDTO>> getClubMembers(@PathVariable Long clubId) {
        List<ClubMembership> members = membershipService.getClubMembers(clubId);
        return ResponseEntity.ok(members.stream().map(this::mapToMembershipResponseDTO).collect(Collectors.toList()));
    }

    private ClubResponseDTO mapToClubResponseDTO(Club club) {
        return ClubResponseDTO.builder()
                .clubId(club.getClubId())
                .name(club.getName())
                .description(club.getDescription())
                .category(club.getCategory())
                .logoUrl(club.getLogoUrl())
                .coverImageUrl(club.getCoverImageUrl())
                .memberCount(club.getMemberCount())
                .isActive(club.getIsActive())
                .isApproved(club.getIsApproved())
                .isRecruitmentOpen(club.getIsRecruitmentOpen())
                .contactEmail(club.getContactEmail())
                .createdBy(mapToUserSummaryDTO(club.getCreatedBy()))
                .createdAt(club.getCreatedAt())
                .build();
    }

    private ClubMembershipResponseDTO mapToMembershipResponseDTO(ClubMembership membership) {
        return ClubMembershipResponseDTO.builder()
                .membershipId(membership.getMembershipId())
                .club(mapToClubSummaryDTO(membership.getClub()))
                .user(mapToUserSummaryDTO(membership.getUser()))
                .memberRole(membership.getMemberRole())
                .status(membership.getStatus())
                .joinedAt(membership.getCreatedAt())
                .build();
    }

    private ClubSummaryDTO mapToClubSummaryDTO(Club club) {
        return ClubSummaryDTO.builder()
                .clubId(club.getClubId())
                .name(club.getName())
                .logoUrl(club.getLogoUrl())
                .category(club.getCategory())
                .memberCount(club.getMemberCount())
                .build();
    }

    private UserSummaryDTO mapToUserSummaryDTO(User user) {
        String profilePicture = null;
        try {
            Profile profile = profileService.getProfileByUserId(user.getUserId());
            profilePicture = profile.getProfilePicture();
        } catch (Exception e) {
        }
        return UserSummaryDTO.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .profilePicture(profilePicture)
                .department(user.getDepartment())
                .build();
    }
}