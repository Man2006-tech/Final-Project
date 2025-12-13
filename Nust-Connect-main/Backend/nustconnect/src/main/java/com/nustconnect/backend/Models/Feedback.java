package com.nustconnect.backend.Models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "feedback", indexes = {
        @Index(name = "idx_created_date", columnList = "created_at"),  // ← FIXED from submitted_at
        @Index(name = "idx_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Feedback extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long feedbackId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by", nullable = false)
    private User submittedBy;

    @NotBlank(message = "Subject is required")
    @Size(max = 200)
    @Column(nullable = false, length = 200)
    private String subject;

    @NotBlank(message = "Message is required")
    @Column(columnDefinition = "TEXT")
    private String message;

    @Column(name = "feedback_type", length = 50)
    private String feedbackType; // COMPLAINT, SUGGESTION, INQUIRY, BUG_REPORT

    @Column(name = "category", length = 100)
    private String category; // ACADEMIC, HOSTEL, CAFETERIA, IT, TRANSPORT, OTHER

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "PENDING"; // PENDING, IN_PROGRESS, RESOLVED, CLOSED

    @Column(name = "priority", length = 20)
    @Builder.Default
    private String priority = "NORMAL"; // HIGH, NORMAL, LOW

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private User assignedTo;

    @Column(name = "admin_response", columnDefinition = "TEXT")
    private String adminResponse;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    public void resolve(String response) {
        this.status = "RESOLVED";
        this.adminResponse = response;
        this.resolvedAt = LocalDateTime.now();
    }

    public void assign(User admin) {
        this.assignedTo = admin;
        this.status = "IN_PROGRESS";
    }

    // Manual getters and setters to resolve Lombok issues
    public Long getFeedbackId() {
        return feedbackId;
    }

    public void setFeedbackId(Long feedbackId) {
        this.feedbackId = feedbackId;
    }

    public User getSubmittedBy() {
        return submittedBy;
    }

    public void setSubmittedBy(User submittedBy) {
        this.submittedBy = submittedBy;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getFeedbackType() {
        return feedbackType;
    }

    public void setFeedbackType(String feedbackType) {
        this.feedbackType = feedbackType;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public User getAssignedTo() {
        return assignedTo;
    }

    public void setAssignedTo(User assignedTo) {
        this.assignedTo = assignedTo;
    }

    public String getAdminResponse() {
        return adminResponse;
    }

    public void setAdminResponse(String adminResponse) {
        this.adminResponse = adminResponse;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    public void setResolvedAt(LocalDateTime resolvedAt) {
        this.resolvedAt = resolvedAt;
    }
}