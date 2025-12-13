package com.nustconnect.backend.Services;

import com.nustconnect.backend.Enums.NotificationType;
import com.nustconnect.backend.Models.Notification;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.NotificationRepository;
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
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // ==================== CREATE ====================
    public Notification createNotification(Long userId, NotificationType type, String message) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .message(message)
                .isRead(false)
                .build();

        return notificationRepository.save(notification);
    }

    public Notification createNotificationWithEntity(Long userId, NotificationType type, String message,
                                                     Long relatedEntityId, String actionUrl) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        Notification notification = Notification.builder()
                .user(user)
                .type(type)
                .message(message)
                .relatedEntityId(relatedEntityId)
                .actionUrl(actionUrl)
                .isRead(false)
                .build();

        return notificationRepository.save(notification);
    }

    // ==================== SPECIFIC NOTIFICATION CREATORS ====================
    public Notification notifyPostLike(Long userId, String likerName, Long postId) {
        String message = likerName + " liked your post";
        return createNotificationWithEntity(userId, NotificationType.POST_LIKE,
                message, postId, "/posts/" + postId);
    }

    public Notification notifyComment(Long userId, String commenterName, Long postId) {
        String message = commenterName + " commented on your post";
        return createNotificationWithEntity(userId, NotificationType.COMMENT,
                message, postId, "/posts/" + postId);
    }

    public Notification notifyEvent(Long userId, String eventName, Long eventId) {
        String message = "New event: " + eventName;
        return createNotificationWithEntity(userId, NotificationType.EVENT,
                message, eventId, "/events/" + eventId);
    }

    public Notification notifySystem(Long userId, String message) {
        return createNotification(userId, NotificationType.SYSTEM, message);
    }

    // ==================== READ ====================
    public Notification getNotificationById(Long notificationId) {
        return notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found"));
    }

    public List<Notification> getNotificationsByUser(Long userId) {
        return notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
    }

    public Page<Notification> getNotificationsByUserPaginated(Long userId, Pageable pageable) {
        return notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public List<Notification> getUnreadNotifications(Long userId) {
        return notificationRepository.findByUserUserIdAndIsRead(userId, false);
    }

    public List<Notification> getReadNotifications(Long userId) {
        return notificationRepository.findByUserUserIdAndIsRead(userId, true);
    }

    public Long getUnreadNotificationCount(Long userId) {
        return notificationRepository.countByUserUserIdAndIsRead(userId, false);
    }

    // ==================== UPDATE ====================
    public Notification markAsRead(Long notificationId) {
        Notification notification = getNotificationById(notificationId);
        notification.markAsRead();
        return notificationRepository.save(notification);
    }

    public Notification markAsUnread(Long notificationId) {
        Notification notification = getNotificationById(notificationId);
        notification.markAsUnread();
        return notificationRepository.save(notification);
    }

    public void markAllAsRead(Long userId) {
        List<Notification> unreadNotifications = getUnreadNotifications(userId);
        unreadNotifications.forEach(notification -> {
            notification.markAsRead();
            notificationRepository.save(notification);
        });
    }

    // ==================== DELETE ====================
    public void deleteNotification(Long notificationId) {
        if (!notificationRepository.existsById(notificationId)) {
            throw new IllegalArgumentException("Notification not found");
        }
        notificationRepository.deleteById(notificationId);
    }

    public void deleteAllUserNotifications(Long userId) {
        List<Notification> notifications = getNotificationsByUser(userId);
        notificationRepository.deleteAll(notifications);
    }

    public void deleteReadNotifications(Long userId) {
        List<Notification> readNotifications = getReadNotifications(userId);
        notificationRepository.deleteAll(readNotifications);
    }

    // ==================== VALIDATION ====================
    public boolean isNotificationOwner(Long notificationId, Long userId) {
        Notification notification = getNotificationById(notificationId);
        return notification.getUser().getUserId().equals(userId);
    }

    public boolean hasUnreadNotifications(Long userId) {
        return getUnreadNotificationCount(userId) > 0;
    }

    // ==================== STATISTICS ====================
    public long getTotalNotificationCount(Long userId) {
        return notificationRepository.findByUserUserId(userId).size();
    }

    public long getTotalUnreadCount(Long userId) {
        return getUnreadNotificationCount(userId);
    }

    // ==================== BULK OPERATIONS ====================
    public void sendBulkNotification(List<Long> userIds, NotificationType type, String message) {
        userIds.forEach(userId -> createNotification(userId, type, message));
    }

    public void sendNotificationToAllUsers(NotificationType type, String message) {
        List<User> allUsers = userRepository.findAll();
        allUsers.forEach(user -> createNotification(user.getUserId(), type, message));
    }
}