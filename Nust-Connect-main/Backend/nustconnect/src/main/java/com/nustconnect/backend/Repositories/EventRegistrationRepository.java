package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Enums.EventRegistrationStatus;
import com.nustconnect.backend.Models.EventRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventRegistrationRepository extends JpaRepository<EventRegistration, Long> {
    List<EventRegistration> findByEventEventId(Long eventId);
    List<EventRegistration> findByUserUserId(Long userId);
    Optional<EventRegistration> findByEventEventIdAndUserUserId(Long eventId, Long userId);
    boolean existsByEventEventIdAndUserUserId(Long eventId, Long userId);
    Long countByEventEventIdAndStatus(Long eventId, EventRegistrationStatus status);
    List<EventRegistration> findByEventEventIdAndStatus(Long eventId, EventRegistrationStatus status);
}
