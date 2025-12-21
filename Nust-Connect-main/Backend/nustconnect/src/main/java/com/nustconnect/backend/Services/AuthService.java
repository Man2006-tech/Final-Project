package com.nustconnect.backend.Services;

import com.nustconnect.backend.DTOs.Auth.AuthResponse;
import com.nustconnect.backend.DTOs.Auth.ChangePasswordRequest;
import com.nustconnect.backend.DTOs.Auth.LoginRequest;
import com.nustconnect.backend.DTOs.Auth.RegisterRequest;
import com.nustconnect.backend.Enums.UserRole;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final EmailService emailService;

    // ==================== REGISTER ====================
    public AuthResponse register(RegisterRequest request) {
        // Validate email doesn't exist
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already exists");
        }

        // Validate NUST email domain
//        if (!request.getEmail().endsWith("@nust.edu.pk")) {
//            throw new IllegalArgumentException("Only NUST email addresses are allowed");
//        }

        // Validate student ID if provided
        if (request.getStudentId() != null && userRepository.existsByStudentId(request.getStudentId())) {
            throw new IllegalArgumentException("Student ID already exists");
        }

        // Create user with encrypted password
        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .studentId(request.getStudentId())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : UserRole.STUDENT)
                .department(request.getDepartment())
                .phoneNumber(request.getPhoneNumber())
                .isActive(true)
                .isEmailVerified(false)
                .verificationToken(UUID.randomUUID().toString())
                .build();

        User savedUser = userRepository.save(user);

        // Send verification email
        try {
            emailService.sendVerificationEmail(
                    savedUser.getEmail(),
                    savedUser.getName(),
                    savedUser.getVerificationToken()
            );
        } catch (Exception e) {
            // Log error but allow registration to complete
            System.err.println("Failed to send verification email: " + e.getMessage());
        }

        // Generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getEmail());
        String jwtToken = jwtService.generateTokenWithUserId(
                userDetails,
                savedUser.getUserId(),
                savedUser.getRole().name()
        );

        return AuthResponse.builder()
                .token(jwtToken)
                .userId(savedUser.getUserId())
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .role(savedUser.getRole().name())
                .message("Registration successful! Please verify your email.")
                .build();
    }

    // ==================== LOGIN ====================
    public AuthResponse login(LoginRequest request) {
        // Authenticate user
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        // Load user details
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        // Check if user is active
        if (!user.getIsActive()) {
            throw new IllegalArgumentException("Account is deactivated");
        }

        // Generate JWT token
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String jwtToken = jwtService.generateTokenWithUserId(
                userDetails,
                user.getUserId(),
                user.getRole().name()
        );

        return AuthResponse.builder()
                .token(jwtToken)
                .userId(user.getUserId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .message("Login successful!")
                .build();
    }

    // ==================== VERIFY EMAIL ====================
    public String verifyEmail(String token) {
        User user = userRepository.findAll().stream()
                .filter(u -> token.equals(u.getVerificationToken()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification token"));

        user.setIsEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        // Send welcome email
        emailService.sendWelcomeEmail(user.getEmail(), user.getName());

        return "Email verified successfully!";
    }

    // ==================== CHANGE PASSWORD ====================
    public String changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Verify old password
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Incorrect old password");
        }

        // Update to new password
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return "Password changed successfully!";
    }

    // ==================== FORGOT PASSWORD ====================
    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with this email"));

        // Generate reset token
        String resetToken = UUID.randomUUID().toString();
        user.setVerificationToken(resetToken);
        userRepository.save(user);

        // Send password reset email
        emailService.sendPasswordResetEmail(user.getEmail(), user.getName(), resetToken);

        return "Password reset link sent to email.";
    }

    // ==================== RESET PASSWORD ====================
    public String resetPassword(String token, String newPassword) {
        User user = userRepository.findAll().stream()
                .filter(u -> token.equals(u.getVerificationToken()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid reset token"));

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setVerificationToken(null);
        userRepository.save(user);

        return "Password reset successfully!";
    }

    // ==================== REFRESH TOKEN ====================
    public AuthResponse refreshToken(String oldToken) {
        String email = jwtService.extractUsername(oldToken);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        String newToken = jwtService.generateTokenWithUserId(
                userDetails,
                user.getUserId(),
                user.getRole().name()
        );

        return AuthResponse.builder()
                .token(newToken)
                .userId(user.getUserId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .message("Token refreshed successfully!")
                .build();
    }
}