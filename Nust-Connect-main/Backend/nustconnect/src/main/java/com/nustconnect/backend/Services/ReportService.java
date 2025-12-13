package com.nustconnect.backend.Services;

import com.nustconnect.backend.Enums.ReportTargetType;
import com.nustconnect.backend.Models.Report;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.ReportRepository;
import com.nustconnect.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ReportService {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;

    // ==================== CREATE ====================
    public Report createReport(Long reporterId, ReportTargetType targetType, Long targetId, String reason) {
        User reporter = userRepository.findById(reporterId)
                .orElseThrow(() -> new IllegalArgumentException("Reporter not found"));

        Report report = Report.builder()
                .reportedBy(reporter)
                .targetType(targetType)
                .targetId(targetId)
                .reason(reason)
                .status("PENDING")
                .build();

        return reportRepository.save(report);
    }

    // ==================== READ ====================
    public Report getReportById(Long reportId) {
        return reportRepository.findById(reportId)
                .orElseThrow(() -> new IllegalArgumentException("Report not found"));
    }

    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    public List<Report> getReportsByUser(Long userId) {
        return reportRepository.findByReportedByUserId(userId);
    }

    public List<Report> getReportsByStatus(String status) {
        return reportRepository.findByStatus(status);
    }

    public Page<Report> getReportsByStatusPaginated(String status, Pageable pageable) {
        return reportRepository.findByStatusOrderByCreatedAtDesc(status, pageable);
    }

    public List<Report> getPendingReports() {
        return reportRepository.findByStatus("PENDING");
    }

    public List<Report> getResolvedReports() {
        return reportRepository.findByStatus("RESOLVED");
    }

    public List<Report> getDismissedReports() {
        return reportRepository.findByStatus("DISMISSED");
    }

    public List<Report> getReportsByTargetType(ReportTargetType targetType) {
        return reportRepository.findByTargetType(targetType);
    }

    public List<Report> getReportsByTarget(ReportTargetType targetType, Long targetId) {
        return reportRepository.findByTargetTypeAndTargetId(targetType, targetId);
    }

    public List<Report> getReportsReviewedBy(Long reviewerId) {
        return reportRepository.findByReviewedByUserId(reviewerId);
    }

    // ==================== UPDATE ====================
    public Report updateReport(Long reportId, String reason) {
        Report report = getReportById(reportId);
        report.setReason(reason);
        return reportRepository.save(report);
    }

    // ==================== RESOLUTION ====================
    public Report resolveReport(Long reportId, Long adminId, String notes) {
        Report report = getReportById(reportId);
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));

        report.resolve(admin, notes);
        return reportRepository.save(report);
    }

    public Report dismissReport(Long reportId, Long adminId, String notes) {
        Report report = getReportById(reportId);
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));

        report.dismiss(admin, notes);
        return reportRepository.save(report);
    }

    public Report reviewReport(Long reportId, Long adminId) {
        Report report = getReportById(reportId);
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));

        report.setStatus("REVIEWED");
        report.setReviewedBy(admin);
        return reportRepository.save(report);
    }

    // ==================== DELETE ====================
    public void deleteReport(Long reportId) {
        Report report = getReportById(reportId);
        report.softDelete();
        reportRepository.save(report);
    }

    public void hardDeleteReport(Long reportId) {
        if (!reportRepository.existsById(reportId)) {
            throw new IllegalArgumentException("Report not found");
        }
        reportRepository.deleteById(reportId);
    }

    // ==================== VALIDATION ====================
    public boolean isReportOwner(Long reportId, Long userId) {
        Report report = getReportById(reportId);
        return report.getReportedBy().getUserId().equals(userId);
    }

    public boolean isReportPending(Long reportId) {
        Report report = getReportById(reportId);
        return "PENDING".equals(report.getStatus());
    }

    public boolean isReportResolved(Long reportId) {
        Report report = getReportById(reportId);
        return "RESOLVED".equals(report.getStatus());
    }

    // ==================== STATISTICS ====================
    public long getTotalReportCount() {
        return reportRepository.count();
    }

    public long getPendingReportCount() {
        return reportRepository.countByStatus("PENDING");
    }

    public long getResolvedReportCount() {
        return reportRepository.countByStatus("RESOLVED");
    }

    public long getDismissedReportCount() {
        return reportRepository.countByStatus("DISMISSED");
    }

    public long getUserReportCount(Long userId) {
        return reportRepository.findByReportedByUserId(userId).size();
    }

    public long getAdminResolvedCount(Long adminId) {
        return reportRepository.findByReviewedByUserId(adminId).size();
    }

    public long getTargetReportCount(ReportTargetType targetType, Long targetId) {
        return reportRepository.findByTargetTypeAndTargetId(targetType, targetId).size();
    }

    // ==================== REPORT TYPES ====================
    public List<Report> getUserReports() {
        return reportRepository.findByTargetType(ReportTargetType.USER);
    }

    public List<Report> getPostReports() {
        return reportRepository.findByTargetType(ReportTargetType.POST);
    }

    public List<Report> getCommentReports() {
        return reportRepository.findByTargetType(ReportTargetType.COMMENT);
    }

    public List<Report> getEventReports() {
        return reportRepository.findByTargetType(ReportTargetType.EVENT);
    }

    // ==================== BULK OPERATIONS ====================
    public void bulkResolveReports(List<Long> reportIds, Long adminId, String notes) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));

        reportIds.forEach(reportId -> {
            Report report = getReportById(reportId);
            report.resolve(admin, notes);
            reportRepository.save(report);
        });
    }

    public void bulkDismissReports(List<Long> reportIds, Long adminId, String notes) {
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));

        reportIds.forEach(reportId -> {
            Report report = getReportById(reportId);
            report.dismiss(admin, notes);
            reportRepository.save(report);
        });
    }

    // ==================== FLAGGED CONTENT ====================
    public List<Report> getHighPriorityReports() {
        // Reports with multiple reports on same target
        return getAllReports().stream()
                .filter(r -> "PENDING".equals(r.getStatus()))
                .filter(r -> getTargetReportCount(r.getTargetType(), r.getTargetId()) > 3)
                .toList();
    }

    public boolean isContentFlagged(ReportTargetType targetType, Long targetId) {
        return getTargetReportCount(targetType, targetId) > 0;
    }

    public long getContentFlagCount(ReportTargetType targetType, Long targetId) {
        return getTargetReportCount(targetType, targetId);
    }
}