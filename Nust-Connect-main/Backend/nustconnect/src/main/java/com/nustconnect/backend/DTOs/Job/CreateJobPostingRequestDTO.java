package com.nustconnect.backend.DTOs.Job;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateJobPostingRequestDTO {
    @NotBlank
    @Size(max = 200)
    private String title;

    @NotBlank
    private String description;

    @NotBlank
    @Size(max = 150)
    private String companyName;

    private String jobType;

    @Size(max = 200)
    private String location;

    private String salaryRange;
    private String applicationUrl;

    @Email
    private String contactEmail;

    private LocalDateTime applicationDeadline;
}