package com.nustconnect.backend.Services;

import com.nustconnect.backend.Enums.VenueAvailability;
import com.nustconnect.backend.Models.Venue;
import com.nustconnect.backend.Repositories.VenueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VenueService {

    private final VenueRepository venueRepository;

    // ==================== CREATE ====================
    public Venue createVenue(Venue venue) {
        // Check if venue name already exists
        if (venueRepository.findByName(venue.getName()).isPresent()) {
            throw new IllegalArgumentException("Venue name already exists");
        }

        if (venue.getAvailabilityStatus() == null) {
            venue.setAvailabilityStatus(VenueAvailability.AVAILABLE);
        }

        return venueRepository.save(venue);
    }

    // ==================== READ ====================
    public Venue getVenueById(Long venueId) {
        return venueRepository.findById(venueId)
                .orElseThrow(() -> new IllegalArgumentException("Venue not found with id: " + venueId));
    }

    public Venue getVenueByName(String name) {
        return venueRepository.findByName(name)
                .orElseThrow(() -> new IllegalArgumentException("Venue not found with name: " + name));
    }

    public List<Venue> getAllVenues() {
        return venueRepository.findAll();
    }

    public List<Venue> getAvailableVenues() {
        return venueRepository.findByAvailabilityStatus("AVAILABLE");
    }

    public List<Venue> getVenuesByMinCapacity(Integer minCapacity) {
        return venueRepository.findByMinimumCapacity(minCapacity);
    }

    // ==================== UPDATE ====================
    public Venue updateVenue(Long venueId, Venue updatedVenue) {
        Venue existingVenue = getVenueById(venueId);

        if (updatedVenue.getName() != null) {
            existingVenue.setName(updatedVenue.getName());
        }
        if (updatedVenue.getLocation() != null) {
            existingVenue.setLocation(updatedVenue.getLocation());
        }
        if (updatedVenue.getCapacity() != null) {
            existingVenue.setCapacity(updatedVenue.getCapacity());
        }
        if (updatedVenue.getDescription() != null) {
            existingVenue.setDescription(updatedVenue.getDescription());
        }
        if (updatedVenue.getImageUrl() != null) {
            existingVenue.setImageUrl(updatedVenue.getImageUrl());
        }
        if (updatedVenue.getHasProjector() != null) {
            existingVenue.setHasProjector(updatedVenue.getHasProjector());
        }
        if (updatedVenue.getHasAudioSystem() != null) {
            existingVenue.setHasAudioSystem(updatedVenue.getHasAudioSystem());
        }
        if (updatedVenue.getHasWhiteboard() != null) {
            existingVenue.setHasWhiteboard(updatedVenue.getHasWhiteboard());
        }

        return venueRepository.save(existingVenue);
    }

    // ==================== AVAILABILITY ====================
    public Venue setAvailable(Long venueId) {
        Venue venue = getVenueById(venueId);
        venue.setAvailabilityStatus(VenueAvailability.AVAILABLE);
        return venueRepository.save(venue);
    }

    public Venue setOccupied(Long venueId) {
        Venue venue = getVenueById(venueId);
        venue.setAvailabilityStatus(VenueAvailability.OCCUPIED);
        return venueRepository.save(venue);
    }

    public Venue setUnderMaintenance(Long venueId) {
        Venue venue = getVenueById(venueId);
        venue.setAvailabilityStatus(VenueAvailability.UNDER_MAINTENANCE);
        return venueRepository.save(venue);
    }

    public Venue setUnavailable(Long venueId) {
        Venue venue = getVenueById(venueId);
        venue.setAvailabilityStatus(VenueAvailability.UNAVAILABLE);
        return venueRepository.save(venue);
    }

    // ==================== DELETE ====================
    public void deleteVenue(Long venueId) {
        if (!venueRepository.existsById(venueId)) {
            throw new IllegalArgumentException("Venue not found");
        }
        venueRepository.deleteById(venueId);
    }

    // ==================== VALIDATION ====================
    public boolean isVenueAvailable(Long venueId) {
        Venue venue = getVenueById(venueId);
        return venue.isAvailableForBooking();
    }

    public boolean isVenueNameAvailable(String name) {
        return venueRepository.findByName(name).isEmpty();
    }

    public boolean hasCapacity(Long venueId, Integer requiredCapacity) {
        Venue venue = getVenueById(venueId);
        return venue.getCapacity() >= requiredCapacity;
    }

    public boolean hasProjector(Long venueId) {
        Venue venue = getVenueById(venueId);
        return venue.getHasProjector();
    }

    public boolean hasAudioSystem(Long venueId) {
        Venue venue = getVenueById(venueId);
        return venue.getHasAudioSystem();
    }

    public boolean hasWhiteboard(Long venueId) {
        Venue venue = getVenueById(venueId);
        return venue.getHasWhiteboard();
    }

    // ==================== STATISTICS ====================
    public long getTotalVenueCount() {
        return venueRepository.count();
    }

    public long getAvailableVenueCount() {
        return venueRepository.findByAvailabilityStatus("AVAILABLE").size();
    }

    // ==================== SEARCH/FILTER ====================
    public List<Venue> getVenuesWithProjector() {
        return getAllVenues().stream()
                .filter(Venue::getHasProjector)
                .toList();
    }

    public List<Venue> getVenuesWithAudioSystem() {
        return getAllVenues().stream()
                .filter(Venue::getHasAudioSystem)
                .toList();
    }

    public List<Venue> getVenuesWithWhiteboard() {
        return getAllVenues().stream()
                .filter(Venue::getHasWhiteboard)
                .toList();
    }

    public List<Venue> getVenuesWithAllAmenities() {
        return getAllVenues().stream()
                .filter(v -> v.getHasProjector() && v.getHasAudioSystem() && v.getHasWhiteboard())
                .toList();
    }
}