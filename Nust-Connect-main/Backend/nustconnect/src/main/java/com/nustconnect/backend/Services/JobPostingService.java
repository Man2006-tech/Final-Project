package com.nustconnect.backend.Services;

import com.nustconnect.backend.Models.JobPosting;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.JobPostingRepository;
import com.nustconnect.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class JobPostingService {

    private final JobPostingRepository jobRepository;
    private final UserRepository userRepository;

    // ==================== CREATE ====================
    public JobPosting createJobPosting(Long posterId, JobPosting job) {
        User poster = userRepository.findById(posterId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        job.setPostedBy(poster);
        job.setStatus("ACTIVE");
        job.setViewCount(0);

        return jobRepository.save(job);
    }

    // ==================== READ ====================
    public JobPosting getJobById(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new IllegalArgumentException("Job not found"));
    }

    public List<JobPosting> getAllJobs() {
        return jobRepository.findAll();
    }

    public List<JobPosting> getAllActiveJobs() {
        return jobRepository.findAllActiveJobs();
    }

    public List<JobPosting> getJobsByPoster(Long posterId) {
        return jobRepository.findByPostedByUserId(posterId);
    }

    public List<JobPosting> getJobsByType(String jobType) {
        return jobRepository.findByJobType(jobType);
    }

    public List<JobPosting> getJobsByStatus(String status) {
        return jobRepository.findByStatus(status);
    }

    public Page<JobPosting> getActiveJobsPaginated(Pageable pageable) {
        return jobRepository.findByStatusOrderByCreatedAtDesc("ACTIVE", pageable);
    }

    public List<JobPosting> searchJobs(String keyword) {
        return jobRepository.searchJobs(keyword);
    }

    // ==================== UPDATE ====================
    public JobPosting updateJob(Long jobId, JobPosting updatedJob) {
        JobPosting existingJob = getJobById(jobId);

        if (updatedJob.getTitle() != null) {
            existingJob.setTitle(updatedJob.getTitle());
        }
        if (updatedJob.getDescription() != null) {
            existingJob.setDescription(updatedJob.getDescription());
        }
        if (updatedJob.getCompanyName() != null) {
            existingJob.setCompanyName(updatedJob.getCompanyName());
        }
        if (updatedJob.getJobType() != null) {
            existingJob.setJobType(updatedJob.getJobType());
        }
        if (updatedJob.getLocation() != null) {
            existingJob.setLocation(updatedJob.getLocation());
        }
        if (updatedJob.getSalaryRange() != null) {
            existingJob.setSalaryRange(updatedJob.getSalaryRange());
        }
        if (updatedJob.getApplicationUrl() != null) {
            existingJob.setApplicationUrl(updatedJob.getApplicationUrl());
        }
        if (updatedJob.getContactEmail() != null) {
            existingJob.setContactEmail(updatedJob.getContactEmail());
        }
        if (updatedJob.getApplicationDeadline() != null) {
            existingJob.setApplicationDeadline(updatedJob.getApplicationDeadline());
        }

        return jobRepository.save(existingJob);
    }

    // ==================== STATUS ====================
    public JobPosting closeJob(Long jobId) {
        JobPosting job = getJobById(jobId);
        job.close();
        return jobRepository.save(job);
    }

    public JobPosting markAsExpired(Long jobId) {
        JobPosting job = getJobById(jobId);
        job.setStatus("EXPIRED");
        return jobRepository.save(job);
    }

    public JobPosting reactivateJob(Long jobId) {
        JobPosting job = getJobById(jobId);
        job.setStatus("ACTIVE");
        return jobRepository.save(job);
    }

    // ==================== VIEW COUNT ====================
    public void incrementViewCount(Long jobId) {
        JobPosting job = getJobById(jobId);
        job.incrementViewCount();
        jobRepository.save(job);
    }

    // ==================== DELETE ====================
    public void deleteJob(Long jobId) {
        JobPosting job = getJobById(jobId);
        job.softDelete();
        jobRepository.save(job);
    }

    public void hardDeleteJob(Long jobId) {
        if (!jobRepository.existsById(jobId)) {
            throw new IllegalArgumentException("Job not found");
        }
        jobRepository.deleteById(jobId);
    }

    // ==================== VALIDATION ====================
    public boolean isJobOwner(Long jobId, Long userId) {
        JobPosting job = getJobById(jobId);
        return job.getPostedBy() != null && job.getPostedBy().getUserId().equals(userId);
    }

    public boolean isJobActive(Long jobId) {
        JobPosting job = getJobById(jobId);
        return "ACTIVE".equals(job.getStatus());
    }

    public boolean isJobExpired(Long jobId) {
        JobPosting job = getJobById(jobId);
        return job.getApplicationDeadline() != null &&
                job.getApplicationDeadline().isBefore(LocalDateTime.now());
    }

    // ==================== STATISTICS ====================
    public long getTotalJobCount() {
        return jobRepository.count();
    }

    public long getActiveJobCount() {
        return jobRepository.findByStatus("ACTIVE").size();
    }

    public long getClosedJobCount() {
        return jobRepository.findByStatus("CLOSED").size();
    }

    public long getUserJobCount(Long posterId) {
        return jobRepository.findByPostedByUserId(posterId).size();
    }

    public long getJobTypeCount(String jobType) {
        return jobRepository.findByJobType(jobType).size();
    }

    // ==================== JOB TYPES ====================
    public List<JobPosting> getInternships() {
        return jobRepository.findByJobType("INTERNSHIP");
    }

    public List<JobPosting> getPartTimeJobs() {
        return jobRepository.findByJobType("PART_TIME");
    }

    public List<JobPosting> getFullTimeJobs() {
        return jobRepository.findByJobType("FULL_TIME");
    }

    public List<JobPosting> getFreelanceJobs() {
        return jobRepository.findByJobType("FREELANCE");
    }

    // ==================== EXPIRY MANAGEMENT ====================
    public void markExpiredJobs() {
        List<JobPosting> allJobs = getAllActiveJobs();
        LocalDateTime now = LocalDateTime.now();

        allJobs.stream()
                .filter(job -> job.getApplicationDeadline() != null)
                .filter(job -> job.getApplicationDeadline().isBefore(now))
                .forEach(job -> {
                    job.setStatus("EXPIRED");
                    jobRepository.save(job);
                });
    }

    public List<JobPosting> getExpiringJobs(int daysAhead) {
        LocalDateTime deadline = LocalDateTime.now().plusDays(daysAhead);

        return getAllActiveJobs().stream()
                .filter(job -> job.getApplicationDeadline() != null)
                .filter(job -> job.getApplicationDeadline().isBefore(deadline))
                .toList();
    }

    // ==================== SEARCH & FILTER ====================
    public List<JobPosting> getJobsByCompany(String companyName) {
        return searchJobs(companyName).stream()
                .filter(job -> job.getCompanyName().equalsIgnoreCase(companyName))
                .toList();
    }

    public List<JobPosting> getJobsByLocation(String location) {
        return getAllActiveJobs().stream()
                .filter(job -> job.getLocation() != null)
                .filter(job -> job.getLocation().toLowerCase().contains(location.toLowerCase()))
                .toList();
    }

    public List<JobPosting> getRecentJobs(int days) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(days);

        return getAllActiveJobs().stream()
                .filter(job -> job.getCreatedAt().isAfter(cutoffDate))
                .toList();
    }

    // ==================== RECOMMENDATIONS ====================
    public List<JobPosting> getRecommendedJobs(User user) {
        // Basic recommendation based on user's department
        return searchJobs(user.getDepartment() != null ? user.getDepartment() : "");
    }
}