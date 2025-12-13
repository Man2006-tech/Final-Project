package com.nustconnect.backend.DTOs.Job;

import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobPostingResponseDTO {
    private Long jobId;
    private String title;
    private String description;
    private String companyName;
    private String jobType;
    private String location;
    private String salaryRange;
    private String applicationUrl;
    private String contactEmail;
    private LocalDateTime applicationDeadline;
    private UserSummaryDTO postedBy;
    private String status;
    private Integer viewCount;
    private LocalDateTime createdAt;
}