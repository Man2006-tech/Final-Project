package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Models.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface LikeRepository extends JpaRepository<Like, Long> {
    List<Like> findByPostPostId(Long postId);
    List<Like> findByUserUserId(Long userId);
    Optional<Like> findByUserUserIdAndPostPostId(Long userId, Long postId);
    boolean existsByUserUserIdAndPostPostId(Long userId, Long postId);
    Long countByPostPostId(Long postId);
    void deleteByUserUserIdAndPostPostId(Long userId, Long postId);
}