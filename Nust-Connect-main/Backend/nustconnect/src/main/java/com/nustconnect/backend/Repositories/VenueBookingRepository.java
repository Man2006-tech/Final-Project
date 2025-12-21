package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Enums.VenueBookingStatus;
import com.nustconnect.backend.Models.VenueBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VenueBookingRepository extends JpaRepository<VenueBooking, Long> {
    List<VenueBooking> findByVenueVenueId(Long venueId);
    List<VenueBooking> findByUserUserId(Long userId);
    List<VenueBooking> findByEventEventId(Long eventId);
    List<VenueBooking> findByApprovalStatus(VenueBookingStatus status);

    @Query("SELECT vb FROM VenueBooking vb WHERE vb.venue.venueId = :venueId " +
            "AND vb.approvalStatus = 'APPROVED' " +
            "AND ((vb.startTime BETWEEN :start AND :end) OR (vb.endTime BETWEEN :start AND :end))")
    List<VenueBooking> findConflictingBookings(@Param("venueId") Long venueId,
                                               @Param("start") LocalDateTime start,
                                               @Param("end") LocalDateTime end);
}
