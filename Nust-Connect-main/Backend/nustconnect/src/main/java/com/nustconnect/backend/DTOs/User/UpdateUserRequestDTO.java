package com.nustconnect.backend.DTOs.User;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserRequestDTO {
    @Size(min = 2, max = 100)
    private String name;
    private String email;
    private String department;
    private String phone;       // Maps to phoneNumber
    private String cmsId;       // Maps to studentId
    private String address;
    private String semester;
    private String profilePicture;
    private String bio;
    private String phoneNumber; // Keeping original for backward compat if needed, though Profile.jsx uses phone
}