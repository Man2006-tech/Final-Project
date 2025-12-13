package com.nustconnect.backend.DTOs.Message;

import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MessageResponseDTO {
    private Long messageId;
    private UserSummaryDTO sender;
    private UserSummaryDTO receiver;
    private String content;
    private Boolean isRead;
    private LocalDateTime sentAt;
}