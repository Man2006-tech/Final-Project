package com.nustconnect.backend.Controllers;

import com.nustconnect.backend.DTOs.Job.*;
import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
import com.nustconnect.backend.Models.*;
import com.nustconnect.backend.Services.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class JobPostingController {

    private final JobPostingService jobService;
    private final ProfileService profileService;

    @PostMapping
    public ResponseEntity<JobPostingResponseDTO> createJob(
            @RequestParam Long posterId,
            @Valid @RequestBody CreateJobPostingRequestDTO request) {
        JobPosting job = JobPosting.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .companyName(request.getCompanyName())
                .jobType(request.getJobType())
                .location(request.getLocation())
                .salaryRange(request.getSalaryRange())
                .applicationUrl(request.getApplicationUrl())
                .contactEmail(request.getContactEmail())
                .applicationDeadline(request.getApplicationDeadline())
                .build();

        JobPosting created = jobService.createJobPosting(posterId, job);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponseDTO(created));
    }

    @GetMapping("/{jobId}")
    public ResponseEntity<JobPostingResponseDTO> getJobById(@PathVariable Long jobId) {
        JobPosting job = jobService.getJobById(jobId);
        jobService.incrementViewCount(jobId);
        return ResponseEntity.ok(mapToResponseDTO(job));
    }

    @GetMapping
    public ResponseEntity<List<JobPostingResponseDTO>> getAllActiveJobs() {
        List<JobPosting> jobs = jobService.getAllActiveJobs();
        return ResponseEntity.ok(jobs.stream().map(this::mapToResponseDTO).collect(Collectors.toList()));
    }

    @GetMapping("/search")
    public ResponseEntity<List<JobPostingResponseDTO>> searchJobs(@RequestParam String keyword) {
        List<JobPosting> jobs = jobService.searchJobs(keyword);
        return ResponseEntity.ok(jobs.stream().map(this::mapToResponseDTO).collect(Collectors.toList()));
    }

    @PatchMapping("/{jobId}/close")
    public ResponseEntity<JobPostingResponseDTO> closeJob(@PathVariable Long jobId) {
        JobPosting job = jobService.closeJob(jobId);
        return ResponseEntity.ok(mapToResponseDTO(job));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<String> deleteJob(@PathVariable Long jobId) {
        jobService.deleteJob(jobId);
        return ResponseEntity.ok("Job deleted successfully");
    }

    private JobPostingResponseDTO mapToResponseDTO(JobPosting job) {
        return JobPostingResponseDTO.builder()
                .jobId(job.getJobId())
                .title(job.getTitle())
                .description(job.getDescription())
                .companyName(job.getCompanyName())
                .jobType(job.getJobType())
                .location(job.getLocation())
                .salaryRange(job.getSalaryRange())
                .applicationUrl(job.getApplicationUrl())
                .contactEmail(job.getContactEmail())
                .applicationDeadline(job.getApplicationDeadline())
                .postedBy(job.getPostedBy() != null ? mapToUserSummaryDTO(job.getPostedBy()) : null)
                .status(job.getStatus())
                .viewCount(job.getViewCount())
                .createdAt(job.getCreatedAt())
                .build();
    }

    private UserSummaryDTO mapToUserSummaryDTO(User user) {
        String profilePicture = null;
        try { profilePicture = profileService.getProfileByUserId(user.getUserId()).getProfilePicture(); } catch (Exception e) {}
        return UserSummaryDTO.builder().userId(user.getUserId()).name(user.getName()).profilePicture(profilePicture).department(user.getDepartment()).build();
    }
}