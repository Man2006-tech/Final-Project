package com.nustconnect.backend.DTOs.Notification;

import com.nustconnect.backend.Enums.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponseDTO {
    private Long notificationId;
    private NotificationType type;
    private String message;
    private Boolean isRead;
    private Long relatedEntityId;
    private String actionUrl;
    private LocalDateTime createdAt;
}