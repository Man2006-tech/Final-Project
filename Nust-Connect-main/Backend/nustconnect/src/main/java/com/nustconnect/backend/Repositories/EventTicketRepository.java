package com.nustconnect.backend.Repositories;

import com.nustconnect.backend.Models.EventTicket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EventTicketRepository extends JpaRepository<EventTicket, Long> {
    Optional<EventTicket> findByQrCode(String qrCode);
    Optional<EventTicket> findByTicketNumber(String ticketNumber);
    List<EventTicket> findByEventEventId(Long eventId);
    List<EventTicket> findByUserUserId(Long userId);
    Optional<EventTicket> findByEventEventIdAndUserUserId(Long eventId, Long userId);

    // Or better - use custom query
    @Query("SELECT COUNT(et) FROM EventTicket et WHERE et.event.eventId = :eventId AND et.isCheckedIn = :isCheckedIn")
    long countCheckedInTicketsByEvent(@Param("eventId") Long eventId, @Param("isCheckedIn") Boolean isCheckedIn);
}
