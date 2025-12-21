package com.nustconnect.backend.Services;

import com.nustconnect.backend.Models.Feedback;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.FeedbackRepository;
import com.nustconnect.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FeedbackService {

    private final FeedbackRepository feedbackRepository;
    private final UserRepository userRepository;

    // ==================== CREATE ====================
    public Feedback submitFeedback(Long userId, Feedback feedback) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        feedback.setSubmittedBy(user);
        feedback.setStatus("PENDING");

        if (feedback.getPriority() == null) {
            feedback.setPriority("NORMAL");
        }

        return feedbackRepository.save(feedback);
    }

    // ==================== READ ====================
    public Feedback getFeedbackById(Long feedbackId) {
        return feedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new IllegalArgumentException("Feedback not found"));
    }

    public List<Feedback> getAllFeedback() {
        return feedbackRepository.findAll();
    }

    public List<Feedback> getFeedbackByUser(Long userId) {
        return feedbackRepository.findBySubmittedByUserId(userId);
    }

    public List<Feedback> getFeedbackByStatus(String status) {
        return feedbackRepository.findByStatus(status);
    }

    public Page<Feedback> getFeedbackByStatusPaginated(String status, Pageable pageable) {
        return feedbackRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
    }

    public List<Feedback> getPendingFeedback() {
        return feedbackRepository.findByStatus("PENDING");
    }

    public List<Feedback> getResolvedFeedback() {
        return feedbackRepository.findByStatus("RESOLVED");
    }

    public List<Feedback> getFeedbackByType(String feedbackType) {
        return feedbackRepository.findByFeedbackType(feedbackType);
    }

    public List<Feedback> getFeedbackByCategory(String category) {
        return feedbackRepository.findByCategory(category);
    }

    public List<Feedback> getFeedbackAssignedTo(Long adminId) {
        return feedbackRepository.findByAssignedToUserId(adminId);
    }

    // ==================== UPDATE ====================
    public Feedback updateFeedback(Long feedbackId, Feedback updatedFeedback) {
        Feedback existingFeedback = getFeedbackById(feedbackId);

        if (updatedFeedback.getSubject() != null) {
            existingFeedback.setSubject(updatedFeedback.getSubject());
        }
        if (updatedFeedback.getMessage() != null) {
            existingFeedback.setMessage(updatedFeedback.getMessage());
        }
        if (updatedFeedback.getFeedbackType() != null) {
            existingFeedback.setFeedbackType(updatedFeedback.getFeedbackType());
        }
        if (updatedFeedback.getCategory() != null) {
            existingFeedback.setCategory(updatedFeedback.getCategory());
        }
        if (updatedFeedback.getPriority() != null) {
            existingFeedback.setPriority(updatedFeedback.getPriority());
        }

        return feedbackRepository.save(existingFeedback);
    }

    // ==================== ASSIGNMENT ====================
    public Feedback assignFeedback(Long feedbackId, Long adminId) {
        Feedback feedback = getFeedbackById(feedbackId);
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));

        feedback.assign(admin);
        return feedbackRepository.save(feedback);
    }

    // ==================== RESOLUTION ====================
    public Feedback resolveFeedback(Long feedbackId, String response) {
        Feedback feedback = getFeedbackById(feedbackId);
        feedback.resolve(response);
        return feedbackRepository.save(feedback);
    }

    public Feedback closeFeedback(Long feedbackId) {
        Feedback feedback = getFeedbackById(feedbackId);
        feedback.setStatus("CLOSED");
        return feedbackRepository.save(feedback);
    }

    public Feedback setInProgress(Long feedbackId) {
        Feedback feedback = getFeedbackById(feedbackId);
        feedback.setStatus("IN_PROGRESS");
        return feedbackRepository.save(feedback);
    }

    public Feedback cancelFeedback(Long feedbackId, Long userId) {
        Feedback feedback = getFeedbackById(feedbackId);

        // Validate the user owns the feedback
        if (!feedback.getSubmittedBy().getUserId().equals(userId)) {
            throw new IllegalArgumentException("You can only cancel your own feedback");
        }

        // Call feedback.cancel()
        feedback.cancel();

        // Save and return the feedback
        return feedbackRepository.save(feedback);
    }

    // ==================== DELETE ====================
    public void deleteFeedback(Long feedbackId) {
        Feedback feedback = getFeedbackById(feedbackId);
        feedback.softDelete();
        feedbackRepository.save(feedback);
    }

    public void hardDeleteFeedback(Long feedbackId) {
        if (!feedbackRepository.existsById(feedbackId)) {
            throw new IllegalArgumentException("Feedback not found");
        }
        feedbackRepository.deleteById(feedbackId);
    }

    // ==================== VALIDATION ====================
    public boolean isFeedbackOwner(Long feedbackId, Long userId) {
        Feedback feedback = getFeedbackById(feedbackId);
        return feedback.getSubmittedBy().getUserId().equals(userId);
    }

    public boolean isFeedbackAssignedTo(Long feedbackId, Long adminId) {
        Feedback feedback = getFeedbackById(feedbackId);
        return feedback.getAssignedTo() != null &&
                feedback.getAssignedTo().getUserId().equals(adminId);
    }

    public boolean isFeedbackPending(Long feedbackId) {
        Feedback feedback = getFeedbackById(feedbackId);
        return "PENDING".equals(feedback.getStatus());
    }

    public boolean isFeedbackResolved(Long feedbackId) {
        Feedback feedback = getFeedbackById(feedbackId);
        return "RESOLVED".equals(feedback.getStatus());
    }

    // ==================== STATISTICS ====================
    public long getTotalFeedbackCount() {
        return feedbackRepository.count();
    }

    public long getPendingFeedbackCount() {
        return feedbackRepository.countByStatus("PENDING");
    }

    public long getResolvedFeedbackCount() {
        return feedbackRepository.countByStatus("RESOLVED");
    }

    public long getUserFeedbackCount(Long userId) {
        return feedbackRepository.findBySubmittedByUserId(userId).size();
    }

    public long getAdminFeedbackCount(Long adminId) {
        return feedbackRepository.findByAssignedToUserId(adminId).size();
    }

    // ==================== PRIORITY/CATEGORY ====================
    public List<Feedback> getHighPriorityFeedback() {
        return getAllFeedback().stream()
                .filter(f -> "HIGH".equals(f.getPriority()))
                .filter(f -> "PENDING".equals(f.getStatus()) || "IN_PROGRESS".equals(f.getStatus()))
                .toList();
    }

    public List<Feedback> getFeedbackByPriority(String priority) {
        return getAllFeedback().stream()
                .filter(f -> priority.equals(f.getPriority()))
                .toList();
    }

    // ==================== BULK OPERATIONS ====================
    public void bulkAssignFeedback(List<Long> feedbackIds, Long adminId) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));

        feedbackIds.forEach(feedbackId -> {
            Feedback feedback = getFeedbackById(feedbackId);
            feedback.assign(admin);
            feedbackRepository.save(feedback);
        });
    }

    public List<Feedback> getUnassignedFeedback() {
        return getAllFeedback().stream()
                .filter(f -> f.getAssignedTo() == null)
                .filter(f -> "PENDING".equals(f.getStatus()))
                .toList();
    }
}