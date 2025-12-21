package com.nustconnect.backend.Models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "job_posting", indexes = {
        @Index(name = "idx_created_date", columnList = "created_at"),  // ← FIXED from posted_at
        @Index(name = "idx_type_status", columnList = "job_type, status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobPosting extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long jobId;

    @NotBlank(message = "Job title is required")
    @Size(max = 200)
    @Column(nullable = false, length = 200)
    private String title;

    @NotBlank(message = "Description is required")
    @Column(columnDefinition = "TEXT")
    private String description;

    @NotBlank(message = "Company name is required")
    @Size(max = 150)
    @Column(name = "company_name", nullable = false, length = 150)
    private String companyName;

    @Column(name = "job_type", length = 50)
    private String jobType; // INTERNSHIP, PART_TIME, FULL_TIME, FREELANCE

    @Size(max = 200)
    @Column(length = 200)
    private String location;

    @Column(name = "salary_range", length = 100)
    private String salaryRange;

    @Size(max = 500)
    @Column(name = "application_url", length = 500)
    private String applicationUrl;

    @Email
    @Column(name = "contact_email", length = 100)
    private String contactEmail;

    @Column(name = "application_deadline")
    private LocalDateTime applicationDeadline;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posted_by")
    private User postedBy;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, CLOSED, EXPIRED

    @Column(name = "view_count")
    @Builder.Default
    private Integer viewCount = 0;

    public void incrementViewCount() {
        this.viewCount++;
    }

    public void close() {
        this.status = "CLOSED";
    }

    // Manual getters and setters to resolve Lombok issues
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

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getSalaryRange() {
        return salaryRange;
    }

    public void setSalaryRange(String salaryRange) {
        this.salaryRange = salaryRange;
    }

    public String getApplicationUrl() {
        return applicationUrl;
    }

    public void setApplicationUrl(String applicationUrl) {
        this.applicationUrl = applicationUrl;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public LocalDateTime getApplicationDeadline() {
        return applicationDeadline;
    }

    public void setApplicationDeadline(LocalDateTime applicationDeadline) {
        this.applicationDeadline = applicationDeadline;
    }

    public User getPostedBy() {
        return postedBy;
    }

    public void setPostedBy(User postedBy) {
        this.postedBy = postedBy;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }
}