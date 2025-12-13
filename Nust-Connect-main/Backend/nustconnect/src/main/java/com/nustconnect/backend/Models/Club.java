package com.nustconnect.backend.Models;

import com.nustconnect.backend.Enums.ClubCategory;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import org.springframework.boot.autoconfigure.domain.EntityScan;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clubs", indexes = {
        @Index(name = "idx_category", columnList = "category"),
        @Index(name = "idx_name", columnList = "name")
})
@SQLDelete(sql = "UPDATE clubs SET deleted_at = NOW() WHERE club_id = ?")
@Where(clause = "deleted_at IS NULL")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Club extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long clubId;

    @NotBlank(message = "Club name is required")
    @Size(min = 3, max = 150, message = "Name must be between 3 and 150 characters")
    @Column(unique = true, nullable = false, length = 150)
    private String name;

    @NotBlank(message = "Club description is required")
    @Size(max = 2000, message = "Description too long")
    @Column(columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @NotNull(message = "Category is required")  // ← ADDED
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ClubCategory category;

    @Size(max = 500)
    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Size(max = 500)
    @Column(name = "cover_image_url", length = 500)
    private String coverImageUrl;

    @Column(name = "member_count")
    @Builder.Default
    private Integer memberCount = 0;

    @Column(name = "is_active")
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "is_approved")
    @Builder.Default
    private Boolean isApproved = false;

    @Size(max = 100)
    @Column(name = "contact_email", length = 100)
    private String contactEmail;

    @OneToMany(mappedBy = "club", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Event> events = new ArrayList<>();

    @OneToMany(mappedBy = "club")
    @Builder.Default
    private List<ClubMembership> members = new ArrayList<>();

    // Helper methods
    public void incrementMemberCount() {
        this.memberCount++;
    }

    public void decrementMemberCount() {
        if (this.memberCount > 0) {
            this.memberCount--;
        }
    }

    public void addEvent(Event event) {
        events.add(event);
        event.setClub(this);
    }

    public void removeEvent(Event event) {
        events.remove(event);
        event.setClub(null);
    }

    // Manual getters and setters to resolve Lombok issues
    public Long getClubId() {
        return clubId;
    }

    public void setClubId(Long clubId) {
        this.clubId = clubId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public ClubCategory getCategory() {
        return category;
    }

    public void setCategory(ClubCategory category) {
        this.category = category;
    }

    public String getLogoUrl() {
        return logoUrl;
    }

    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }

    public String getCoverImageUrl() {
        return coverImageUrl;
    }

    public void setCoverImageUrl(String coverImageUrl) {
        this.coverImageUrl = coverImageUrl;
    }

    public Integer getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(Integer memberCount) {
        this.memberCount = memberCount;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getIsApproved() {
        return isApproved;
    }

    public void setIsApproved(Boolean isApproved) {
        this.isApproved = isApproved;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public List<Event> getEvents() {
        return events;
    }

    public void setEvents(List<Event> events) {
        this.events = events;
    }

    public List<ClubMembership> getMembers() {
        return members;
    }

    public void setMembers(List<ClubMembership> members) {
        this.members = members;
    }
}