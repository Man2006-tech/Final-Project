package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Models.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findBySenderUserIdOrReceiverUserId(Long senderId, Long receiverId);
    List<Message> findBySenderUserIdAndReceiverUserId(Long senderId, Long receiverId);
    List<Message> findByReceiverUserIdAndIsRead(Long receiverId, Boolean isRead);
    Long countByReceiverUserIdAndIsRead(Long receiverId, Boolean isRead);

    @Query("SELECT m FROM Message m WHERE (m.sender.userId = :userId1 AND m.receiver.userId = :userId2) OR (m.sender.userId = :userId2 AND m.receiver.userId = :userId1) ORDER BY m.sentAt DESC")
    List<Message> findConversation(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
