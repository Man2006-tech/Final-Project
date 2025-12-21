package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Models.Feedback;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findBySubmittedByUserId(Long userId);
    List<Feedback> findByStatus(String status);
    List<Feedback> findByFeedbackType(String feedbackType);
    List<Feedback> findByCategory(String category);
    List<Feedback> findByAssignedToUserId(Long assignedToId);
    Page<Feedback> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);
    Long countByStatus(String status);
}
