package com.nustconnect.backend.Models;

import com.nustconnect.backend.Enums.VenueBookingStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "venue_booking",
        indexes = {
                @Index(name = "idx_venue_time", columnList = "venue_id, start_time, end_time"),
                @Index(name = "idx_status", columnList = "approval_status")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VenueBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "venue_id", nullable = false)
    private Venue venue;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;

    @NotNull(message = "Start time is required")
    @Future(message = "Start time must be in the future")
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false, length = 20)
    @Builder.Default
    private VenueBookingStatus approvalStatus = VenueBookingStatus.PENDING;

    @Size(max = 500)
    @Column(name = "rejection_reason", length = 500)
    private String rejectionReason;

    @Size(max = 1000)
    @Column(name = "special_requirements", columnDefinition = "TEXT")
    private String specialRequirements;

    @PrePersist
    protected void onCreate() {
        if (approvalStatus == null) {
            approvalStatus = VenueBookingStatus.PENDING;
        }
    }

    @PreUpdate
    protected void validateBooking() {
        if (endTime != null && startTime != null && endTime.isBefore(startTime)) {
            throw new IllegalStateException("End time cannot be before start time");
        }
    }

    // Helper methods
    public boolean isApproved() {
        return approvalStatus == VenueBookingStatus.APPROVED;
    }

    public boolean isPending() {
        return approvalStatus == VenueBookingStatus.PENDING;
    }

    public void approve() {
        this.approvalStatus = VenueBookingStatus.APPROVED;
        this.rejectionReason = null;
    }

    public void reject(String reason) {
        this.approvalStatus = VenueBookingStatus.REJECTED;
        this.rejectionReason = reason;
    }

    // Manual getters and setters to resolve Lombok issues
    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public Venue getVenue() {
        return venue;
    }

    public void setVenue(Venue venue) {
        this.venue = venue;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Event getEvent() {
        return event;
    }

    public void setEvent(Event event) {
        this.event = event;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public VenueBookingStatus getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(VenueBookingStatus approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public String getSpecialRequirements() {
        return specialRequirements;
    }

    public void setSpecialRequirements(String specialRequirements) {
        this.specialRequirements = specialRequirements;
    }
}