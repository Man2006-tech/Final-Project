package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Models.*;
import com.nustconnect.backend.Enums.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// ==================== USER REPOSITORY ====================
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByStudentId(String studentId);
    boolean existsByEmail(String email);
    boolean existsByStudentId(String studentId);
    List<User> findByRole(UserRole role);
    List<User> findByDepartment(String department);
    List<User> findByIsActive(Boolean isActive);

    @Query("SELECT u FROM User u WHERE u.name LIKE %:keyword% OR u.email LIKE %:keyword%")
    List<User> searchUsers(@Param("keyword") String keyword);
}