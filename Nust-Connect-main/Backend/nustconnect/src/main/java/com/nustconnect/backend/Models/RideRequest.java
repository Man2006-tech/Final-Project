package com.nustconnect.backend.Models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

// ============== RideRequest.java ==============
@Entity
@Table(name = "ride_request", indexes = {
        @Index(name = "idx_ride_status", columnList = "ride_id, status")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RideRequest extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long requestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ride_id", nullable = false)
    private RideShare ride;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "passenger_id", nullable = false)
    private User passenger;

    @Column(name = "seats_requested")
    @Builder.Default
    private Integer seatsRequested = 1;

    @Column(name = "status", length = 20)
    @Builder.Default
    private String status = "PENDING"; // PENDING, ACCEPTED, REJECTED, COMPLETED

    @Size(max = 300)
    @Column(length = 300)
    private String message;

    public void accept() {
        this.status = "ACCEPTED";
    }

    public void reject() {
        this.status = "REJECTED";
    }

    // Manual getters and setters to resolve Lombok issues
    public Long getRequestId() {
        return requestId;
    }

    public void setRequestId(Long requestId) {
        this.requestId = requestId;
    }

    public RideShare getRide() {
        return ride;
    }

    public void setRide(RideShare ride) {
        this.ride = ride;
    }

    public User getPassenger() {
        return passenger;
    }

    public void setPassenger(User passenger) {
        this.passenger = passenger;
    }

    public Integer getSeatsRequested() {
        return seatsRequested;
    }

    public void setSeatsRequested(Integer seatsRequested) {
        this.seatsRequested = seatsRequested;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
