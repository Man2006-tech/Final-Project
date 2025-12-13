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
@Table(name = "lost_items", indexes = {
        @Index(name = "idx_reported_date", columnList = "reported_by, date_lost"),
        @Index(name = "idx_status", columnList = "status")
})
@SQLDelete(sql = "UPDATE lost_items SET deleted_at = NOW() WHERE id = ?")
@Where(clause = "deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LostItem extends BaseEntity {

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
    @Column(name = "location_lost", nullable = false, length = 200)
    private String locationLost;

    @PastOrPresent(message = "Date lost cannot be in the future")
    @Column(name = "date_lost", nullable = false)
    private LocalDateTime dateLost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reported_by", nullable = false)
    private User reportedBy;

    @Size(max = 20)
    @Column(name = "contact_info", length = 20)
    private String contactInfo;

    @Size(max = 500)
    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "is_found")
    @Builder.Default
    private Boolean isFound = false;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, FOUND, CLOSED

    @PrePersist
    protected void onCreate() {
        if (dateLost == null) {
            dateLost = LocalDateTime.now();
        }
    }

    // Helper methods
    public void markAsFound() {
        this.isFound = true;
        this.status = "FOUND";
    }

    public void close() {
        this.status = "CLOSED";
    }

    // Manual getters and setters to resolve Lombok issues
    public Boolean getIsFound() {
        return isFound;
    }

    public void setIsFound(Boolean isFound) {
        this.isFound = isFound;
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

    public String getLocationLost() {
        return locationLost;
    }

    public void setLocationLost(String locationLost) {
        this.locationLost = locationLost;
    }

    public LocalDateTime getDateLost() {
        return dateLost;
    }

    public void setDateLost(LocalDateTime dateLost) {
        this.dateLost = dateLost;
    }

    public User getReportedBy() {
        return reportedBy;
    }

    public void setReportedBy(User reportedBy) {
        this.reportedBy = reportedBy;
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
}