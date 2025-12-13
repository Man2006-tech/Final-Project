package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Enums.EventApprovalStatus;
import com.nustconnect.backend.Models.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByClubClubId(Long clubId);
    List<Event> findByCreatedByUserId(Long userId);
    List<Event> findByApprovalStatus(EventApprovalStatus status);
    List<Event> findByStartTimeBetween(LocalDateTime start, LocalDateTime end);
    Page<Event> findByApprovalStatusOrderByStartTimeDesc(EventApprovalStatus status, Pageable pageable);

    @Query("SELECT e FROM Event e WHERE e.startTime >= :now AND e.approvalStatus = 'APPROVED' AND e.deletedAt IS NULL ORDER BY e.startTime ASC")
    List<Event> findUpcomingEvents(@Param("now") LocalDateTime now);

    @Query("SELECT e FROM Event e WHERE e.deletedAt IS NULL AND e.approvalStatus = 'APPROVED'")
    Page<Event> findAllActiveEvents(Pageable pageable);
}
