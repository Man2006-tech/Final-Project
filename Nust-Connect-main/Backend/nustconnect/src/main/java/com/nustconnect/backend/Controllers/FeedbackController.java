package com.nustconnect.backend.Controllers;

import com.nustconnect.backend.DTOs.Feedback.*;
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
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final ProfileService profileService;

    @PostMapping
    public ResponseEntity<FeedbackResponseDTO> submitFeedback(
            @RequestParam Long userId,
            @Valid @RequestBody CreateFeedbackRequestDTO request) {
        Feedback feedback = Feedback.builder()
                .subject(request.getSubject())
                .message(request.getMessage())
                .feedbackType(request.getFeedbackType())
                .category(request.getCategory())
                .build();

        Feedback created = feedbackService.submitFeedback(userId, feedback);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponseDTO(created));
    }

    @GetMapping("/{feedbackId}")
    public ResponseEntity<FeedbackResponseDTO> getFeedbackById(@PathVariable Long feedbackId) {
        Feedback feedback = feedbackService.getFeedbackById(feedbackId);
        return ResponseEntity.ok(mapToResponseDTO(feedback));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<FeedbackResponseDTO>> getAllFeedback() {
        List<Feedback> feedbacks = feedbackService.getPendingFeedback();
        return ResponseEntity.ok(feedbacks.stream().map(this::mapToResponseDTO).collect(Collectors.toList()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FeedbackResponseDTO>> getUserFeedback(@PathVariable Long userId) {
        List<Feedback> feedbacks = feedbackService.getFeedbackByUser(userId);
        return ResponseEntity.ok(feedbacks.stream().map(this::mapToResponseDTO).collect(Collectors.toList()));
    }

    @PatchMapping("/{feedbackId}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FeedbackResponseDTO> resolveFeedback(
            @PathVariable Long feedbackId,
            @RequestBody String response) {
        Feedback feedback = feedbackService.resolveFeedback(feedbackId, response);
        return ResponseEntity.ok(mapToResponseDTO(feedback));
    }

    @PatchMapping("/{feedbackId}/cancel")
    public ResponseEntity<FeedbackResponseDTO> cancelFeedback(
            @PathVariable Long feedbackId,
            @RequestParam Long userId) {
        Feedback feedback = feedbackService.cancelFeedback(feedbackId, userId);
        return ResponseEntity.ok(mapToResponseDTO(feedback));
    }

    private FeedbackResponseDTO mapToResponseDTO(Feedback feedback) {
        return FeedbackResponseDTO.builder()
                .feedbackId(feedback.getFeedbackId())
                .submittedBy(mapToUserSummaryDTO(feedback.getSubmittedBy()))
                .subject(feedback.getSubject())
                .message(feedback.getMessage())
                .feedbackType(feedback.getFeedbackType())
                .category(feedback.getCategory())
                .status(feedback.getStatus())
                .priority(feedback.getPriority())
                .assignedTo(feedback.getAssignedTo() != null ? mapToUserSummaryDTO(feedback.getAssignedTo()) : null)
                .adminResponse(feedback.getAdminResponse())
                .resolvedAt(feedback.getResolvedAt())
                .createdAt(feedback.getCreatedAt())
                .build();
    }

    private UserSummaryDTO mapToUserSummaryDTO(User user) {
        String profilePicture = null;
        try { profilePicture = profileService.getProfileByUserId(user.getUserId()).getProfilePicture(); } catch (Exception e) {}
        return UserSummaryDTO.builder().userId(user.getUserId()).name(user.getName()).profilePicture(profilePicture).department(user.getDepartment()).build();
    }
}