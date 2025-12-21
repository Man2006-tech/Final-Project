package com.nustconnect.backend.Controllers;

import com.nustconnect.backend.DTOs.Report.*;
import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
import com.nustconnect.backend.Models.*;
import com.nustconnect.backend.Services.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReportController {

    private final ReportService reportService;
    private final ProfileService profileService;

    @PostMapping
    public ResponseEntity<ReportResponseDTO> createReport(
            @RequestParam Long reporterId,
            @Valid @RequestBody CreateReportRequestDTO request) {
        Report report = reportService.createReport(reporterId, request.getTargetType(), request.getTargetId(), request.getReason());
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponseDTO(report));
    }

    @GetMapping("/{reportId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportResponseDTO> getReportById(@PathVariable Long reportId) {
        Report report = reportService.getReportById(reportId);
        return ResponseEntity.ok(mapToResponseDTO(report));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReportResponseDTO>> getAllReports() {
        List<Report> reports = reportService.getPendingReports();
        return ResponseEntity.ok(reports.stream().map(this::mapToResponseDTO).collect(Collectors.toList()));
    }

    @PatchMapping("/{reportId}/resolve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportResponseDTO> resolveReport(
            @PathVariable Long reportId,
            @RequestParam Long adminId,
            @RequestBody String notes) {
        Report report = reportService.resolveReport(reportId, adminId, notes);
        return ResponseEntity.ok(mapToResponseDTO(report));
    }

    @PatchMapping("/{reportId}/dismiss")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReportResponseDTO> dismissReport(
            @PathVariable Long reportId,
            @RequestParam Long adminId,
            @RequestBody String notes) {
        Report report = reportService.dismissReport(reportId, adminId, notes);
        return ResponseEntity.ok(mapToResponseDTO(report));
    }

    private ReportResponseDTO mapToResponseDTO(Report report) {
        return ReportResponseDTO.builder()
                .id(report.getId())
                .reason(report.getReason())
                .targetType(report.getTargetType())
                .targetId(report.getTargetId())
                .reportedBy(mapToUserSummaryDTO(report.getReportedBy()))
                .status(report.getStatus())
                .adminNotes(report.getAdminNotes())
                .reviewedBy(report.getReviewedBy() != null ? mapToUserSummaryDTO(report.getReviewedBy()) : null)
                .createdAt(report.getCreatedAt())
                .build();
    }

    private UserSummaryDTO mapToUserSummaryDTO(User user) {
        String profilePicture = null;
        try { profilePicture = profileService.getProfileByUserId(user.getUserId()).getProfilePicture(); } catch (Exception e) {}
        return UserSummaryDTO.builder().userId(user.getUserId()).name(user.getName()).profilePicture(profilePicture).department(user.getDepartment()).build();
    }
}