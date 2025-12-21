package com.nustconnect.backend.Controllers;

import com.nustconnect.backend.DTOs.Post.*;
import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
import com.nustconnect.backend.Models.*;
import com.nustconnect.backend.Services.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PostController {

    private final PostService postService;
    private final CommentService commentService;
    private final LikeService likeService;
    private final UserService userService;
    private final ProfileService profileService;

    // ==================== CREATE POST ====================
    @PostMapping
    public ResponseEntity<PostResponseDTO> createPost(
            @RequestParam Long userId,
            @Valid @RequestBody CreatePostRequestDTO request) {
        Post post = Post.builder()
                .contentText(request.getContentText())
                .mediaUrl(request.getMediaUrl())
                .visibility(request.getVisibility())
                .build();

        Post createdPost = postService.createPost(userId, post);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToPostResponseDTO(createdPost));
    }

    // ==================== GET POST BY ID ====================
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponseDTO> getPostById(@PathVariable Long postId) {
        Post post = postService.getPostById(postId);
        return ResponseEntity.ok(mapToPostResponseDTO(post));
    }

    // ==================== GET ALL POSTS ====================
    @GetMapping
    public ResponseEntity<Page<PostResponseDTO>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Post> posts = postService.getAllActivePosts(pageable);
        Page<PostResponseDTO> response = posts.map(this::mapToPostResponseDTO);
        return ResponseEntity.ok(response);
    }

    // ==================== GET USER POSTS ====================
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<PostResponseDTO>> getUserPosts(@PathVariable Long userId) {
        List<Post> posts = postService.getPostsByUser(userId);
        List<PostResponseDTO> response = posts.stream()
                .map(this::mapToPostResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ==================== UPDATE POST ====================
    @PutMapping("/{postId}")
    public ResponseEntity<PostResponseDTO> updatePost(
            @PathVariable Long postId,
            @Valid @RequestBody UpdatePostRequestDTO request) {
        Post updatedPost = Post.builder()
                .contentText(request.getContentText())
                .mediaUrl(request.getMediaUrl())
                .visibility(request.getVisibility())
                .build();

        Post post = postService.updatePost(postId, updatedPost);
        return ResponseEntity.ok(mapToPostResponseDTO(post));
    }

    // ==================== DELETE POST ====================
    @DeleteMapping("/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable Long postId) {
        postService.deletePost(postId);
        return ResponseEntity.ok("Post deleted successfully");
    }

    // ==================== LIKE POST ====================
    @PostMapping("/{postId}/like")
    public ResponseEntity<String> likePost(
            @PathVariable Long postId,
            @RequestParam Long userId) {
        likeService.likePost(userId, postId);
        return ResponseEntity.ok("Post liked successfully");
    }

    // ==================== UNLIKE POST ====================
    @DeleteMapping("/{postId}/unlike")
    public ResponseEntity<String> unlikePost(
            @PathVariable Long postId,
            @RequestParam Long userId) {
        likeService.unlikePost(userId, postId);
        return ResponseEntity.ok("Post unliked successfully");
    }

    // ==================== GET POST LIKES ====================
    @GetMapping("/{postId}/likes")
    public ResponseEntity<List<LikeResponseDTO>> getPostLikes(@PathVariable Long postId) {
        List<Like> likes = likeService.getLikesByPost(postId);
        List<LikeResponseDTO> response = likes.stream()
                .map(this::mapToLikeResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ==================== CREATE COMMENT ====================
    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentResponseDTO> createComment(
            @PathVariable Long postId,
            @RequestParam Long userId,
            @Valid @RequestBody CreateCommentRequestDTO request) {
        Comment comment;
        if (request.getParentCommentId() != null) {
            comment = commentService.createReply(userId, postId, request.getParentCommentId(), request.getContent());
        } else {
            comment = commentService.createComment(userId, postId, request.getContent());
        }
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToCommentResponseDTO(comment));
    }

    // ==================== GET POST COMMENTS ====================
    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentResponseDTO>> getPostComments(@PathVariable Long postId) {
        List<Comment> comments = commentService.getActiveCommentsByPost(postId);
        List<CommentResponseDTO> response = comments.stream()
                .map(this::mapToCommentResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    // ==================== UPDATE COMMENT ====================
    @PutMapping("/comments/{commentId}")
    public ResponseEntity<CommentResponseDTO> updateComment(
            @PathVariable Long commentId,
            @RequestBody String content) {
        Comment comment = commentService.updateComment(commentId, content);
        return ResponseEntity.ok(mapToCommentResponseDTO(comment));
    }

    // ==================== DELETE COMMENT ====================
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable Long commentId) {
        commentService.deleteComment(commentId);
        return ResponseEntity.ok("Comment deleted successfully");
    }

    // ==================== MAPPER METHODS ====================
    private PostResponseDTO mapToPostResponseDTO(Post post) {
        return PostResponseDTO.builder()
                .postId(post.getPostId())
                .contentText(post.getContentText())
                .mediaUrl(post.getMediaUrl())
                .visibility(post.getVisibility())
                .likeCount(post.getLikeCount())
                .commentCount(post.getCommentCount())
                .isEdited(post.getIsEdited())
                .author(mapToUserSummaryDTO(post.getUser()))
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

    private CommentResponseDTO mapToCommentResponseDTO(Comment comment) {
        return CommentResponseDTO.builder()
                .commentId(comment.getCommentId())
                .postId(comment.getPost().getPostId())
                .content(comment.getContent())
                .isEdited(comment.getIsEdited())
                .parentCommentId(comment.getParentComment() != null ? comment.getParentComment().getCommentId() : null)
                .author(mapToUserSummaryDTO(comment.getUser()))
                .createdAt(comment.getCreatedAt())
                .build();
    }

    private LikeResponseDTO mapToLikeResponseDTO(Like like) {
        return LikeResponseDTO.builder()
                .likeId(like.getLikeId())
                .postId(like.getPost().getPostId())
                .user(mapToUserSummaryDTO(like.getUser()))
                .createdAt(like.getCreatedAt())
                .build();
    }

    private UserSummaryDTO mapToUserSummaryDTO(User user) {
        String profilePicture = null;
        try {
            Profile profile = profileService.getProfileByUserId(user.getUserId());
            profilePicture = profile.getProfilePicture();
        } catch (Exception e) {
            // Profile doesn't exist
        }

        return UserSummaryDTO.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .profilePicture(profilePicture)
                .department(user.getDepartment())
                .build();
    }
}