package com.hotelbooking.repository;

import com.hotelbooking.model.RoomAvailability;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomAvailabilityRepository extends JpaRepository<RoomAvailability, Long> {
    
    Optional<RoomAvailability> findByRoomTypeIdAndAvailabilityDate(Long roomTypeId, LocalDate date);
    
    List<RoomAvailability> findByRoomTypeId(Long roomTypeId);
    
    @Query("SELECT ra FROM RoomAvailability ra WHERE ra.roomType.id = :roomTypeId AND " +
           "ra.availabilityDate >= :startDate AND ra.availabilityDate <= :endDate")
    List<RoomAvailability> findByRoomTypeIdAndDateRange(@Param("roomTypeId") Long roomTypeId,
                                                       @Param("startDate") LocalDate startDate,
                                                       @Param("endDate") LocalDate endDate);
    
    @Query("SELECT ra FROM RoomAvailability ra WHERE ra.roomType.hotel.id = :hotelId AND " +
           "ra.availabilityDate >= :startDate AND ra.availabilityDate <= :endDate")
    List<RoomAvailability> findByHotelIdAndDateRange(@Param("hotelId") Long hotelId,
                                                    @Param("startDate") LocalDate startDate,
                                                    @Param("endDate") LocalDate endDate);
}