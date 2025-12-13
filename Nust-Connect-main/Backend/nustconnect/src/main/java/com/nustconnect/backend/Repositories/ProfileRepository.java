package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Models.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProfileRepository extends JpaRepository<Profile, Long> {
    Optional<Profile> findByUserUserId(Long userId);
    List<Profile> findByYearOfStudy(Integer yearOfStudy);
}
