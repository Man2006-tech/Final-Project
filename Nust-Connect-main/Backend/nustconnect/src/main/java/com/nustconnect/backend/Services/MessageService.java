package com.nustconnect.backend.Services;

import com.nustconnect.backend.Models.Message;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.MessageRepository;
import com.nustconnect.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    // ==================== CREATE ====================
    public Message sendMessage(Long senderId, Long receiverId, String content) {
        if (senderId.equals(receiverId)) {
            throw new IllegalArgumentException("Cannot send message to yourself");
        }

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new IllegalArgumentException("Sender not found"));
        User receiver = userRepository.findById(receiverId)
                .orElseThrow(() -> new IllegalArgumentException("Receiver not found"));

        Message message = Message.builder()
                .sender(sender)
                .receiver(receiver)
                .content(content)
                .isRead(false)
                .build();

        return messageRepository.save(message);
    }

    // ==================== READ ====================
    public Message getMessageById(Long messageId) {
        return messageRepository.findById(messageId)
                .orElseThrow(() -> new IllegalArgumentException("Message not found"));
    }

    public List<Message> getConversation(Long userId1, Long userId2) {
        return messageRepository.findConversation(userId1, userId2);
    }

    public List<Message> getMessagesBySender(Long senderId) {
        return messageRepository.findBySenderUserIdOrReceiverUserId(senderId, senderId);
    }

    public List<Message> getMessagesBetweenUsers(Long senderId, Long receiverId) {
        return messageRepository.findBySenderUserIdAndReceiverUserId(senderId, receiverId);
    }

    public List<Message> getUnreadMessages(Long receiverId) {
        return messageRepository.findByReceiverUserIdAndIsRead(receiverId, false);
    }

    public Long getUnreadMessageCount(Long receiverId) {
        return messageRepository.countByReceiverUserIdAndIsRead(receiverId, false);
    }

    // ==================== UPDATE ====================
    public Message markAsRead(Long messageId) {
        Message message = getMessageById(messageId);
        message.markAsRead();
        return messageRepository.save(message);
    }

    public void markConversationAsRead(Long userId, Long otherUserId) {
        List<Message> messages = messageRepository.findBySenderUserIdAndReceiverUserId(otherUserId, userId);
        messages.forEach(message -> {
            if (!message.getIsRead()) {
                message.markAsRead();
                messageRepository.save(message);
            }
        });
    }

    public void markAllAsRead(Long receiverId) {
        List<Message> unreadMessages = getUnreadMessages(receiverId);
        unreadMessages.forEach(message -> {
            message.markAsRead();
            messageRepository.save(message);
        });
    }

    // ==================== DELETE ====================
    public void deleteMessage(Long messageId) {
        if (!messageRepository.existsById(messageId)) {
            throw new IllegalArgumentException("Message not found");
        }
        messageRepository.deleteById(messageId);
    }

    public void deleteConversation(Long userId1, Long userId2) {
        List<Message> conversation = getConversation(userId1, userId2);
        messageRepository.deleteAll(conversation);
    }

    // ==================== VALIDATION ====================
    public boolean isMessageParticipant(Long messageId, Long userId) {
        Message message = getMessageById(messageId);
        return message.getSender().getUserId().equals(userId) ||
                message.getReceiver().getUserId().equals(userId);
    }

    public boolean isMessageSender(Long messageId, Long userId) {
        Message message = getMessageById(messageId);
        return message.getSender().getUserId().equals(userId);
    }

    public boolean isMessageReceiver(Long messageId, Long userId) {
        Message message = getMessageById(messageId);
        return message.getReceiver().getUserId().equals(userId);
    }

    public boolean hasUnreadMessages(Long receiverId) {
        return getUnreadMessageCount(receiverId) > 0;
    }

    // ==================== STATISTICS ====================
    public long getTotalMessageCount() {
        return messageRepository.count();
    }

    public long getUserMessageCount(Long userId) {
        return messageRepository.findBySenderUserIdOrReceiverUserId(userId, userId).size();
    }

    public long getSentMessageCount(Long senderId) {
        return messageRepository.findBySenderUserIdAndReceiverUserId(senderId, null).size();
    }

    // ==================== HELPER METHODS ====================
    public List<User> getConversationPartners(Long userId) {
        List<Message> messages = messageRepository.findBySenderUserIdOrReceiverUserId(userId, userId);

        return messages.stream()
                .map(message -> {
                    if (message.getSender().getUserId().equals(userId)) {
                        return message.getReceiver();
                    } else {
                        return message.getSender();
                    }
                })
                .distinct()
                .toList();
    }

    public Message getLastMessageInConversation(Long userId1, Long userId2) {
        List<Message> conversation = getConversation(userId1, userId2);
        return conversation.isEmpty() ? null : conversation.get(0);
    }
}