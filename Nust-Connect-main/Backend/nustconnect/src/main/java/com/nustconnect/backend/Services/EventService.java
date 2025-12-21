package com.nustconnect.backend.Services;

import com.nustconnect.backend.Enums.EventApprovalStatus;
import com.nustconnect.backend.Models.Club;
import com.nustconnect.backend.Models.Event;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Models.Venue;
import com.nustconnect.backend.Repositories.ClubRepository;
import com.nustconnect.backend.Repositories.EventRepository;
import com.nustconnect.backend.Repositories.UserRepository;
import com.nustconnect.backend.Repositories.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class EventService {

    private final EventRepository eventRepository;
    private final ClubRepository clubRepository;
    private final UserRepository userRepository;
    private final VenueRepository venueRepository;

    // ==================== CREATE ====================
    public Event createEvent(Long creatorId, Long clubId, Event event) {
        User creator = userRepository.findById(creatorId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Club club = clubRepository.findById(clubId)
                .orElseThrow(() -> new IllegalArgumentException("Club not found"));

        // Validate dates
        if (event.getEndTime().isBefore(event.getStartTime())) {
            throw new IllegalArgumentException("End time cannot be before start time");
        }

        event.setCreatedBy(creator);
        event.setClub(club);
        event.setCurrentAttendees(0);
        event.setApprovalStatus(EventApprovalStatus.PENDING);

        if (event.getVenue() != null && event.getVenue().getVenueId() != null) {
            Venue venue = venueRepository.findById(event.getVenue().getVenueId())
                    .orElseThrow(() -> new IllegalArgumentException("Venue not found"));
            event.setVenue(venue);
        }

        return eventRepository.save(event);
    }

    // ==================== READ ====================
    public Event getEventById(Long eventId) {
        return eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found with id: " + eventId));
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Page<Event> getAllActiveEvents(Pageable pageable) {
        return eventRepository.findAllActiveEvents(pageable);
    }

    public List<Event> getEventsByClub(Long clubId) {
        return eventRepository.findByClubClubId(clubId);
    }

    public List<Event> getEventsByCreator(Long creatorId) {
        return eventRepository.findByCreatedByUserId(creatorId);
    }

    public List<Event> getEventsByApprovalStatus(EventApprovalStatus status) {
        return eventRepository.findByApprovalStatus(status);
    }

    public Page<Event> getApprovedEvents(Pageable pageable) {
        return eventRepository.findByApprovalStatusOrderByStartTimeDesc(EventApprovalStatus.APPROVED, pageable);
    }

    public List<Event> getPendingEvents() {
        return eventRepository.findByApprovalStatus(EventApprovalStatus.PENDING);
    }

    public List<Event> getUpcomingEvents() {
        return eventRepository.findUpcomingEvents(LocalDateTime.now());
    }

    public List<Event> getEventsBetweenDates(LocalDateTime start, LocalDateTime end) {
        return eventRepository.findByStartTimeBetween(start, end);
    }

    // ==================== UPDATE ====================
    public Event updateEvent(Long eventId, Event updatedEvent) {
        Event existingEvent = getEventById(eventId);

        if (updatedEvent.getTitle() != null) {
            existingEvent.setTitle(updatedEvent.getTitle());
        }
        if (updatedEvent.getDescription() != null) {
            existingEvent.setDescription(updatedEvent.getDescription());
        }
        if (updatedEvent.getStartTime() != null) {
            existingEvent.setStartTime(updatedEvent.getStartTime());
        }
        if (updatedEvent.getEndTime() != null) {
            existingEvent.setEndTime(updatedEvent.getEndTime());
        }
        if (updatedEvent.getMaxAttendees() != null) {
            existingEvent.setMaxAttendees(updatedEvent.getMaxAttendees());
        }
        if (updatedEvent.getIsPublic() != null) {
            existingEvent.setIsPublic(updatedEvent.getIsPublic());
        }
        if (updatedEvent.getEventImageUrl() != null) {
            existingEvent.setEventImageUrl(updatedEvent.getEventImageUrl());
        }
        if (updatedEvent.getTicketPrice() != null) {
            existingEvent.setTicketPrice(updatedEvent.getTicketPrice());
        }

        return eventRepository.save(existingEvent);
    }

    // ==================== APPROVAL ====================
    public Event approveEvent(Long eventId) {
        Event event = getEventById(eventId);
        event.setApprovalStatus(EventApprovalStatus.APPROVED);
        event.setRejectionReason(null);
        return eventRepository.save(event);
    }

    public Event rejectEvent(Long eventId, String reason) {
        Event event = getEventById(eventId);
        event.setApprovalStatus(EventApprovalStatus.REJECTED);
        event.setRejectionReason(reason);
        return eventRepository.save(event);
    }

    // ==================== DELETE ====================
    public void deleteEvent(Long eventId) {
        Event event = getEventById(eventId);
        event.softDelete();
        eventRepository.save(event);
    }

    public void hardDeleteEvent(Long eventId) {
        if (!eventRepository.existsById(eventId)) {
            throw new IllegalArgumentException("Event not found");
        }
        eventRepository.deleteById(eventId);
    }

    // ==================== ATTENDEE MANAGEMENT ====================
    public void incrementAttendees(Long eventId) {
        Event event = getEventById(eventId);
        event.incrementAttendees();
        eventRepository.save(event);
    }

    public void decrementAttendees(Long eventId) {
        Event event = getEventById(eventId);
        event.decrementAttendees();
        eventRepository.save(event);
    }

    // ==================== VALIDATION ====================
    public boolean canUserRegister(Long eventId, Long userId) {
        Event event = getEventById(eventId);
        return event.canRegister();
    }

    public boolean isEventFull(Long eventId) {
        Event event = getEventById(eventId);
        return event.isFull();
    }

    public boolean isEventCreator(Long eventId, Long userId) {
        Event event = getEventById(eventId);
        return event.getCreatedBy().getUserId().equals(userId);
    }

    public boolean isEventApproved(Long eventId) {
        Event event = getEventById(eventId);
        return event.getApprovalStatus() == EventApprovalStatus.APPROVED;
    }

    public boolean isEventPending(Long eventId) {
        Event event = getEventById(eventId);
        return event.getApprovalStatus() == EventApprovalStatus.PENDING;
    }

    public boolean isEventDeleted(Long eventId) {
        Event event = getEventById(eventId);
        return event.isDeleted();
    }

    // ==================== STATISTICS ====================
    public long getTotalEventCount() {
        return eventRepository.count();
    }

    public long getApprovedEventCount() {
        return eventRepository.findByApprovalStatus(EventApprovalStatus.APPROVED).size();
    }

    public long getPendingEventCount() {
        return eventRepository.findByApprovalStatus(EventApprovalStatus.PENDING).size();
    }

    public long getClubEventCount(Long clubId) {
        return eventRepository.findByClubClubId(clubId).size();
    }

    public Integer getEventAttendeeCount(Long eventId) {
        Event event = getEventById(eventId);
        return event.getCurrentAttendees();
    }

    // ==================== HELPER METHODS ====================
    public List<Event> getTodaysEvents() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        return eventRepository.findByStartTimeBetween(startOfDay, endOfDay);
    }

    public List<Event> getThisWeeksEvents() {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime weekLater = now.plusWeeks(1);
        return eventRepository.findByStartTimeBetween(now, weekLater);
    }
}