package com.nustconnect.backend.Models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;

@Entity
@Table(name = "found_items", indexes = {
        @Index(name = "idx_found_date", columnList = "found_by, date_found"),
        @Index(name = "idx_status", columnList = "status")
})
@SQLDelete(sql = "UPDATE found_items SET deleted_at = NOW() WHERE id = ?")
@Where(clause = "deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoundItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Item name is required")
    @Size(min = 2, max = 150, message = "Item name must be between 2 and 150 characters")
    @Column(name = "item_name", nullable = false, length = 150)
    private String itemName;

    @NotBlank(message = "Description is required")
    @Size(max = 1000, message = "Description too long")
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Location is required")
    @Size(max = 200, message = "Location description too long")
    @Column(name = "location_found", nullable = false, length = 200)
    private String locationFound;

    @PastOrPresent(message = "Date found cannot be in the future")
    @Column(name = "date_found", nullable = false)
    private LocalDateTime dateFound;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "found_by", nullable = false)
    private User foundBy;

    @Size(max = 20)
    @Column(name = "contact_info", length = 20)
    private String contactInfo;

    @Size(max = 500)
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "is_claimed")
    @Builder.Default
    private Boolean isClaimed = false;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, CLAIMED, CLOSED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "claimed_by")
    private User claimedBy;

    @Column(name = "claimed_at")
    private LocalDateTime claimedAt;

    @PrePersist
    protected void onCreate() {
        if (dateFound == null) {
            dateFound = LocalDateTime.now();
        }
    }

    // Helper methods
    public void markAsClaimed(User claimer) {
        this.isClaimed = true;
        this.status = "CLAIMED";
        this.claimedBy = claimer;
        this.claimedAt = LocalDateTime.now();
    }

    public void close() {
        this.status = "CLOSED";
    }

    // Manual getters and setters to resolve Lombok issues
    public Boolean getIsClaimed() {
        return isClaimed;
    }

    public void setIsClaimed(Boolean isClaimed) {
        this.isClaimed = isClaimed;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getLocationFound() {
        return locationFound;
    }

    public void setLocationFound(String locationFound) {
        this.locationFound = locationFound;
    }

    public LocalDateTime getDateFound() {
        return dateFound;
    }

    public void setDateFound(LocalDateTime dateFound) {
        this.dateFound = dateFound;
    }

    public User getFoundBy() {
        return foundBy;
    }

    public void setFoundBy(User foundBy) {
        this.foundBy = foundBy;
    }

    public String getContactInfo() {
        return contactInfo;
    }

    public void setContactInfo(String contactInfo) {
        this.contactInfo = contactInfo;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public User getClaimedBy() {
        return claimedBy;
    }

    public void setClaimedBy(User claimedBy) {
        this.claimedBy = claimedBy;
    }

    public LocalDateTime getClaimedAt() {
        return claimedAt;
    }

    public void setClaimedAt(LocalDateTime claimedAt) {
        this.claimedAt = claimedAt;
    }
}