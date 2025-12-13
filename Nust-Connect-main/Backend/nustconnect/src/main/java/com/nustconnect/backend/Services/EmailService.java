package com.nustconnect.backend.Services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    // ==================== SEND EMAIL ====================
    public void sendEmail(String to, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(body);

            mailSender.send(message);
            log.info("Email sent successfully to: {}", to);
        } catch (Exception e) {
            log.error("Failed to send email to: {}", to, e);
            throw new RuntimeException("Failed to send email");
        }
    }

    // ==================== VERIFICATION EMAIL ====================
    public void sendVerificationEmail(String to, String name, String verificationToken) {
        String subject = "NUST Connect - Email Verification";
        String verificationLink = "http://localhost:8080/api/auth/verify-email?token=" + verificationToken;

        String body = String.format(
                "Hi %s,\n\n" +
                        "Welcome to NUST Connect!\n\n" +
                        "Please verify your email by clicking the link below:\n" +
                        "%s\n\n" +
                        "This link will expire in 24 hours.\n\n" +
                        "If you didn't create this account, please ignore this email.\n\n" +
                        "Best regards,\n" +
                        "NUST Connect Team",
                name, verificationLink
        );

        sendEmail(to, subject, body);
    }

    // ==================== PASSWORD RESET EMAIL ====================
    public void sendPasswordResetEmail(String to, String name, String resetToken) {
        String subject = "NUST Connect - Password Reset Request";
        String resetLink = "http://localhost:3000/reset-password?token=" + resetToken;

        String body = String.format(
                "Hi %s,\n\n" +
                        "We received a request to reset your password.\n\n" +
                        "Click the link below to reset your password:\n" +
                        "%s\n\n" +
                        "This link will expire in 1 hour.\n\n" +
                        "If you didn't request a password reset, please ignore this email.\n\n" +
                        "Best regards,\n" +
                        "NUST Connect Team",
                name, resetLink
        );

        sendEmail(to, subject, body);
    }

    // ==================== WELCOME EMAIL ====================
    public void sendWelcomeEmail(String to, String name) {
        String subject = "Welcome to NUST Connect!";

        String body = String.format(
                "Hi %s,\n\n" +
                        "Your email has been verified successfully!\n\n" +
                        "Welcome to NUST Connect - your campus social network.\n\n" +
                        "You can now:\n" +
                        "- Connect with fellow students\n" +
                        "- Join clubs and events\n" +
                        "- Buy and sell items on the marketplace\n" +
                        "- Share rides\n" +
                        "- And much more!\n\n" +
                        "Get started at: http://localhost:3000\n\n" +
                        "Best regards,\n" +
                        "NUST Connect Team",
                name
        );

        sendEmail(to, subject, body);
    }

    // ==================== EVENT NOTIFICATION ====================
    public void sendEventNotificationEmail(String to, String name, String eventName, String eventDate) {
        String subject = "New Event: " + eventName;

        String body = String.format(
                "Hi %s,\n\n" +
                        "A new event has been posted that might interest you!\n\n" +
                        "Event: %s\n" +
                        "Date: %s\n\n" +
                        "Check it out on NUST Connect!\n\n" +
                        "Best regards,\n" +
                        "NUST Connect Team",
                name, eventName, eventDate
        );

        sendEmail(to, subject, body);
    }

    // ==================== CLUB INVITATION ====================
    public void sendClubInvitationEmail(String to, String name, String clubName) {
        String subject = "You've been invited to join " + clubName;

        String body = String.format(
                "Hi %s,\n\n" +
                        "You've been invited to join the club: %s\n\n" +
                        "Visit NUST Connect to accept the invitation!\n\n" +
                        "Best regards,\n" +
                        "NUST Connect Team",
                name, clubName
        );

        sendEmail(to, subject, body);
    }

    // ==================== GENERIC NOTIFICATION ====================
    public void sendNotificationEmail(String to, String name, String notificationMessage) {
        String subject = "NUST Connect Notification";

        String body = String.format(
                "Hi %s,\n\n" +
                        "%s\n\n" +
                        "Best regards,\n" +
                        "NUST Connect Team",
                name, notificationMessage
        );

        sendEmail(to, subject, body);
    }
}