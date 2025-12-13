package com.nustconnect.backend.Controllers;

import com.nustconnect.backend.DTOs.Event.*;
import com.nustconnect.backend.DTOs.Club.ClubSummaryDTO;
import com.nustconnect.backend.DTOs.User.UserSummaryDTO;
import com.nustconnect.backend.Models.*;
import com.nustconnect.backend.Services.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class EventController {

    private final EventService eventService;
    private final EventRegistrationService registrationService;
    private final EventTicketService ticketService;
    private final ProfileService profileService;

    @PostMapping
    public ResponseEntity<EventResponseDTO> createEvent(
            @RequestParam Long creatorId,
            @Valid @RequestBody CreateEventRequestDTO request) {
        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .startTime(request.getStartTime())
                .endTime(request.getEndTime())
                .maxAttendees(request.getMaxAttendees())
                .isPublic(request.getIsPublic())
                .eventImageUrl(request.getEventImageUrl())
                .ticketPrice(request.getTicketPrice())
                .hasTickets(request.getHasTickets())
                .requiresRegistration(request.getRequiresRegistration())
                .qrCodeRequired(request.getQrCodeRequired())
                .build();

        Event createdEvent = eventService.createEvent(creatorId, request.getClubId(), event);
        return ResponseEntity.status(HttpStatus.CREATED).body(mapToEventResponseDTO(createdEvent));
    }

    @GetMapping("/{eventId}")
    public ResponseEntity<EventResponseDTO> getEventById(@PathVariable Long eventId) {
        Event event = eventService.getEventById(eventId);
        return ResponseEntity.ok(mapToEventResponseDTO(event));
    }

    @GetMapping
    public ResponseEntity<Page<EventResponseDTO>> getAllEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<Event> events = eventService.getAllActiveEvents(PageRequest.of(page, size));
        return ResponseEntity.ok(events.map(this::mapToEventResponseDTO));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<EventResponseDTO>> getUpcomingEvents() {
        List<Event> events = eventService.getUpcomingEvents();
        return ResponseEntity.ok(events.stream().map(this::mapToEventResponseDTO).collect(Collectors.toList()));
    }

    @PatchMapping("/{eventId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EventResponseDTO> approveEvent(@PathVariable Long eventId) {
        Event event = eventService.approveEvent(eventId);
        return ResponseEntity.ok(mapToEventResponseDTO(event));
    }

    @PostMapping("/{eventId}/register")
    public ResponseEntity<EventRegistrationResponseDTO> registerForEvent(
            @PathVariable Long eventId,
            @RequestParam Long userId) {
        EventRegistration registration = registrationService.registerForEvent(userId, eventId);
        return ResponseEntity.ok(mapToRegistrationResponseDTO(registration));
    }

    @DeleteMapping("/{eventId}/unregister")
    public ResponseEntity<String> unregisterFromEvent(
            @PathVariable Long eventId,
            @RequestParam Long userId) {
        registrationService.cancelUserRegistration(eventId, userId, "User cancelled");
        return ResponseEntity.ok("Unregistered successfully");
    }

    @GetMapping("/{eventId}/registrations")
    public ResponseEntity<List<EventRegistrationResponseDTO>> getEventRegistrations(@PathVariable Long eventId) {
        List<EventRegistration> registrations = registrationService.getEventRegistrations(eventId);
        return ResponseEntity.ok(registrations.stream().map(this::mapToRegistrationResponseDTO).collect(Collectors.toList()));
    }

    private EventResponseDTO mapToEventResponseDTO(Event event) {
        return EventResponseDTO.builder()
                .eventId(event.getEventId())
                .title(event.getTitle())
                .description(event.getDescription())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .maxAttendees(event.getMaxAttendees())
                .currentAttendees(event.getCurrentAttendees())
                .isPublic(event.getIsPublic())
                .eventImageUrl(event.getEventImageUrl())
                .approvalStatus(event.getApprovalStatus())
                .rejectionReason(event.getRejectionReason())
                .ticketPrice(event.getTicketPrice())
                .hasTickets(event.getHasTickets())
                .requiresRegistration(event.getRequiresRegistration())
                .club(event.getClub() != null ? mapToClubSummaryDTO(event.getClub()) : null)
                .createdBy(mapToUserSummaryDTO(event.getCreatedBy()))
                .venueName(event.getVenue() != null ? event.getVenue().getName() : null)
                .createdAt(event.getCreatedAt())
                .build();
    }

    private EventRegistrationResponseDTO mapToRegistrationResponseDTO(EventRegistration registration) {
        return EventRegistrationResponseDTO.builder()
                .registrationId(registration.getRegistrationId())
                .event(mapToEventSummaryDTO(registration.getEvent()))
                .user(mapToUserSummaryDTO(registration.getUser()))
                .status(registration.getStatus())
                .attended(registration.getAttended())
                .registrationDate(registration.getCreatedAt())
                .build();
    }

    private EventSummaryDTO mapToEventSummaryDTO(Event event) {
        return EventSummaryDTO.builder()
                .eventId(event.getEventId())
                .title(event.getTitle())
                .eventImageUrl(event.getEventImageUrl())
                .startTime(event.getStartTime())
                .clubName(event.getClub() != null ? event.getClub().getName() : null)
                .currentAttendees(event.getCurrentAttendees())
                .maxAttendees(event.getMaxAttendees())
                .build();
    }

    private ClubSummaryDTO mapToClubSummaryDTO(Club club) {
        return ClubSummaryDTO.builder()
                .clubId(club.getClubId())
                .name(club.getName())
                .logoUrl(club.getLogoUrl())
                .category(club.getCategory())
                .memberCount(club.getMemberCount())
                .build();
    }

    private UserSummaryDTO mapToUserSummaryDTO(User user) {
        String profilePicture = null;
        try {
            Profile profile = profileService.getProfileByUserId(user.getUserId());
            profilePicture = profile.getProfilePicture();
        } catch (Exception e) {}
        return UserSummaryDTO.builder()
                .userId(user.getUserId())
                .name(user.getName())
                .profilePicture(profilePicture)
                .department(user.getDepartment())
                .build();
    }
}