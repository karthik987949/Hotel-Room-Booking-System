package com.hotelbooking.repository;

import com.hotelbooking.model.Booking;
import com.hotelbooking.model.BookingStatus;
import com.hotelbooking.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    
    List<Booking> findByUser(User user);
    
    List<Booking> findByUserOrderByCreatedAtDesc(User user);
    
    Optional<Booking> findByConfirmationNumber(String confirmationNumber);
    
    List<Booking> findByStatus(BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.hotel.id = :hotelId")
    List<Booking> findByHotelId(@Param("hotelId") Long hotelId);
    
    @Query("SELECT b FROM Booking b WHERE b.roomType.id = :roomTypeId AND " +
           "((b.checkInDate <= :checkOutDate AND b.checkOutDate >= :checkInDate)) AND " +
           "b.status IN ('CONFIRMED', 'PENDING')")
    List<Booking> findConflictingBookings(@Param("roomTypeId") Long roomTypeId,
                                         @Param("checkInDate") LocalDate checkInDate,
                                         @Param("checkOutDate") LocalDate checkOutDate);
    
    @Query("SELECT COUNT(b) FROM Booking b WHERE b.roomType.id = :roomTypeId AND " +
           "b.checkInDate <= :date AND b.checkOutDate > :date AND " +
           "b.status IN ('CONFIRMED', 'PENDING')")
    Long countBookingsForDate(@Param("roomTypeId") Long roomTypeId, @Param("date") LocalDate date);
    
    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId AND b.status = :status")
    List<Booking> findByUserIdAndStatus(@Param("userId") Long userId, @Param("status") BookingStatus status);
    
    @Query("SELECT b FROM Booking b WHERE b.roomType.id = :roomTypeId AND b.status IN :statuses")
    List<Booking> findByRoomTypeIdAndStatusIn(@Param("roomTypeId") Long roomTypeId, @Param("statuses") List<BookingStatus> statuses);
}