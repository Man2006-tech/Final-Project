package com.nustconnect.backend.Controllers;

import com.nustconnect.backend.Enums.VenueBookingStatus;
import com.nustconnect.backend.Models.VenueBooking;
import com.nustconnect.backend.Services.VenueBookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/venue-bookings")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VenueBookingController {

    private final VenueBookingService bookingService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('FACULTY')")
    public ResponseEntity<VenueBooking> createBooking(
            @RequestParam Long userId,
            @RequestParam Long venueId,
            @RequestParam Long eventId,
            @Valid @RequestBody VenueBooking booking) {
        VenueBooking created = bookingService.createBooking(userId, venueId, eventId, booking);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<VenueBooking> getBookingById(@PathVariable Long bookingId) {
        VenueBooking booking = bookingService.getBookingById(bookingId);
        return ResponseEntity.ok(booking);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<VenueBooking>> getAllBookings() {
        List<VenueBooking> bookings = bookingService.getAllBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/venue/{venueId}")
    public ResponseEntity<List<VenueBooking>> getBookingsByVenue(@PathVariable Long venueId) {
        List<VenueBooking> bookings = bookingService.getBookingsByVenue(venueId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<VenueBooking>> getBookingsByUser(@PathVariable Long userId) {
        List<VenueBooking> bookings = bookingService.getBookingsByUser(userId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<List<VenueBooking>> getBookingsByEvent(@PathVariable Long eventId) {
        List<VenueBooking> bookings = bookingService.getBookingsByEvent(eventId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<VenueBooking>> getBookingsByStatus(@PathVariable VenueBookingStatus status) {
        List<VenueBooking> bookings = bookingService.getBookingsByStatus(status);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<VenueBooking>> getPendingBookings() {
        List<VenueBooking> bookings = bookingService.getPendingBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/approved")
    public ResponseEntity<List<VenueBooking>> getApprovedBookings() {
        List<VenueBooking> bookings = bookingService.getApprovedBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/rejected")
    public ResponseEntity<List<VenueBooking>> getRejectedBookings() {
        List<VenueBooking> bookings = bookingService.getRejectedBookings();
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/venue/{venueId}/upcoming")
    public ResponseEntity<List<VenueBooking>> getUpcomingBookings(@PathVariable Long venueId) {
        List<VenueBooking> bookings = bookingService.getUpcomingBookings(venueId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/venue/{venueId}/past")
    public ResponseEntity<List<VenueBooking>> getPastBookings(@PathVariable Long venueId) {
        List<VenueBooking> bookings = bookingService.getPastBookings(venueId);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/venue/{venueId}/today")
    public ResponseEntity<List<VenueBooking>> getTodaysBookings(@PathVariable Long venueId) {
        List<VenueBooking> bookings = bookingService.getTodaysBookings(venueId);
        return ResponseEntity.ok(bookings);
    }

    @PutMapping("/{bookingId}")
    public ResponseEntity<VenueBooking> updateBooking(
            @PathVariable Long bookingId,
            @Valid @RequestBody VenueBooking booking) {
        VenueBooking updated = bookingService.updateBooking(bookingId, booking);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{bookingId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VenueBooking> approveBooking(@PathVariable Long bookingId) {
        VenueBooking booking = bookingService.approveBooking(bookingId);
        return ResponseEntity.ok(booking);
    }

    @PatchMapping("/{bookingId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<VenueBooking> rejectBooking(
            @PathVariable Long bookingId,
            @RequestBody Map<String, String> payload) {
        String reason = payload.getOrDefault("reason", "No reason provided");
        VenueBooking booking = bookingService.rejectBooking(bookingId, reason);
        return ResponseEntity.ok(booking);
    }

    @DeleteMapping("/{bookingId}/cancel")
    public ResponseEntity<String> cancelBooking(@PathVariable Long bookingId) {
        bookingService.cancelBooking(bookingId);
        return ResponseEntity.ok("Booking cancelled successfully");
    }

    @DeleteMapping("/{bookingId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteBooking(@PathVariable Long bookingId) {
        bookingService.deleteBooking(bookingId);
        return ResponseEntity.ok("Booking deleted successfully");
    }

    @GetMapping("/stats/total")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getTotalBookingCount() {
        return ResponseEntity.ok(bookingService.getTotalBookingCount());
    }

    @GetMapping("/stats/approved")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getApprovedBookingCount() {
        return ResponseEntity.ok(bookingService.getApprovedBookingCount());
    }

    @GetMapping("/stats/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getPendingBookingCount() {
        return ResponseEntity.ok(bookingService.getPendingBookingCount());
    }

    @GetMapping("/stats/user/{userId}")
    public ResponseEntity<Long> getUserBookingCount(@PathVariable Long userId) {
        return ResponseEntity.ok(bookingService.getUserBookingCount(userId));
    }

    @GetMapping("/stats/venue/{venueId}")
    public ResponseEntity<Long> getVenueBookingCount(@PathVariable Long venueId) {
        return ResponseEntity.ok(bookingService.getVenueBookingCount(venueId));
    }
}
