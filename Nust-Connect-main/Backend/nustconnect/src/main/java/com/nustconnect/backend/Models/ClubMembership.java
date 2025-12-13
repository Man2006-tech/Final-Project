package com.nustconnect.backend.Models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "club_membership",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"club_id", "user_id"})
        },
        indexes = {
                @Index(name = "idx_club_status", columnList = "club_id, status")
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClubMembership extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long membershipId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "club_id", nullable = false)
    private Club club;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "member_role", length = 50)
    @Builder.Default
    private String memberRole = "MEMBER"; // PRESIDENT, VICE_PRESIDENT, MEMBER

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, INACTIVE

    public void makePresident() {
        this.memberRole = "PRESIDENT";
    }

    public void makeVicePresident() {
        this.memberRole = "VICE_PRESIDENT";
    }

    // Manual getters and setters to resolve Lombok issues
    public Long getMembershipId() {
        return membershipId;
    }

    public void setMembershipId(Long membershipId) {
        this.membershipId = membershipId;
    }

    public Club getClub() {
        return club;
    }

    public void setClub(Club club) {
        this.club = club;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getMemberRole() {
        return memberRole;
    }

    public void setMemberRole(String memberRole) {
        this.memberRole = memberRole;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
