package com.nustconnect.backend.Controllers;

import com.nustconnect.backend.DTOs.Message.*;
import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
import com.nustconnect.backend.Models.*;
import com.nustconnect.backend.Services.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;
    private final ProfileService profileService;

    @PostMapping("/send/{receiverId}")
    public ResponseEntity<MessageResponseDTO> sendMessage(
            @PathVariable Long receiverId,
            @RequestParam Long senderId,
            @Valid @RequestBody CreateMessageRequestDTO request) {
        Message message = messageService.sendMessage(senderId, receiverId, request.getContent());
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToResponseDTO(message));
    }

    @GetMapping("/conversation/{userId1}/{userId2}")
    public ResponseEntity<List<MessageResponseDTO>> getConversation(
            @PathVariable Long userId1,
            @PathVariable Long userId2) {
        List<Message> messages = messageService.getConversation(userId1, userId2);
        return ResponseEntity.ok(messages.stream().map(this::mapToResponseDTO).collect(Collectors.toList()));
    }

    @GetMapping("/unread/{userId}")
    public ResponseEntity<List<MessageResponseDTO>> getUnreadMessages(@PathVariable Long userId) {
        List<Message> messages = messageService.getUnreadMessages(userId);
        return ResponseEntity.ok(messages.stream().map(this::mapToResponseDTO).collect(Collectors.toList()));
    }

    @PatchMapping("/{messageId}/read")
    public ResponseEntity<MessageResponseDTO> markAsRead(@PathVariable Long messageId) {
        Message message = messageService.markAsRead(messageId);
        return ResponseEntity.ok(mapToResponseDTO(message));
    }

    @DeleteMapping("/{messageId}")
    public ResponseEntity<String> deleteMessage(@PathVariable Long messageId) {
        messageService.deleteMessage(messageId);
        return ResponseEntity.ok("Message deleted successfully");
    }

    @GetMapping("/partners/{userId}")
    public ResponseEntity<List<UserSummaryDTO>> getConversationPartners(@PathVariable Long userId) {
        List<User> partners = messageService.getConversationPartners(userId);
        return ResponseEntity.ok(partners.stream().map(this::mapToUserSummaryDTO).collect(Collectors.toList()));
    }

    private MessageResponseDTO mapToResponseDTO(Message message) {
        return MessageResponseDTO.builder()
                .messageId(message.getMessageId())
                .sender(mapToUserSummaryDTO(message.getSender()))
                .receiver(mapToUserSummaryDTO(message.getReceiver()))
                .content(message.getContent())
                .isRead(message.getIsRead())
                .sentAt(message.getSentAt())
                .build();
    }

    private UserSummaryDTO mapToUserSummaryDTO(User user) {
        String profilePicture = null;
        try { profilePicture = profileService.getProfileByUserId(user.getUserId()).getProfilePicture(); } catch (Exception e) {}
        return UserSummaryDTO.builder().userId(user.getUserId()).name(user.getName()).profilePicture(profilePicture).department(user.getDepartment()).build();
    }
}