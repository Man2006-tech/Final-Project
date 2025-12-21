package com.nustconnect.backend.Controllers;

import com.nustconnect.backend.DTOs.Announcement.*;
import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
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
@RequestMapping("/api/announcements")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AnnouncementController {

    private final AnnouncementService announcementService;
    private final ProfileService profileService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<AnnouncementResponseDTO> createAnnouncement(
            @RequestParam Long userId,
            @Valid @RequestBody CreateAnnouncementRequestDTO request) {
        Announcement announcement = Announcement.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .priority(request.getPriority())
                .category(request.getCategory())
                .department(request.getDepartment())
                .expiryDate(request.getExpiryDate())
                .attachmentUrl(request.getAttachmentUrl())
                .build();

        Announcement created = announcementService.createAnnouncement(userId, announcement);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponseDTO(created));
    }

    @GetMapping("/{announcementId}")
    public ResponseEntity<AnnouncementResponseDTO> getAnnouncementById(@PathVariable Long announcementId) {
        Announcement announcement = announcementService.getAnnouncementById(announcementId);
        announcementService.incrementViewCount(announcementId);
        return ResponseEntity.ok(mapToResponseDTO(announcement));
    }

    @GetMapping
    public ResponseEntity<List<AnnouncementResponseDTO>> getActiveAnnouncements() {
        List<Announcement> announcements = announcementService.getActiveAnnouncements();
        return ResponseEntity.ok(announcements.stream().map(this::mapToResponseDTO).collect(Collectors.toList()));
    }

    @PatchMapping("/{announcementId}/pin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnnouncementResponseDTO> pinAnnouncement(@PathVariable Long announcementId) {
        Announcement announcement = announcementService.pinAnnouncement(announcementId);
        return ResponseEntity.ok(mapToResponseDTO(announcement));
    }

    @DeleteMapping("/{announcementId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY')")
    public ResponseEntity<String> deleteAnnouncement(@PathVariable Long announcementId) {
        announcementService.deleteAnnouncement(announcementId);
        return ResponseEntity.ok("Announcement deleted successfully");
    }

    private AnnouncementResponseDTO mapToResponseDTO(Announcement announcement) {
        return AnnouncementResponseDTO.builder()
                .announcementId(announcement.getAnnouncementId())
                .title(announcement.getTitle())
                .content(announcement.getContent())
                .postedBy(mapToUserSummaryDTO(announcement.getPostedBy()))
                .priority(announcement.getPriority())
                .category(announcement.getCategory())
                .department(announcement.getDepartment())
                .expiryDate(announcement.getExpiryDate())
                .isPinned(announcement.getIsPinned())
                .viewCount(announcement.getViewCount())
                .attachmentUrl(announcement.getAttachmentUrl())
                .createdAt(announcement.getCreatedAt())
                .build();
    }

    private UserSummaryDTO mapToUserSummaryDTO(User user) {
        String profilePicture = null;
        try { profilePicture = profileService.getProfileByUserId(user.getUserId()).getProfilePicture(); } catch (Exception e) {}
        return UserSummaryDTO.builder().userId(user.getUserId()).name(user.getName()).profilePicture(profilePicture).department(user.getDepartment()).build();
    }
}