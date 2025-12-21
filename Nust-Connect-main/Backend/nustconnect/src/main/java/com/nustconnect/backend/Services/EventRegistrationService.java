package com.nustconnect.backend.Services;

import com.nustconnect.backend.Enums.EventRegistrationStatus;
import com.nustconnect.backend.Models.Event;
import com.nustconnect.backend.Models.EventRegistration;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.EventRegistrationRepository;
import com.nustconnect.backend.Repositories.EventRepository;
import com.nustconnect.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EventRegistrationService {

    private final EventRegistrationRepository registrationRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final EventService eventService;
    private final NotificationService notificationService;

    // ==================== CREATE/REGISTER ====================
    public EventRegistration registerForEvent(Long userId, Long eventId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        if (registrationRepository.existsByEventEventIdAndUserUserId(eventId, userId)) {
            throw new IllegalArgumentException("User is already registered for this event");
        }

        if (event.isFull()) {
            return waitlistForEvent(userId, eventId);
        }

        if (!event.canRegister()) {
            throw new IllegalArgumentException("Event registration is not available");
        }

        EventRegistration registration = EventRegistration.builder()
                .event(event)
                .user(user)
                .status(EventRegistrationStatus.REGISTERED)
                .attended(false)
                .build();

        EventRegistration savedRegistration = registrationRepository.save(registration);

        eventService.incrementAttendees(eventId);

        // Notify User
        notificationService.createNotificationWithEntity(
                userId,
                com.nustconnect.backend.Enums.NotificationType.EVENT,
                "Ticket confirmed for " + event.getTitle(),
                eventId,
                "/events/" + eventId);

        return savedRegistration;
    }

    public EventRegistration waitlistForEvent(Long userId, Long eventId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        EventRegistration registration = EventRegistration.builder()
                .event(event)
                .user(user)
                .status(EventRegistrationStatus.WAITLISTED)
                .attended(false)
                .build();

        return registrationRepository.save(registration);
    }

    // ==================== READ ====================
    public EventRegistration getRegistrationById(Long registrationId) {
        return registrationRepository.findById(registrationId)
                .orElseThrow(() -> new IllegalArgumentException("Registration not found"));
    }

    public EventRegistration getUserEventRegistration(Long eventId, Long userId) {
        return registrationRepository.findByEventEventIdAndUserUserId(eventId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Registration not found"));
    }

    public List<EventRegistration> getEventRegistrations(Long eventId) {
        return registrationRepository.findByEventEventId(eventId);
    }

    public List<EventRegistration> getUserRegistrations(Long userId) {
        return registrationRepository.findByUserUserId(userId);
    }

    public List<EventRegistration> getRegisteredUsers(Long eventId) {
        return registrationRepository.findByEventEventIdAndStatus(eventId, EventRegistrationStatus.REGISTERED);
    }

    public List<EventRegistration> getWaitlistedUsers(Long eventId) {
        return registrationRepository.findByEventEventIdAndStatus(eventId, EventRegistrationStatus.WAITLISTED);
    }

    public List<EventRegistration> getCanceledRegistrations(Long eventId) {
        return registrationRepository.findByEventEventIdAndStatus(eventId, EventRegistrationStatus.CANCELED);
    }

    public Long getRegisteredCount(Long eventId) {
        return registrationRepository.countByEventEventIdAndStatus(eventId, EventRegistrationStatus.REGISTERED);
    }

    public Long getWaitlistCount(Long eventId) {
        return registrationRepository.countByEventEventIdAndStatus(eventId, EventRegistrationStatus.WAITLISTED);
    }

    // ==================== UPDATE ====================
    public EventRegistration markAttended(Long registrationId) {
        EventRegistration registration = getRegistrationById(registrationId);
        registration.markAttended();
        return registrationRepository.save(registration);
    }

    public EventRegistration markAttendedByUser(Long eventId, Long userId) {
        EventRegistration registration = getUserEventRegistration(eventId, userId);
        registration.markAttended();
        return registrationRepository.save(registration);
    }

    // ==================== CANCEL ====================
    public void cancelRegistration(Long registrationId, String reason) {
        EventRegistration registration = getRegistrationById(registrationId);
        Long eventId = registration.getEvent().getEventId();

        registration.cancel(reason);
        registrationRepository.save(registration);

        // Decrement event attendee count
        eventService.decrementAttendees(eventId);

        // Move first waitlisted user to registered
        promoteFromWaitlist(eventId);
    }

    public void cancelUserRegistration(Long eventId, Long userId, String reason) {
        EventRegistration registration = getUserEventRegistration(eventId, userId);
        cancelRegistration(registration.getRegistrationId(), reason);
    }

    // ==================== WAITLIST MANAGEMENT ====================
    public void promoteFromWaitlist(Long eventId) {
        List<EventRegistration> waitlisted = getWaitlistedUsers(eventId);

        if (!waitlisted.isEmpty()) {
            EventRegistration firstInWaitlist = waitlisted.get(0);
            firstInWaitlist.register();
            registrationRepository.save(firstInWaitlist);

            // Increment attendee count
            eventService.incrementAttendees(eventId);
        }
    }

    public EventRegistration moveToWaitlist(Long registrationId) {
        EventRegistration registration = getRegistrationById(registrationId);
        Long eventId = registration.getEvent().getEventId();

        registration.waitlist();
        registrationRepository.save(registration);

        // Decrement attendee count
        eventService.decrementAttendees(eventId);

        return registration;
    }

    // ==================== DELETE ====================
    public void deleteRegistration(Long registrationId) {
        EventRegistration registration = getRegistrationById(registrationId);
        Long eventId = registration.getEvent().getEventId();

        registrationRepository.delete(registration);

        // Decrement attendee count if registered
        if (registration.getStatus() == EventRegistrationStatus.REGISTERED) {
            eventService.decrementAttendees(eventId);
        }
    }

    // ==================== VALIDATION ====================
    public boolean isUserRegistered(Long eventId, Long userId) {
        return registrationRepository.findByEventEventIdAndUserUserId(eventId, userId)
                .map(reg -> reg.getStatus() == EventRegistrationStatus.REGISTERED)
                .orElse(false);
    }

    public boolean isUserWaitlisted(Long eventId, Long userId) {
        return registrationRepository.findByEventEventIdAndUserUserId(eventId, userId)
                .map(reg -> reg.getStatus() == EventRegistrationStatus.WAITLISTED)
                .orElse(false);
    }

    public boolean hasUserAttended(Long eventId, Long userId) {
        return registrationRepository.findByEventEventIdAndUserUserId(eventId, userId)
                .map(EventRegistration::getAttended)
                .orElse(false);
    }

    // ==================== STATISTICS ====================
    public long getTotalRegistrationCount() {
        return registrationRepository.count();
    }

    public long getUserRegistrationCount(Long userId) {
        return registrationRepository.findByUserUserId(userId).size();
    }

    public long getEventAttendedCount(Long eventId) {
        return getEventRegistrations(eventId).stream()
                .filter(EventRegistration::getAttended)
                .count();
    }

    // ==================== HELPER METHODS ====================
    public List<User> getRegisteredUsersList(Long eventId) {
        return getRegisteredUsers(eventId).stream()
                .map(EventRegistration::getUser)
                .toList();
    }

    public List<Event> getUserRegisteredEvents(Long userId) {
        return getUserRegistrations(userId).stream()
                .filter(reg -> reg.getStatus() == EventRegistrationStatus.REGISTERED)
                .map(EventRegistration::getEvent)
                .toList();
    }
}