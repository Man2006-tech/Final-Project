package com.nustconnect.backend.Controllers;

import com.nustconnect.backend.Models.Venue;
import com.nustconnect.backend.Services.VenueService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/venues")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VenueController {

    private final VenueService venueService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Venue> createVenue(@Valid @RequestBody Venue venue) {
        Venue created = venueService.createVenue(venue);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/{venueId}")
    public ResponseEntity<Venue> getVenueById(@PathVariable Long venueId) {
        Venue venue = venueService.getVenueById(venueId);
        return ResponseEntity.ok(venue);
    }

    @GetMapping
    public ResponseEntity<List<Venue>> getAllVenues() {
        List<Venue> venues = venueService.getAllVenues();
        return ResponseEntity.ok(venues);
    }

    @GetMapping("/available")
    public ResponseEntity<List<Venue>> getAvailableVenues() {
        List<Venue> venues = venueService.getAvailableVenues();
        return ResponseEntity.ok(venues);
    }

    @GetMapping("/capacity/{minCapacity}")
    public ResponseEntity<List<Venue>> getVenuesByMinCapacity(@PathVariable Integer minCapacity) {
        List<Venue> venues = venueService.getVenuesByMinCapacity(minCapacity);
        return ResponseEntity.ok(venues);
    }

    @GetMapping("/amenities/projector")
    public ResponseEntity<List<Venue>> getVenuesWithProjector() {
        List<Venue> venues = venueService.getVenuesWithProjector();
        return ResponseEntity.ok(venues);
    }

    @GetMapping("/amenities/audio")
    public ResponseEntity<List<Venue>> getVenuesWithAudioSystem() {
        List<Venue> venues = venueService.getVenuesWithAudioSystem();
        return ResponseEntity.ok(venues);
    }

    @GetMapping("/amenities/whiteboard")
    public ResponseEntity<List<Venue>> getVenuesWithWhiteboard() {
        List<Venue> venues = venueService.getVenuesWithWhiteboard();
        return ResponseEntity.ok(venues);
    }

    @GetMapping("/amenities/all")
    public ResponseEntity<List<Venue>> getVenuesWithAllAmenities() {
        List<Venue> venues = venueService.getVenuesWithAllAmenities();
        return ResponseEntity.ok(venues);
    }

    @PutMapping("/{venueId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Venue> updateVenue(
            @PathVariable Long venueId,
            @Valid @RequestBody Venue venue) {
        Venue updated = venueService.updateVenue(venueId, venue);
        return ResponseEntity.ok(updated);
    }

    @PatchMapping("/{venueId}/availability/available")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Venue> setAvailable(@PathVariable Long venueId) {
        Venue venue = venueService.setAvailable(venueId);
        return ResponseEntity.ok(venue);
    }

    @PatchMapping("/{venueId}/availability/occupied")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Venue> setOccupied(@PathVariable Long venueId) {
        Venue venue = venueService.setOccupied(venueId);
        return ResponseEntity.ok(venue);
    }

    @PatchMapping("/{venueId}/availability/maintenance")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Venue> setUnderMaintenance(@PathVariable Long venueId) {
        Venue venue = venueService.setUnderMaintenance(venueId);
        return ResponseEntity.ok(venue);
    }

    @PatchMapping("/{venueId}/availability/unavailable")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Venue> setUnavailable(@PathVariable Long venueId) {
        Venue venue = venueService.setUnavailable(venueId);
        return ResponseEntity.ok(venue);
    }

    @DeleteMapping("/{venueId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteVenue(@PathVariable Long venueId) {
        venueService.deleteVenue(venueId);
        return ResponseEntity.ok("Venue deleted successfully");
    }

    @GetMapping("/stats/total")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Long> getTotalVenueCount() {
        return ResponseEntity.ok(venueService.getTotalVenueCount());
    }

    @GetMapping("/stats/available")
    public ResponseEntity<Long> getAvailableVenueCount() {
        return ResponseEntity.ok(venueService.getAvailableVenueCount());
    }
}
