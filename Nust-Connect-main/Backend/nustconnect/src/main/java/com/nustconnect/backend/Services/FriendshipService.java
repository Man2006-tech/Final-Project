package com.nustconnect.backend.Services;

import com.nustconnect.backend.Enums.FriendshipStatus;
import com.nustconnect.backend.Models.Friendship;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.FriendshipRepository;
import com.nustconnect.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    // ==================== SEND FRIEND REQUEST ====================
    public Friendship sendFriendRequest(Long followerId, Long followingId) {
        // Validation
        if (followerId.equals(followingId)) {
            throw new IllegalArgumentException("Cannot send friend request to yourself");
        }

        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new IllegalArgumentException("Follower not found"));
        User following = userRepository.findById(followingId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if request already exists
        if (friendshipRepository.existsByFollowerUserIdAndFollowingUserId(followerId, followingId)) {
            throw new IllegalArgumentException("Friend request already sent");
        }

        // Check if reverse request exists
        if (friendshipRepository.existsByFollowerUserIdAndFollowingUserId(followingId, followerId)) {
            throw new IllegalArgumentException("This user has already sent you a friend request");
        }

        Friendship friendship = Friendship.builder()
                .follower(follower)
                .following(following)
                .status(FriendshipStatus.PENDING)
                .build();

        return friendshipRepository.save(friendship);
    }

    // ==================== ACCEPT FRIEND REQUEST ====================
    public Friendship acceptFriendRequest(Long friendshipId) {
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new IllegalArgumentException("Friendship not found"));

        if (friendship.getStatus() != FriendshipStatus.PENDING) {
            throw new IllegalArgumentException("Friend request is not pending");
        }

        friendship.accept();
        return friendshipRepository.save(friendship);
    }

    public Friendship acceptFriendRequestByUsers(Long followerId, Long followingId) {
        Friendship friendship = friendshipRepository.findByFollowerUserIdAndFollowingUserId(followerId, followingId)
                .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));

        if (friendship.getStatus() != FriendshipStatus.PENDING) {
            throw new IllegalArgumentException("Friend request is not pending");
        }

        friendship.accept();
        return friendshipRepository.save(friendship);
    }

    // ==================== REJECT/CANCEL FRIEND REQUEST ====================
    public void rejectFriendRequest(Long friendshipId) {
        if (!friendshipRepository.existsById(friendshipId)) {
            throw new IllegalArgumentException("Friendship not found");
        }
        friendshipRepository.deleteById(friendshipId);
    }

    public void cancelFriendRequest(Long followerId, Long followingId) {
        Friendship friendship = friendshipRepository.findByFollowerUserIdAndFollowingUserId(followerId, followingId)
                .orElseThrow(() -> new IllegalArgumentException("Friend request not found"));
        friendshipRepository.delete(friendship);
    }

    // ==================== UNFRIEND ====================
    public void unfriend(Long userId, Long friendId) {
        // Remove friendship in both directions
        friendshipRepository.findByFollowerUserIdAndFollowingUserId(userId, friendId)
                .ifPresent(friendshipRepository::delete);

        friendshipRepository.findByFollowerUserIdAndFollowingUserId(friendId, userId)
                .ifPresent(friendshipRepository::delete);
    }

    // ==================== GET FRIENDS ====================
    public List<User> getFriends(Long userId) {
        List<Friendship> friendships = friendshipRepository.findAllFriends(userId);

        return friendships.stream()
                .map(friendship -> {
                    if (friendship.getFollower().getUserId().equals(userId)) {
                        return friendship.getFollowing();
                    } else {
                        return friendship.getFollower();
                    }
                })
                .collect(Collectors.toList());
    }

    public List<Friendship> getAllFriendships(Long userId) {
        return friendshipRepository.findAllFriends(userId);
    }

    // ==================== GET PENDING REQUESTS ====================
    public List<Friendship> getPendingReceivedRequests(Long userId) {
        return friendshipRepository.findByFollowingUserIdAndStatus(userId, FriendshipStatus.PENDING);
    }

    public List<Friendship> getPendingSentRequests(Long userId) {
        return friendshipRepository.findByFollowerUserIdAndStatus(userId, FriendshipStatus.PENDING);
    }

    // ==================== GET ACCEPTED FRIENDS ====================
    public List<Friendship> getAcceptedFriendships(Long userId) {
        List<Friendship> sentAccepted = friendshipRepository.findByFollowerUserIdAndStatus(userId, FriendshipStatus.ACCEPTED);
        List<Friendship> receivedAccepted = friendshipRepository.findByFollowingUserIdAndStatus(userId, FriendshipStatus.ACCEPTED);

        sentAccepted.addAll(receivedAccepted);
        return sentAccepted;
    }

    // ==================== VALIDATION ====================
    public boolean areFriends(Long userId1, Long userId2) {
        return friendshipRepository.findByFollowerUserIdAndFollowingUserId(userId1, userId2)
                .map(Friendship::isAccepted)
                .orElse(false) ||
                friendshipRepository.findByFollowerUserIdAndFollowingUserId(userId2, userId1)
                        .map(Friendship::isAccepted)
                        .orElse(false);
    }

    public boolean hasPendingRequest(Long followerId, Long followingId) {
        return friendshipRepository.findByFollowerUserIdAndFollowingUserId(followerId, followingId)
                .map(Friendship::isPending)
                .orElse(false);
    }

    public FriendshipStatus getFriendshipStatus(Long userId1, Long userId2) {
        return friendshipRepository.findByFollowerUserIdAndFollowingUserId(userId1, userId2)
                .map(Friendship::getStatus)
                .orElse(null);
    }

    // ==================== STATISTICS ====================
    public long getFriendCount(Long userId) {
        return getFriends(userId).size();
    }

    public long getPendingRequestCount(Long userId) {
        return getPendingReceivedRequests(userId).size();
    }

    // ==================== HELPER METHODS ====================
    public Friendship getFriendshipById(Long friendshipId) {
        return friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new IllegalArgumentException("Friendship not found"));
    }

    public List<Friendship> getAllFriendRequests(Long userId) {
        List<Friendship> received = getPendingReceivedRequests(userId);
        List<Friendship> sent = getPendingSentRequests(userId);
        received.addAll(sent);
        return received;
    }
}