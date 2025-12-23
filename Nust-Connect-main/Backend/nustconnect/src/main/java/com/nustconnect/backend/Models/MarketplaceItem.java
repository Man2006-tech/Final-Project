package com.nustconnect.backend.Models;

import com.nustconnect.backend.Enums.MarketplaceCondition;
import com.nustconnect.backend.Enums.MarketplaceItemStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
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
@Table(name = "marketplace_item", indexes = {
        @Index(name = "idx_category_status", columnList = "category_id, status"),
        @Index(name = "idx_seller_created", columnList = "seller_id, created_at"),  // ← CHANGED from posted_at
        @Index(name = "idx_status", columnList = "status")
})
@SQLDelete(sql = "UPDATE marketplace_item SET deleted_at = NOW() WHERE id = ?")
@Where(clause = "deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MarketplaceItem extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Title is required")
    @Size(min = 3, max = 200, message = "Title must be between 3 and 200 characters")
    @Column(nullable = false, length = 200)
    private String title;

    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description too long")
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    @Column(nullable = false)
    private Double price;

    @NotNull(message = "Condition is required")  // ← ADDED
    @Enumerated(EnumType.STRING)
    @Column(name = "condition_status", nullable = false, length = 20)
    private MarketplaceCondition conditionStatus;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @Builder.Default
    private MarketplaceItemStatus status = MarketplaceItemStatus.AVAILABLE;

    // ← REMOVED postedAt - use createdAt from BaseEntity instead

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private MarketplaceCategory category;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "marketplace_item_images",
            joinColumns = @JoinColumn(name = "item_id"))
    @Column(name = "image_url", length = 500)
    @Builder.Default
    private List<String> imageUrls = new ArrayList<>();

    @Size(max = 200)
    @Column(name = "location", length = 200)
    private String location;

    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;

    @Column(name = "is_negotiable")
    @Builder.Default
    private Boolean isNegotiable = false;

    // Helper methods
    public void incrementViewCount() {
        this.viewCount++;
    }

    public void markAsSold() {
        this.status = MarketplaceItemStatus.SOLD;
    }

    public void markAsReserved() {
        this.status = MarketplaceItemStatus.RESERVED;
    }

    public void markAsAvailable() {
        this.status = MarketplaceItemStatus.AVAILABLE;
    }

    public boolean isAvailable() {
        return this.status == MarketplaceItemStatus.AVAILABLE && !isDeleted();
    }

    // Manual getters and setters to resolve Lombok issues
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public MarketplaceCondition getConditionStatus() {
        return conditionStatus;
    }

    public void setConditionStatus(MarketplaceCondition conditionStatus) {
        this.conditionStatus = conditionStatus;
    }

    public MarketplaceItemStatus getStatus() {
        return status;
    }

    public void setStatus(MarketplaceItemStatus status) {
        this.status = status;
    }

    public User getSeller() {
        return seller;
    }

    public void setSeller(User seller) {
        this.seller = seller;
    }

    public MarketplaceCategory getCategory() {
        return category;
    }

    public void setCategory(MarketplaceCategory category) {
        this.category = category;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }

    public Boolean getIsNegotiable() {
        return isNegotiable;
    }

    public void setIsNegotiable(Boolean isNegotiable) {
        this.isNegotiable = isNegotiable;
    }
}