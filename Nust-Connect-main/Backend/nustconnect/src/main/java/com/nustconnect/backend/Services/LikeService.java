package com.nustconnect.backend.Services;

import com.nustconnect.backend.Models.Like;
import com.nustconnect.backend.Models.Post;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.LikeRepository;
import com.nustconnect.backend.Repositories.PostRepository;
import com.nustconnect.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostService postService;

    // ==================== CREATE/TOGGLE LIKE ====================
    public Like likePost(Long userId, Long postId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        // Check if already liked
        if (likeRepository.existsByUserUserIdAndPostPostId(userId, postId)) {
            throw new IllegalArgumentException("Post already liked by this user");
        }

        Like like = Like.builder()
                .user(user)
                .post(post)
                .build();

        Like savedLike = likeRepository.save(like);

        // Increment post like count
        postService.incrementLikeCount(postId);

        return savedLike;
    }

    public void unlikePost(Long userId, Long postId) {
        if (!likeRepository.existsByUserUserIdAndPostPostId(userId, postId)) {
            throw new IllegalArgumentException("Like not found");
        }

        likeRepository.deleteByUserUserIdAndPostPostId(userId, postId);

        // Decrement post like count
        postService.decrementLikeCount(postId);
    }

    public void toggleLike(Long userId, Long postId) {
        if (hasUserLikedPost(userId, postId)) {
            unlikePost(userId, postId);
        } else {
            likePost(userId, postId);
        }
    }

    // ==================== READ ====================
    public Like getLikeById(Long likeId) {
        return likeRepository.findById(likeId)
                .orElseThrow(() -> new IllegalArgumentException("Like not found with id: " + likeId));
    }

    public Optional<Like> getLikeByUserAndPost(Long userId, Long postId) {
        return likeRepository.findByUserUserIdAndPostPostId(userId, postId);
    }

    public List<Like> getLikesByPost(Long postId) {
        return likeRepository.findByPostPostId(postId);
    }

    public List<Like> getLikesByUser(Long userId) {
        return likeRepository.findByUserUserId(userId);
    }

    public Long getLikeCountByPost(Long postId) {
        return likeRepository.countByPostPostId(postId);
    }

    // ==================== VALIDATION ====================
    public boolean hasUserLikedPost(Long userId, Long postId) {
        return likeRepository.existsByUserUserIdAndPostPostId(userId, postId);
    }

    // ==================== DELETE ====================
    public void deleteLike(Long likeId) {
        Like like = getLikeById(likeId);
        Long postId = like.getPost().getPostId();

        likeRepository.deleteById(likeId);

        // Decrement post like count
        postService.decrementLikeCount(postId);
    }

    // ==================== STATISTICS ====================
    public long getTotalLikeCount() {
        return likeRepository.count();
    }

    public long getUserLikeCount(Long userId) {
        return likeRepository.findByUserUserId(userId).size();
    }

    // ==================== HELPER METHODS ====================
    public List<User> getUsersWhoLikedPost(Long postId) {
        return likeRepository.findByPostPostId(postId).stream()
                .map(Like::getUser)
                .toList();
    }

    public List<Post> getPostsLikedByUser(Long userId) {
        return likeRepository.findByUserUserId(userId).stream()
                .map(Like::getPost)
                .toList();
    }
}