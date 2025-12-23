package com.nustconnect.backend.Models;

import com.nustconnect.backend.Enums.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// ============== RideShare.java ==============
@Entity
@Table(name = "ride_share", indexes = {
        @Index(name = "idx_departure_time", columnList = "departure_time"),
        @Index(name = "idx_status", columnList = "status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RideShare extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long rideId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @NotBlank(message = "Pickup location is required")
    @Size(max = 200)
    @Column(name = "pickup_location", nullable = false, length = 200)
    private String pickupLocation;

    @NotBlank(message = "Destination is required")
    @Size(max = 200)
    @Column(name = "destination", nullable = false, length = 200)
    private String destination;

    @NotNull(message = "Departure time is required")
    @Future(message = "Departure time must be in the future")
    @Column(name = "departure_time", nullable = false)
    private LocalDateTime departureTime;

    @NotNull(message = "Available seats required")
    @Min(value = 1, message = "Must have at least 1 seat")
    @Max(value = 8, message = "Cannot exceed 8 seats")
    @Column(name = "available_seats", nullable = false)
    private Integer availableSeats;

    @Column(name = "price_per_seat")
    private Double pricePerSeat;

    @Size(max = 500)
    @Column(length = 500)
    private String notes;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "ACTIVE"; // ACTIVE, COMPLETED, CANCELLED, FULL

    @Column(name = "contact_number", length = 20)
    private String contactNumber;

    @OneToMany(mappedBy = "ride")
    @Builder.Default
    @com.fasterxml.jackson.annotation.JsonIgnore
    private List<RideRequest> requests = new ArrayList<RideRequest>();

    public boolean isFull() {
        return availableSeats <= 0;
    }

    public void decrementSeats() {
        if (availableSeats > 0) {
            this.availableSeats--;
            if (this.availableSeats == 0) {
                this.status = "FULL";
            }
        }
    }

    // Manual getters and setters to resolve Lombok issues
    public Long getRideId() {
        return rideId;
    }

    public void setRideId(Long rideId) {
        this.rideId = rideId;
    }

    public User getDriver() {
        return driver;
    }

    public void setDriver(User driver) {
        this.driver = driver;
    }

    public String getPickupLocation() {
        return pickupLocation;
    }

    public void setPickupLocation(String pickupLocation) {
        this.pickupLocation = pickupLocation;
    }

    public String getDestination() {
        return destination;
    }

    public void setDestination(String destination) {
        this.destination = destination;
    }

    public LocalDateTime getDepartureTime() {
        return departureTime;
    }

    public void setDepartureTime(LocalDateTime departureTime) {
        this.departureTime = departureTime;
    }

    public Integer getAvailableSeats() {
        return availableSeats;
    }

    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }

    public Double getPricePerSeat() {
        return pricePerSeat;
    }

    public void setPricePerSeat(Double pricePerSeat) {
        this.pricePerSeat = pricePerSeat;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getContactNumber() {
        return contactNumber;
    }

    public void setContactNumber(String contactNumber) {
        this.contactNumber = contactNumber;
    }

    public List<RideRequest> getRequests() {
        return requests;
    }

    public void setRequests(List<RideRequest> requests) {
        this.requests = requests;
    }
}