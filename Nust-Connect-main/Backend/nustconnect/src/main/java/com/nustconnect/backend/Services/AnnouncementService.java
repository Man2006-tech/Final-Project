package com.nustconnect.backend.Services;

import com.nustconnect.backend.Models.Announcement;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.AnnouncementRepository;
import com.nustconnect.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final UserRepository userRepository;

    // ==================== CREATE ====================
    public Announcement createAnnouncement(Long userId, Announcement announcement) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        announcement.setPostedBy(user);

        if (announcement.getPriority() == null) {
            announcement.setPriority("NORMAL");
        }

        announcement.setIsPinned(false);
        announcement.setViewCount(0);

        return announcementRepository.save(announcement);
    }

    // ==================== READ ====================
    public Announcement getAnnouncementById(Long announcementId) {
        return announcementRepository.findById(announcementId)
                .orElseThrow(() -> new IllegalArgumentException("Announcement not found"));
    }

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    public Page<Announcement> getAllAnnouncementsPaginated(Pageable pageable) {
        return announcementRepository.findByOrderByCreatedAtDesc(pageable);
    }

    public List<Announcement> getActiveAnnouncements() {
        return announcementRepository.findActiveAnnouncements(LocalDateTime.now());
    }

    public List<Announcement> getAnnouncementsByPostedUser(Long userId) {
        return announcementRepository.findByPostedByUserId(userId);
    }

    public List<Announcement> getAnnouncementsByCategory(String category) {
        return announcementRepository.findByCategory(category);
    }

    public List<Announcement> getAnnouncementsByDepartment(String department) {
        return announcementRepository.findByDepartment(department);
    }

    public List<Announcement> getPinnedAnnouncements() {
        return announcementRepository.findByIsPinned(true);
    }

    // ==================== UPDATE ====================
    public Announcement updateAnnouncement(Long announcementId, Announcement updatedAnnouncement) {
        Announcement existingAnnouncement = getAnnouncementById(announcementId);

        if (updatedAnnouncement.getTitle() != null) {
            existingAnnouncement.setTitle(updatedAnnouncement.getTitle());
        }
        if (updatedAnnouncement.getContent() != null) {
            existingAnnouncement.setContent(updatedAnnouncement.getContent());
        }
        if (updatedAnnouncement.getPriority() != null) {
            existingAnnouncement.setPriority(updatedAnnouncement.getPriority());
        }
        if (updatedAnnouncement.getCategory() != null) {
            existingAnnouncement.setCategory(updatedAnnouncement.getCategory());
        }
        if (updatedAnnouncement.getDepartment() != null) {
            existingAnnouncement.setDepartment(updatedAnnouncement.getDepartment());
        }
        if (updatedAnnouncement.getExpiryDate() != null) {
            existingAnnouncement.setExpiryDate(updatedAnnouncement.getExpiryDate());
        }
        if (updatedAnnouncement.getAttachmentUrl() != null) {
            existingAnnouncement.setAttachmentUrl(updatedAnnouncement.getAttachmentUrl());
        }

        return announcementRepository.save(existingAnnouncement);
    }

    // ==================== PIN/UNPIN ====================
    public Announcement pinAnnouncement(Long announcementId) {
        Announcement announcement = getAnnouncementById(announcementId);
        announcement.setIsPinned(true);
        return announcementRepository.save(announcement);
    }

    public Announcement unpinAnnouncement(Long announcementId) {
        Announcement announcement = getAnnouncementById(announcementId);
        announcement.setIsPinned(false);
        return announcementRepository.save(announcement);
    }

    // ==================== VIEW COUNT ====================
    public void incrementViewCount(Long announcementId) {
        Announcement announcement = getAnnouncementById(announcementId);
        announcement.incrementViewCount();
        announcementRepository.save(announcement);
    }

    // ==================== DELETE ====================
    public void deleteAnnouncement(Long announcementId) {
        Announcement announcement = getAnnouncementById(announcementId);
        announcement.softDelete();
        announcementRepository.save(announcement);
    }

    public void hardDeleteAnnouncement(Long announcementId) {
        if (!announcementRepository.existsById(announcementId)) {
            throw new IllegalArgumentException("Announcement not found");
        }
        announcementRepository.deleteById(announcementId);
    }

    // ==================== VALIDATION ====================
    public boolean isAnnouncementOwner(Long announcementId, Long userId) {
        Announcement announcement = getAnnouncementById(announcementId);
        return announcement.getPostedBy().getUserId().equals(userId);
    }

    public boolean isAnnouncementExpired(Long announcementId) {
        Announcement announcement = getAnnouncementById(announcementId);
        return announcement.isExpired();
    }

    public boolean isAnnouncementPinned(Long announcementId) {
        Announcement announcement = getAnnouncementById(announcementId);
        return announcement.getIsPinned();
    }

    // ==================== STATISTICS ====================
    public long getTotalAnnouncementCount() {
        return announcementRepository.count();
    }

    public long getActiveAnnouncementCount() {
        return getActiveAnnouncements().size();
    }

    public long getUserAnnouncementCount(Long userId) {
        return announcementRepository.findByPostedByUserId(userId).size();
    }

    public long getPinnedAnnouncementCount() {
        return announcementRepository.findByIsPinned(true).size();
    }

    // ==================== PRIORITY/CATEGORY ====================
    public List<Announcement> getHighPriorityAnnouncements() {
        return getAllAnnouncements().stream()
                .filter(a -> "HIGH".equals(a.getPriority()))
                .toList();
    }

    public List<Announcement> getAnnouncementsByPriority(String priority) {
        return getAllAnnouncements().stream()
                .filter(a -> priority.equals(a.getPriority()))
                .toList();
    }

    // ==================== BULK OPERATIONS ====================
    public void deleteExpiredAnnouncements() {
        List<Announcement> allAnnouncements = getAllAnnouncements();
        allAnnouncements.stream()
                .filter(Announcement::isExpired)
                .forEach(announcement -> {
                    announcement.softDelete();
                    announcementRepository.save(announcement);
                });
    }

    public List<Announcement> getAnnouncementsForUser(User user) {
        // Get announcements relevant to user's department
        List<Announcement> deptAnnouncements = getAnnouncementsByDepartment(user.getDepartment());
        List<Announcement> generalAnnouncements = getAnnouncementsByDepartment(null);

        deptAnnouncements.addAll(generalAnnouncements);

        // Filter active only
        return deptAnnouncements.stream()
                .filter(a -> !a.isExpired())
                .toList();
    }
}