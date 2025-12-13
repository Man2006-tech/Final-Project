package com.nustconnect.backend.DTOs.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileResponseDTO {
    private Long profileId;
    private Long userId;
    private String bio;
    private String profilePicture;
    private String coverPhoto;
    private LocalDate dateOfBirth;
    private Integer yearOfStudy;
    private String contactNo;
    private String major;
    private String interests;
}