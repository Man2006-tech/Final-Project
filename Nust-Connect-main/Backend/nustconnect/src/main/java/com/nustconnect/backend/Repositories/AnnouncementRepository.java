package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Models.Announcement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {
    List<Announcement> findByPostedByUserId(Long userId);
    List<Announcement> findByCategory(String category);
    List<Announcement> findByDepartment(String department);
    List<Announcement> findByIsPinned(Boolean isPinned);
    Page<Announcement> findByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT a FROM Announcement a WHERE (a.expiryDate IS NULL OR a.expiryDate > :now) AND a.deletedAt IS NULL ORDER BY a.isPinned DESC, a.createdAt DESC")
    List<Announcement> findActiveAnnouncements(@Param("now") LocalDateTime now);
}
