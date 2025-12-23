package com.nustconnect.backend.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nustconnect.backend.Enums.EventApprovalStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "events", indexes = {
        @Index(name = "idx_start_time", columnList = "start_time"),
        @Index(name = "idx_club_start", columnList = "club_id, start_time"),
        @Index(name = "idx_approval", columnList = "approval_status")
})
@SQLDelete(sql = "UPDATE events SET deleted_at = NOW() WHERE event_id = ?")
@Where(clause = "deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eventId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "club_id")
    private Club club;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "venue_id")
    private Venue venue;

    @NotBlank(message = "Event title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    @Column(nullable = false, length = 200)
    private String title;

    @NotBlank(message = "Event description is required")
    @Size(max = 5000, message = "Description too long")
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Start time is required")
    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @NotNull(message = "End time is required")
    @Column(name = "end_time", nullable = false)
    private LocalDateTime endTime;

    @Column(name = "max_attendees")
    private Integer maxAttendees;

    @Column(name = "current_attendees")
    @Builder.Default
    private Integer currentAttendees = 0;

    @Column(name = "is_public")
    @Builder.Default
    private Boolean isPublic = true;

    @Size(max = 500)
    @Column(name = "event_image_url", length = 500)
    private String eventImageUrl;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false, length = 20)
    @Builder.Default
    private EventApprovalStatus approvalStatus = EventApprovalStatus.PENDING;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @Column(name = "ticket_price")
    private Double ticketPrice;

    @Column(name = "has_tickets")
    @Builder.Default
    private Boolean hasTickets = false;

    @Column(name = "requires_registration")
    @Builder.Default
    private Boolean requiresRegistration = true;

    @Column(name = "qr_code_required")
    @Builder.Default
    private Boolean qrCodeRequired = false;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    @Builder.Default
    private List<EventRegistration> registrations = new ArrayList<>();

    // Helper methods
    public boolean isFull() {
        return maxAttendees != null && currentAttendees >= maxAttendees;
    }

    public boolean canRegister() {
        return isPublic &&
                approvalStatus == EventApprovalStatus.APPROVED &&
                !isFull() &&
                startTime.isAfter(LocalDateTime.now());
    }

    public void incrementAttendees() {
        this.currentAttendees++;
    }

    public void decrementAttendees() {
        if (this.currentAttendees > 0) {
            this.currentAttendees--;
        }
    }

    @PrePersist
    protected void onCreate() {
        if (approvalStatus == null) {
            approvalStatus = EventApprovalStatus.PENDING;
        }
    }

    @PreUpdate
    protected void validateDates() {
        if (endTime != null && startTime != null && endTime.isBefore(startTime)) {
            throw new IllegalStateException("End time cannot be before start time");
        }
    }

    // Manual getters and setters to resolve Lombok issues
    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public Club getClub() {
        return club;
    }

    public void setClub(Club club) {
        this.club = club;
    }

    public Venue getVenue() {
        return venue;
    }

    public void setVenue(Venue venue) {
        this.venue = venue;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public Integer getMaxAttendees() {
        return maxAttendees;
    }

    public void setMaxAttendees(Integer maxAttendees) {
        this.maxAttendees = maxAttendees;
    }

    public Integer getCurrentAttendees() {
        return currentAttendees;
    }

    public void setCurrentAttendees(Integer currentAttendees) {
        this.currentAttendees = currentAttendees;
    }

    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public String getEventImageUrl() {
        return eventImageUrl;
    }

    public void setEventImageUrl(String eventImageUrl) {
        this.eventImageUrl = eventImageUrl;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public EventApprovalStatus getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(EventApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public Double getTicketPrice() {
        return ticketPrice;
    }

    public void setTicketPrice(Double ticketPrice) {
        this.ticketPrice = ticketPrice;
    }

    public Boolean getHasTickets() {
        return hasTickets;
    }

    public void setHasTickets(Boolean hasTickets) {
        this.hasTickets = hasTickets;
    }

    public Boolean getRequiresRegistration() {
        return requiresRegistration;
    }

    public void setRequiresRegistration(Boolean requiresRegistration) {
        this.requiresRegistration = requiresRegistration;
    }

    public Boolean getQrCodeRequired() {
        return qrCodeRequired;
    }

    public void setQrCodeRequired(Boolean qrCodeRequired) {
        this.qrCodeRequired = qrCodeRequired;
    }

    public List<EventRegistration> getRegistrations() {
        return registrations;
    }

    public void setRegistrations(List<EventRegistration> registrations) {
        this.registrations = registrations;
    }
}
