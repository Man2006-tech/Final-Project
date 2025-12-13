package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Models.JobPosting;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobPostingRepository extends JpaRepository<JobPosting, Long> {
    List<JobPosting> findByPostedByUserId(Long userId);
    List<JobPosting> findByJobType(String jobType);
    List<JobPosting> findByStatus(String status);
    Page<JobPosting> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);

    @Query("SELECT j FROM JobPosting j WHERE j.status = 'ACTIVE' AND j.deletedAt IS NULL ORDER BY j.createdAt DESC")
    List<JobPosting> findAllActiveJobs();

    @Query("SELECT j FROM JobPosting j WHERE (j.title LIKE %:keyword% OR j.description LIKE %:keyword% OR j.companyName LIKE %:keyword%) AND j.status = 'ACTIVE' AND j.deletedAt IS NULL")
    List<JobPosting> searchJobs(@Param("keyword") String keyword);
}
