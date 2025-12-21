package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Models.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserUserId(Long userId);
    List<Notification> findByUserUserIdAndIsRead(Long userId, Boolean isRead);
    List<Notification> findByUserUserIdOrderByCreatedAtDesc(Long userId);
    Long countByUserUserIdAndIsRead(Long userId, Boolean isRead);
    Page<Notification> findByUserUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
}
