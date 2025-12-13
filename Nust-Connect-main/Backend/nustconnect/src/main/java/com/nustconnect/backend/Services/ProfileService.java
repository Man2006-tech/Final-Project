package com.nustconnect.backend.Services;

import com.nustconnect.backend.Models.Profile;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.ProfileRepository;
import com.nustconnect.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfileService {

    private final ProfileRepository profileRepository;
    private final UserRepository userRepository;

    // ==================== CREATE ====================
    public Profile createProfile(Long userId, Profile profile) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

        // Check if profile already exists
        if (profileRepository.findByUserUserId(userId).isPresent()) {
            throw new IllegalArgumentException("Profile already exists for this user");
        }

        profile.setUser(user);
        return profileRepository.save(profile);
    }

    // ==================== READ ====================
    public Profile getProfileById(Long profileId) {
        return profileRepository.findById(profileId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found with id: " + profileId));
    }

    public Profile getProfileByUserId(Long userId) {
        return profileRepository.findByUserUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("Profile not found for user id: " + userId));
    }

    public List<Profile> getAllProfiles() {
        return profileRepository.findAll();
    }

    public List<Profile> getProfilesByYearOfStudy(Integer year) {
        return profileRepository.findByYearOfStudy(year);
    }

    // ==================== UPDATE ====================
    public Profile updateProfile(Long userId, Profile updatedProfile) {
        Profile existingProfile = getProfileByUserId(userId);

        // Update fields if provided
        if (updatedProfile.getBio() != null) {
            existingProfile.setBio(updatedProfile.getBio());
        }
        if (updatedProfile.getProfilePicture() != null) {
            existingProfile.setProfilePicture(updatedProfile.getProfilePicture());
        }
        if (updatedProfile.getCoverPhoto() != null) {
            existingProfile.setCoverPhoto(updatedProfile.getCoverPhoto());
        }
        if (updatedProfile.getDateOfBirth() != null) {
            existingProfile.setDateOfBirth(updatedProfile.getDateOfBirth());
        }
        if (updatedProfile.getYearOfStudy() != null) {
            existingProfile.setYearOfStudy(updatedProfile.getYearOfStudy());
        }
        if (updatedProfile.getContactNo() != null) {
            existingProfile.setContactNo(updatedProfile.getContactNo());
        }
        if (updatedProfile.getMajor() != null) {
            existingProfile.setMajor(updatedProfile.getMajor());
        }
        if (updatedProfile.getInterests() != null) {
            existingProfile.setInterests(updatedProfile.getInterests());
        }

        return profileRepository.save(existingProfile);
    }

    public Profile updateProfilePicture(Long userId, String pictureUrl) {
        Profile profile = getProfileByUserId(userId);
        profile.setProfilePicture(pictureUrl);
        return profileRepository.save(profile);
    }

    public Profile updateCoverPhoto(Long userId, String coverPhotoUrl) {
        Profile profile = getProfileByUserId(userId);
        profile.setCoverPhoto(coverPhotoUrl);
        return profileRepository.save(profile);
    }

    public Profile updateBio(Long userId, String bio) {
        Profile profile = getProfileByUserId(userId);
        profile.setBio(bio);
        return profileRepository.save(profile);
    }

    // ==================== DELETE ====================
    public void deleteProfile(Long profileId) {
        if (!profileRepository.existsById(profileId)) {
            throw new IllegalArgumentException("Profile not found with id: " + profileId);
        }
        profileRepository.deleteById(profileId);
    }

    public void deleteProfileByUserId(Long userId) {
        Profile profile = getProfileByUserId(userId);
        profileRepository.delete(profile);
    }

    // ==================== VALIDATION ====================
    public boolean profileExists(Long userId) {
        return profileRepository.findByUserUserId(userId).isPresent();
    }

    // ==================== HELPER METHODS ====================
    public Profile getOrCreateProfile(Long userId) {
        return profileRepository.findByUserUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new IllegalArgumentException("User not found"));
                    Profile newProfile = Profile.builder()
                            .user(user)
                            .build();
                    return profileRepository.save(newProfile);
                });
    }
}