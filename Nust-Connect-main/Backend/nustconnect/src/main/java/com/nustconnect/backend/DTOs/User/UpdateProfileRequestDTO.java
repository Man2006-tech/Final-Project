package com.nustconnect.backend.DTOs.User;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateProfileRequestDTO {
    @Size(max = 500)
    private String bio;

    private String profilePicture;
    private String coverPhoto;

    @Past
    private LocalDate dateOfBirth;

    @Min(1)
    @Max(8)
    private Integer yearOfStudy;

    @Size(max = 20)
    private String contactNo;

    @Size(max = 100)
    private String major;

    @Size(max = 200)
    private String interests;
}