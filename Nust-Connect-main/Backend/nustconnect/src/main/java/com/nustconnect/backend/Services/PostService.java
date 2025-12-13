package com.nustconnect.backend.Services;

import com.nustconnect.backend.Enums.PostVisibility;
import com.nustconnect.backend.Models.Post;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.PostRepository;
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
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final FriendshipService friendshipService;

    // ==================== CREATE ====================
    public Post createPost(Long userId, Post post) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        post.setUser(user);

        // Set default visibility if not provided
        if (post.getVisibility() == null) {
            post.setVisibility(PostVisibility.PUBLIC);
        }

        // Initialize counts
        post.setLikeCount(0);
        post.setCommentCount(0);
        post.setIsEdited(false);

        return postRepository.save(post);
    }

    // ==================== READ ====================
    public Post getPostById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found with id: " + postId));
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Page<Post> getAllActivePosts(Pageable pageable) {
        return postRepository.findAllActivePosts(pageable);
    }

    public List<Post> getPostsByUser(Long userId) {
        return postRepository.findByUserUserId(userId);
    }

    public List<Post> getActivePostsByUser(Long userId) {
        return postRepository.findActivePostsByUser(userId);
    }

    public Page<Post> getPostsByUserPaginated(Long userId, Pageable pageable) {
        return postRepository.findByUserUserIdOrderByCreatedAtDesc(userId, pageable);
    }

    public List<Post> getPostsByVisibility(PostVisibility visibility) {
        return postRepository.findByVisibility(visibility);
    }

    public Page<Post> getPostsByVisibilityPaginated(PostVisibility visibility, Pageable pageable) {
        return postRepository.findByVisibilityOrderByCreatedAtDesc(visibility, pageable);
    }

    public Page<Post> getPublicPosts(Pageable pageable) {
        return postRepository.findByVisibilityOrderByCreatedAtDesc(PostVisibility.PUBLIC, pageable);
    }

    // ==================== UPDATE ====================
    public Post updatePost(Long postId, Post updatedPost) {
        Post existingPost = getPostById(postId);

        if (updatedPost.getContentText() != null) {
            existingPost.setContentText(updatedPost.getContentText());
            existingPost.markAsEdited();
        }
        if (updatedPost.getMediaUrl() != null) {
            existingPost.setMediaUrl(updatedPost.getMediaUrl());
            existingPost.markAsEdited();
        }
        if (updatedPost.getVisibility() != null) {
            existingPost.setVisibility(updatedPost.getVisibility());
        }

        return postRepository.save(existingPost);
    }

    public Post updatePostContent(Long postId, String content) {
        Post post = getPostById(postId);
        post.setContentText(content);
        post.markAsEdited();
        return postRepository.save(post);
    }

    public Post updatePostVisibility(Long postId, PostVisibility visibility) {
        Post post = getPostById(postId);
        post.setVisibility(visibility);
        return postRepository.save(post);
    }

    public Post updatePostMedia(Long postId, String mediaUrl) {
        Post post = getPostById(postId);
        post.setMediaUrl(mediaUrl);
        post.markAsEdited();
        return postRepository.save(post);
    }

    // ==================== DELETE ====================
    public void deletePost(Long postId) {
        Post post = getPostById(postId);
        post.softDelete();
        postRepository.save(post);
    }

    public void hardDeletePost(Long postId) {
        if (!postRepository.existsById(postId)) {
            throw new IllegalArgumentException("Post not found");
        }
        postRepository.deleteById(postId);
    }

    // ==================== LIKE/COMMENT COUNT MANAGEMENT ====================
    public void incrementLikeCount(Long postId) {
        Post post = getPostById(postId);
        post.setLikeCount(post.getLikeCount() + 1);
        postRepository.save(post);
    }

    public void decrementLikeCount(Long postId) {
        Post post = getPostById(postId);
        if (post.getLikeCount() > 0) {
            post.setLikeCount(post.getLikeCount() - 1);
            postRepository.save(post);
        }
    }

    public void incrementCommentCount(Long postId) {
        Post post = getPostById(postId);
        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);
    }

    public void decrementCommentCount(Long postId) {
        Post post = getPostById(postId);
        if (post.getCommentCount() > 0) {
            post.setCommentCount(post.getCommentCount() - 1);
            postRepository.save(post);
        }
    }

    // ==================== VALIDATION ====================
    public boolean isPostOwner(Long postId, Long userId) {
        Post post = getPostById(postId);
        return post.getUser().getUserId().equals(userId);
    }

    public boolean canUserViewPost(Long postId, Long userId) {
        Post post = getPostById(postId);

        // Post owner can always view
        if (post.getUser().getUserId().equals(userId)) {
            return true;
        }

        // Check visibility
        switch (post.getVisibility()) {
            case PUBLIC:
                return true;
            case FRIENDS:
                // Check if users are friends
                return friendshipService.areFriends(post.getUser().getUserId(), userId);
            case PRIVATE:
                return false;
            default:
                return false;
        }
    }

    public boolean isPostDeleted(Long postId) {
        Post post = getPostById(postId);
        return post.isDeleted();
    }

    // ==================== STATISTICS ====================
    public long getTotalPostCount() {
        return postRepository.count();
    }

    public long getUserPostCount(Long userId) {
        return postRepository.findByUserUserId(userId).size();
    }

    public long getPublicPostCount() {
        return postRepository.findByVisibility(PostVisibility.PUBLIC).size();
    }

    // ==================== HELPER METHODS ====================
    public void recalculateLikeCount(Long postId) {
        Post post = getPostById(postId);
        post.setLikeCount(post.getLikes().size());
        postRepository.save(post);
    }

    public void recalculateCommentCount(Long postId) {
        Post post = getPostById(postId);
        post.setCommentCount(post.getComments().size());
        postRepository.save(post);
    }
}