package com.nustconnect.backend.Services;

import com.nustconnect.backend.Models.Comment;
import com.nustconnect.backend.Models.Post;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.CommentRepository;
import com.nustconnect.backend.Repositories.PostRepository;
import com.nustconnect.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final PostService postService;

    // ==================== CREATE ====================
    public Comment createComment(Long userId, Long postId, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));

        Comment comment = Comment.builder()
                .user(user)
                .post(post)
                .content(content)
                .isEdited(false)
                .build();

        Comment savedComment = commentRepository.save(comment);

        // Increment post comment count
        postService.incrementCommentCount(postId);

        return savedComment;
    }

    public Comment createReply(Long userId, Long postId, Long parentCommentId, String content) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("Post not found"));
        Comment parentComment = commentRepository.findById(parentCommentId)
                .orElseThrow(() -> new IllegalArgumentException("Parent comment not found"));

        Comment reply = Comment.builder()
                .user(user)
                .post(post)
                .content(content)
                .parentComment(parentComment)
                .isEdited(false)
                .build();

        Comment savedReply = commentRepository.save(reply);

        // Increment post comment count
        postService.incrementCommentCount(postId);

        return savedReply;
    }

    // ==================== READ ====================
    public Comment getCommentById(Long commentId) {
        return commentRepository.findById(commentId)
                .orElseThrow(() -> new IllegalArgumentException("Comment not found with id: " + commentId));
    }

    public List<Comment> getCommentsByPost(Long postId) {
        return commentRepository.findByPostPostId(postId);
    }

    public List<Comment> getActiveCommentsByPost(Long postId) {
        return commentRepository.findActiveCommentsByPost(postId);
    }

    public List<Comment> getCommentsByUser(Long userId) {
        return commentRepository.findByUserUserId(userId);
    }

    public Long getCommentCountByPost(Long postId) {
        return commentRepository.countByPostPostId(postId);
    }

    // ==================== UPDATE ====================
    public Comment updateComment(Long commentId, String newContent) {
        Comment comment = getCommentById(commentId);
        comment.setContent(newContent);
        comment.markAsEdited();
        return commentRepository.save(comment);
    }

    // ==================== DELETE ====================
    public void deleteComment(Long commentId) {
        Comment comment = getCommentById(commentId);
        Long postId = comment.getPost().getPostId();

        comment.softDelete();
        commentRepository.save(comment);

        // Decrement post comment count
        postService.decrementCommentCount(postId);
    }

    public void hardDeleteComment(Long commentId) {
        Comment comment = getCommentById(commentId);
        Long postId = comment.getPost().getPostId();

        commentRepository.deleteById(commentId);

        // Decrement post comment count
        postService.decrementCommentCount(postId);
    }

    // ==================== VALIDATION ====================
    public boolean isCommentOwner(Long commentId, Long userId) {
        Comment comment = getCommentById(commentId);
        return comment.getUser().getUserId().equals(userId);
    }

    public boolean isCommentDeleted(Long commentId) {
        Comment comment = getCommentById(commentId);
        return comment.isDeleted();
    }

    public boolean isCommentEdited(Long commentId) {
        Comment comment = getCommentById(commentId);
        return comment.getIsEdited();
    }

    // ==================== STATISTICS ====================
    public long getTotalCommentCount() {
        return commentRepository.count();
    }

    public long getUserCommentCount(Long userId) {
        return commentRepository.findByUserUserId(userId).size();
    }

    // ==================== HELPER METHODS ====================
    public boolean canUserDeleteComment(Long commentId, Long userId) {
        Comment comment = getCommentById(commentId);

        // User can delete if they're the comment owner OR post owner
        return comment.getUser().getUserId().equals(userId) ||
                comment.getPost().getUser().getUserId().equals(userId);
    }
}