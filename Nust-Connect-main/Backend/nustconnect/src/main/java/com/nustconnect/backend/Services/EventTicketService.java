package com.nustconnect.backend.Services;

import com.nustconnect.backend.Models.Event;
import com.nustconnect.backend.Models.EventTicket;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Repositories.EventRepository;
import com.nustconnect.backend.Repositories.EventTicketRepository;
import com.nustconnect.backend.Repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class EventTicketService {

    private final EventTicketRepository ticketRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    // ==================== CREATE ====================
    public EventTicket generateTicket(Long userId, Long eventId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        // Check if user already has a ticket for this event
        if (ticketRepository.findByEventEventIdAndUserUserId(eventId, userId).isPresent()) {
            throw new IllegalArgumentException("User already has a ticket for this event");
        }

        // Generate unique QR code and ticket number
        String qrCode = generateQRCode();
        String ticketNumber = generateTicketNumber();

        EventTicket ticket = EventTicket.builder()
                .event(event)
                .user(user)
                .qrCode(qrCode)
                .ticketNumber(ticketNumber)
                .isCheckedIn(false)
                .build();

        return ticketRepository.save(ticket);
    }

    // ==================== READ ====================
    public EventTicket getTicketById(Long ticketId) {
        return ticketRepository.findById(ticketId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found"));
    }

    public EventTicket getTicketByQRCode(String qrCode) {
        return ticketRepository.findByQrCode(qrCode)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with QR code"));
    }

    public EventTicket getTicketByTicketNumber(String ticketNumber) {
        return ticketRepository.findByTicketNumber(ticketNumber)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found with ticket number"));
    }

    public EventTicket getUserEventTicket(Long eventId, Long userId) {
        return ticketRepository.findByEventEventIdAndUserUserId(eventId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Ticket not found for user and event"));
    }

    public List<EventTicket> getTicketsByEvent(Long eventId) {
        return ticketRepository.findByEventEventId(eventId);
    }

    public List<EventTicket> getTicketsByUser(Long userId) {
        return ticketRepository.findByUserUserId(userId);
    }

    public List<EventTicket> getCheckedInTickets(Long eventId) {
        return ticketRepository.findByEventEventId(eventId).stream()
                .filter(EventTicket::getIsCheckedIn)
                .toList();
    }

    public List<EventTicket> getUncheckedTickets(Long eventId) {
        return ticketRepository.findByEventEventId(eventId).stream()
                .filter(ticket -> !ticket.getIsCheckedIn())
                .toList();
    }

    // ==================== CHECK-IN ====================
    public EventTicket checkInTicket(Long ticketId) {
        EventTicket ticket = getTicketById(ticketId);

        if (ticket.getIsCheckedIn()) {
            throw new IllegalArgumentException("Ticket already checked in");
        }

        ticket.checkIn();
        return ticketRepository.save(ticket);
    }

    public EventTicket checkInByQRCode(String qrCode) {
        EventTicket ticket = getTicketByQRCode(qrCode);

        if (ticket.getIsCheckedIn()) {
            throw new IllegalArgumentException("Ticket already checked in");
        }

        ticket.checkIn();
        return ticketRepository.save(ticket);
    }

    public EventTicket checkInByTicketNumber(String ticketNumber) {
        EventTicket ticket = getTicketByTicketNumber(ticketNumber);

        if (ticket.getIsCheckedIn()) {
            throw new IllegalArgumentException("Ticket already checked in");
        }

        ticket.checkIn();
        return ticketRepository.save(ticket);
    }

    // ==================== DELETE ====================
    public void deleteTicket(Long ticketId) {
        if (!ticketRepository.existsById(ticketId)) {
            throw new IllegalArgumentException("Ticket not found");
        }
        ticketRepository.deleteById(ticketId);
    }

    public void cancelTicket(Long eventId, Long userId) {
        EventTicket ticket = getUserEventTicket(eventId, userId);
        ticketRepository.delete(ticket);
    }

    // ==================== VALIDATION ====================
    public boolean hasUserTicket(Long eventId, Long userId) {
        return ticketRepository.findByEventEventIdAndUserUserId(eventId, userId).isPresent();
    }

    public boolean isTicketValid(String qrCode) {
        return ticketRepository.findByQrCode(qrCode).isPresent();
    }

    public boolean isTicketCheckedIn(Long ticketId) {
        EventTicket ticket = getTicketById(ticketId);
        return ticket.getIsCheckedIn();
    }

    public boolean isTicketOwner(Long ticketId, Long userId) {
        EventTicket ticket = getTicketById(ticketId);
        return ticket.getUser().getUserId().equals(userId);
    }

    // ==================== STATISTICS ====================
    public long getTotalTicketCount() {
        return ticketRepository.count();
    }

    public long getEventTicketCount(Long eventId) {
        return ticketRepository.findByEventEventId(eventId).size();
    }

    public long getUserTicketCount(Long userId) {
        return ticketRepository.findByUserUserId(userId).size();
    }

    public long getCheckedInCount(Long eventId) {
        return ticketRepository.countCheckedInTicketsByEvent(eventId, true);
    }

    public long getUncheckedCount(Long eventId) {
        return ticketRepository.countCheckedInTicketsByEvent(eventId, false);
    }

    public double getCheckInPercentage(Long eventId) {
        long total = getEventTicketCount(eventId);
        if (total == 0) return 0.0;

        long checkedIn = getCheckedInCount(eventId);
        return (double) checkedIn / total * 100;
    }

    // ==================== HELPER METHODS ====================
    private String generateQRCode() {
        // Generate a unique QR code (UUID-based)
        return "QR-" + UUID.randomUUID().toString();
    }

    private String generateTicketNumber() {
        // Generate a unique ticket number
        return "TKT-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    public List<User> getAttendees(Long eventId) {
        return getCheckedInTickets(eventId).stream()
                .map(EventTicket::getUser)
                .toList();
    }

    // ==================== BULK OPERATIONS ====================
    public List<EventTicket> generateTicketsForRegisteredUsers(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        // This would integrate with EventRegistrationService to get registered users
        // For now, returning empty list as placeholder
        return List.of();
    }

    public void checkInMultipleTickets(List<String> qrCodes) {
        qrCodes.forEach(this::checkInByQRCode);
    }

    // ==================== EXPORT ====================
    public List<EventTicket> getEventTicketsForExport(Long eventId) {
        // Return all tickets for an event (for admin export/reporting)
        return getTicketsByEvent(eventId);
    }

    public String getTicketDetails(Long ticketId) {
        EventTicket ticket = getTicketById(ticketId);
        return String.format(
                "Ticket #%s | Event: %s | User: %s | Checked In: %s",
                ticket.getTicketNumber(),
                ticket.getEvent().getTitle(),
                ticket.getUser().getName(),
                ticket.getIsCheckedIn() ? "Yes" : "No"
        );
    }
}