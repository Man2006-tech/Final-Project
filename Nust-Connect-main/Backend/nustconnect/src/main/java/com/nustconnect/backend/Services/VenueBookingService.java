package com.nustconnect.backend.Services;

import com.nustconnect.backend.Enums.VenueBookingStatus;
import com.nustconnect.backend.Models.Event;
import com.nustconnect.backend.Models.User;
import com.nustconnect.backend.Models.Venue;
import com.nustconnect.backend.Models.VenueBooking;
import com.nustconnect.backend.Repositories.EventRepository;
import com.nustconnect.backend.Repositories.UserRepository;
import com.nustconnect.backend.Repositories.VenueBookingRepository;
import com.nustconnect.backend.Repositories.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VenueBookingService {

    private final VenueBookingRepository bookingRepository;
    private final VenueRepository venueRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    // ==================== CREATE ====================
    public VenueBooking createBooking(Long userId, Long venueId, Long eventId, VenueBooking booking) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        Venue venue = venueRepository.findById(venueId)
                .orElseThrow(() -> new IllegalArgumentException("Venue not found"));
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new IllegalArgumentException("Event not found"));

        // Validate dates
        if (booking.getEndTime().isBefore(booking.getStartTime())) {
            throw new IllegalArgumentException("End time cannot be before start time");
        }

        // Check for conflicts
        List<VenueBooking> conflicts = bookingRepository.findConflictingBookings(
                venueId, booking.getStartTime(), booking.getEndTime());

        if (!conflicts.isEmpty()) {
            throw new IllegalArgumentException("Venue is already booked for this time slot");
        }

        booking.setUser(user);
        booking.setVenue(venue);
        booking.setEvent(event);
        booking.setApprovalStatus(VenueBookingStatus.PENDING);

        return bookingRepository.save(booking);
    }

    // ==================== READ ====================
    public VenueBooking getBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found"));
    }

    public List<VenueBooking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<VenueBooking> getBookingsByVenue(Long venueId) {
        return bookingRepository.findByVenueVenueId(venueId);
    }

    public List<VenueBooking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserUserId(userId);
    }

    public List<VenueBooking> getBookingsByEvent(Long eventId) {
        return bookingRepository.findByEventEventId(eventId);
    }

    public List<VenueBooking> getBookingsByStatus(VenueBookingStatus status) {
        return bookingRepository.findByApprovalStatus(status);
    }

    public List<VenueBooking> getPendingBookings() {
        return bookingRepository.findByApprovalStatus(VenueBookingStatus.PENDING);
    }

    public List<VenueBooking> getApprovedBookings() {
        return bookingRepository.findByApprovalStatus(VenueBookingStatus.APPROVED);
    }

    public List<VenueBooking> getRejectedBookings() {
        return bookingRepository.findByApprovalStatus(VenueBookingStatus.REJECTED);
    }

    // ==================== UPDATE ====================
    public VenueBooking updateBooking(Long bookingId, VenueBooking updatedBooking) {
        VenueBooking existingBooking = getBookingById(bookingId);

        if (updatedBooking.getStartTime() != null) {
            existingBooking.setStartTime(updatedBooking.getStartTime());
        }
        if (updatedBooking.getEndTime() != null) {
            existingBooking.setEndTime(updatedBooking.getEndTime());
        }
        if (updatedBooking.getSpecialRequirements() != null) {
            existingBooking.setSpecialRequirements(updatedBooking.getSpecialRequirements());
        }

        // Re-check for conflicts if times changed
        if (updatedBooking.getStartTime() != null || updatedBooking.getEndTime() != null) {
            List<VenueBooking> conflicts = bookingRepository.findConflictingBookings(
                    existingBooking.getVenue().getVenueId(),
                    existingBooking.getStartTime(),
                    existingBooking.getEndTime());

            // Remove current booking from conflicts
            conflicts.removeIf(b -> b.getBookingId().equals(bookingId));

            if (!conflicts.isEmpty()) {
                throw new IllegalArgumentException("Venue is already booked for this time slot");
            }
        }

        return bookingRepository.save(existingBooking);
    }

    // ==================== APPROVAL ====================
    public VenueBooking approveBooking(Long bookingId) {
        VenueBooking booking = getBookingById(bookingId);
        booking.approve();
        return bookingRepository.save(booking);
    }

    public VenueBooking rejectBooking(Long bookingId, String reason) {
        VenueBooking booking = getBookingById(bookingId);
        booking.reject(reason);
        return bookingRepository.save(booking);
    }

    // ==================== DELETE ====================
    public void deleteBooking(Long bookingId) {
        if (!bookingRepository.existsById(bookingId)) {
            throw new IllegalArgumentException("Booking not found");
        }
        bookingRepository.deleteById(bookingId);
    }

    public void cancelBooking(Long bookingId) {
        VenueBooking booking = getBookingById(bookingId);
        bookingRepository.delete(booking);
    }

    // ==================== VALIDATION ====================
    public boolean isVenueAvailable(Long venueId, LocalDateTime start, LocalDateTime end) {
        List<VenueBooking> conflicts = bookingRepository.findConflictingBookings(venueId, start, end);
        return conflicts.isEmpty();
    }

    public boolean isBookingOwner(Long bookingId, Long userId) {
        VenueBooking booking = getBookingById(bookingId);
        return booking.getUser().getUserId().equals(userId);
    }

    public boolean isBookingApproved(Long bookingId) {
        VenueBooking booking = getBookingById(bookingId);
        return booking.isApproved();
    }

    public boolean isBookingPending(Long bookingId) {
        VenueBooking booking = getBookingById(bookingId);
        return booking.isPending();
    }

    // ==================== STATISTICS ====================
    public long getTotalBookingCount() {
        return bookingRepository.count();
    }

    public long getApprovedBookingCount() {
        return bookingRepository.findByApprovalStatus(VenueBookingStatus.APPROVED).size();
    }

    public long getPendingBookingCount() {
        return bookingRepository.findByApprovalStatus(VenueBookingStatus.PENDING).size();
    }

    public long getUserBookingCount(Long userId) {
        return bookingRepository.findByUserUserId(userId).size();
    }

    public long getVenueBookingCount(Long venueId) {
        return bookingRepository.findByVenueVenueId(venueId).size();
    }

    // ==================== HELPER METHODS ====================
    public List<VenueBooking> getUpcomingBookings(Long venueId) {
        return bookingRepository.findByVenueVenueId(venueId).stream()
                .filter(booking -> booking.getStartTime().isAfter(LocalDateTime.now()))
                .filter(VenueBooking::isApproved)
                .toList();
    }

    public List<VenueBooking> getPastBookings(Long venueId) {
        return bookingRepository.findByVenueVenueId(venueId).stream()
                .filter(booking -> booking.getEndTime().isBefore(LocalDateTime.now()))
                .toList();
    }

    public List<VenueBooking> getTodaysBookings(Long venueId) {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);

        return bookingRepository.findByVenueVenueId(venueId).stream()
                .filter(booking -> !booking.getStartTime().isBefore(startOfDay) &&
                        !booking.getStartTime().isAfter(endOfDay))
                .filter(VenueBooking::isApproved)
                .toList();
    }

    public List<LocalDateTime[]> getAvailableTimeSlots(Long venueId, LocalDateTime date) {
        // This could return available time slots for a given date
        // Implementation depends on business logic (e.g., 1-hour slots from 8 AM to 6 PM)
        // For now, returning a placeholder
        return List.of();
    }
}