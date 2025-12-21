package com.nustconnect.backend.Services;

import com.nustconnect.backend.Enums.UserRole;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;

    // ==================== CREATE ====================
    public User createUser(User user) {
        // Validate email doesn't exist
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Validate student ID if provided
        if (user.getStudentId() != null && userRepository.existsByStudentId(user.getStudentId())) {
            throw new IllegalArgumentException("Student ID already exists");
        }

        // Validate NUST email domain
        // Validate NUST email domain
        if (!user.getEmail().endsWith("@nust.edu.pk") && !user.getEmail().endsWith("@seecs.edu.pk")) {
            throw new IllegalArgumentException("Only NUST or SEECS email addresses are allowed");
        }

        // Set default role if not provided
        if (user.getRole() == null) {
            user.setRole(UserRole.STUDENT);
        }

        // Generate verification token
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setIsEmailVerified(false);
        user.setIsActive(true);

        return userRepository.save(user);
    }

    // ==================== READ ====================
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findByStudentId(String studentId) {
        return userRepository.findByStudentId(studentId);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public List<User> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role);
    }

    public List<User> getUsersByDepartment(String department) {
        return userRepository.findByDepartment(department);
    }

    public List<User> getActiveUsers() {
        return userRepository.findByIsActive(true);
    }

    public List<User> searchUsers(String keyword) {
        return userRepository.searchUsers(keyword);
    }

    // ==================== UPDATE ====================
    public User updateUser(Long userId, User updatedUser) {
        User existingUser = getUserById(userId);

        // Update fields if provided
        if (updatedUser.getName() != null) {
            existingUser.setName(updatedUser.getName());
        }
        if (updatedUser.getDepartment() != null) {
            existingUser.setDepartment(updatedUser.getDepartment());
        }
        if (updatedUser.getPhoneNumber() != null) {
            existingUser.setPhoneNumber(updatedUser.getPhoneNumber());
        }
        if (updatedUser.getRole() != null) {
            existingUser.setRole(updatedUser.getRole());
        }
        
        // Handle Email Update with Uniqueness Check
        if (updatedUser.getEmail() != null && !updatedUser.getEmail().equals(existingUser.getEmail())) {
            if (userRepository.existsByEmail(updatedUser.getEmail())) {
                throw new IllegalArgumentException("Email already exists");
            }
            existingUser.setEmail(updatedUser.getEmail());
        }

        // Handle Student ID (CMS ID) Update with Uniqueness Check
        if (updatedUser.getStudentId() != null && !updatedUser.getStudentId().equals(existingUser.getStudentId())) {
            if (userRepository.existsByStudentId(updatedUser.getStudentId())) {
                throw new IllegalArgumentException("CMS ID already exists");
            }
            existingUser.setStudentId(updatedUser.getStudentId());
        }

        return userRepository.save(existingUser);
    }

    public User updatePassword(Long userId, String newPasswordHash) {
        User user = getUserById(userId);
        user.setPasswordHash(newPasswordHash);
        return userRepository.save(user);
    }

    public User verifyEmail(String verificationToken) {
        User user = userRepository.findAll().stream()
                .filter(u -> verificationToken.equals(u.getVerificationToken()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification token"));

        user.setIsEmailVerified(true);
        user.setVerificationToken(null);
        return userRepository.save(user);
    }

    // ==================== DELETE ====================
    public void deleteUser(Long userId) {
        User user = getUserById(userId);
        user.softDelete();
        userRepository.save(user);
    }

    public void hardDeleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new IllegalArgumentException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
    }

    // ==================== ACTIVATION ====================
    public User activateUser(Long userId) {
        User user = getUserById(userId);
        user.setIsActive(true);
        return userRepository.save(user);
    }

    public User deactivateUser(Long userId) {
        User user = getUserById(userId);
        user.setIsActive(false);
        return userRepository.save(user);
    }

    // ==================== ROLE MANAGEMENT ====================
    public User promoteToAdmin(Long userId) {
        User user = getUserById(userId);
        user.setRole(UserRole.ADMIN);
        return userRepository.save(user);
    }

    public User promoteToClubAdmin(Long userId) {
        User user = getUserById(userId);
        user.setRole(UserRole.CLUB_ADMIN);
        return userRepository.save(user);
    }

    public User promoteToFaculty(Long userId) {
        User user = getUserById(userId);
        user.setRole(UserRole.FACULTY);
        return userRepository.save(user);
    }

    // ==================== VALIDATION ====================
    public boolean isEmailAvailable(String email) {
        return !userRepository.existsByEmail(email);
    }

    public boolean isStudentIdAvailable(String studentId) {
        return !userRepository.existsByStudentId(studentId);
    }

    public boolean isUserActive(Long userId) {
        User user = getUserById(userId);
        return user.getIsActive();
    }

    public boolean isEmailVerified(Long userId) {
        User user = getUserById(userId);
        return user.getIsEmailVerified();
    }

    // ==================== STATISTICS ====================
    public long getTotalUserCount() {
        return userRepository.count();
    }

    public long getActiveUserCount() {
        return userRepository.findByIsActive(true).size();
    }

    public long getUserCountByRole(UserRole role) {
        return userRepository.findByRole(role).size();
    }
}