package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Enums.ReportTargetType;
import com.nustconnect.backend.Models.Report;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findByReportedByUserId(Long userId);
    List<Report> findByStatus(String status);
    List<Report> findByTargetType(ReportTargetType targetType);
    List<Report> findByTargetTypeAndTargetId(ReportTargetType targetType, Long targetId);
    List<Report> findByReviewedByUserId(Long reviewerId);
    Long countByStatus(String status);
    Page<Report> findByStatusOrderByCreatedAtDesc(String status, Pageable pageable);
}
