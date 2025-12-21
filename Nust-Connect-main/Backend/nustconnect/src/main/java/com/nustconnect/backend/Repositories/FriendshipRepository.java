package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Enums.FriendshipStatus;
import com.nustconnect.backend.Models.Friendship;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, Long> {
    List<Friendship> findByFollowerUserId(Long userId);
    List<Friendship> findByFollowingUserId(Long userId);
    List<Friendship> findByFollowerUserIdAndStatus(Long userId, FriendshipStatus status);
    List<Friendship> findByFollowingUserIdAndStatus(Long userId, FriendshipStatus status);
    Optional<Friendship> findByFollowerUserIdAndFollowingUserId(Long followerId, Long followingId);
    boolean existsByFollowerUserIdAndFollowingUserId(Long followerId, Long followingId);

    @Query("SELECT f FROM Friendship f WHERE (f.follower.userId = :userId OR f.following.userId = :userId) AND f.status = 'ACCEPTED'")
    List<Friendship> findAllFriends(@Param("userId") Long userId);
}
