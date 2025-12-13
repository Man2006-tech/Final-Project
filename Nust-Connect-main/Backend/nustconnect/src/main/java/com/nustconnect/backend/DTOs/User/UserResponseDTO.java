package com.nustconnect.backend.DTOs.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponseDTO {
    private Long userId;
    private String name;
    private String email;
    private String studentId;
    private String department;
    private String phoneNumber;
    private String role;
    private Boolean isActive;
    private Boolean isEmailVerified;
    
    // Extended fields for Profile view
    private String phone;        // Maps to phoneNumber
    private String cmsId;        // Maps to studentId
    private String address;
    private String semester;
    private String profilePicture;
}