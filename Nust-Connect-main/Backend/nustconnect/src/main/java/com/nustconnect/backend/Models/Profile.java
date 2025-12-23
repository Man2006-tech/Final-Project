package com.nustconnect.backend.Models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long profileId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @JsonIgnore
    private User user;

    @Size(max = 500, message = "Bio too long")
    @Column(length = 500)
    private String bio;

    @Size(max = 500)
    @Column(name = "profile_picture", length = 500)
    private String profilePicture;

    @Size(max = 500)
    @Column(name = "cover_photo", length = 500)
    private String coverPhoto;

    @Past(message = "Date of birth must be in the past")
    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Min(value = 1, message = "Year of study must be at least 1")
    @Max(value = 8, message = "Year of study cannot exceed 8")
    @Column(name = "year_of_study")
    private Integer yearOfStudy;

    @Pattern(regexp = "^[0-9+\\-()\\s]*$", message = "Invalid phone number format")
    @Size(max = 20)
    @Column(name = "contact_no", length = 20)
    private String contactNo;

    @Size(max = 100)
    @Column(name = "major", length = 100)
    private String major;

    @Size(max = 200)
    @Column(name = "interests", length = 200)
    private String interests;

    @Size(max = 255)
    @Column(name = "address")
    private String address;

    @Pattern(regexp = "^[0-9]*$", message = "Semester must contain only numbers")
    @Size(max = 50)
    @Column(name = "semester")
    private String semester;

    // Manual getters and setters to resolve Lombok issues
    public Long getProfileId() {
        return profileId;
    }

    public void setProfileId(Long profileId) {
        this.profileId = profileId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getProfilePicture() {
        return profilePicture;
    }

    public void setProfilePicture(String profilePicture) {
        this.profilePicture = profilePicture;
    }

    public String getCoverPhoto() {
        return coverPhoto;
    }

    public void setCoverPhoto(String coverPhoto) {
        this.coverPhoto = coverPhoto;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Integer getYearOfStudy() {
        return yearOfStudy;
    }

    public void setYearOfStudy(Integer yearOfStudy) {
        this.yearOfStudy = yearOfStudy;
    }

    public String getContactNo() {
        return contactNo;
    }

    public void setContactNo(String contactNo) {
        this.contactNo = contactNo;
    }

    public String getMajor() {
        return major;
    }

    public void setMajor(String major) {
        this.major = major;
    }

    public String getInterests() {
        return interests;
    }

    public void setInterests(String interests) {
        this.interests = interests;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }
}