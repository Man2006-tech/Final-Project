package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Models.*;
import com.nustconnect.backend.Enums.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findByUserUserId(Long userId);
    List<Post> findByVisibility(PostVisibility visibility);
    Page<Post> findByUserUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);
    Page<Post> findByVisibilityOrderByCreatedAtDesc(PostVisibility visibility, Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.deletedAt IS NULL ORDER BY p.createdAt DESC")
    Page<Post> findAllActivePosts(Pageable pageable);

    @Query("SELECT p FROM Post p WHERE p.user.userId = :userId AND p.deletedAt IS NULL")
    List<Post> findActivePostsByUser(@Param("userId") Long userId);
}
