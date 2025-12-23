package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Models.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m JOIN FETCH m.sender JOIN FETCH m.receiver WHERE m.sender.userId = :senderId OR m.receiver.userId = :receiverId")
    List<Message> findBySenderUserIdOrReceiverUserId(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);

    @Query("SELECT m FROM Message m JOIN FETCH m.sender JOIN FETCH m.receiver WHERE m.sender.userId = :senderId AND m.receiver.userId = :receiverId")
    List<Message> findBySenderUserIdAndReceiverUserId(@Param("senderId") Long senderId, @Param("receiverId") Long receiverId);

    @Query("SELECT m FROM Message m JOIN FETCH m.sender JOIN FETCH m.receiver WHERE m.receiver.userId = :receiverId AND m.isRead = :isRead")
    List<Message> findByReceiverUserIdAndIsRead(@Param("receiverId") Long receiverId, @Param("isRead") Boolean isRead);

    Long countByReceiverUserIdAndIsRead(Long receiverId, Boolean isRead);

    @Query("SELECT m FROM Message m JOIN FETCH m.sender JOIN FETCH m.receiver WHERE (m.sender.userId = :userId1 AND m.receiver.userId = :userId2) OR (m.sender.userId = :userId2 AND m.receiver.userId = :userId1) ORDER BY m.sentAt ASC")
    List<Message> findConversation(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
