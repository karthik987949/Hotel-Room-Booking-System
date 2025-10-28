package com.hotelbooking.repository;

import com.hotelbooking.model.RoomType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface RoomTypeRepository extends JpaRepository<RoomType, Long> {
    
    List<RoomType> findByHotelId(Long hotelId);
    
    @Query("SELECT rt FROM RoomType rt WHERE rt.hotel.id = :hotelId AND rt.capacity >= :minCapacity")
    List<RoomType> findByHotelIdAndMinCapacity(@Param("hotelId") Long hotelId, 
                                              @Param("minCapacity") Integer minCapacity);
    
    @Query("SELECT rt FROM RoomType rt WHERE rt.hotel.id = :hotelId AND " +
           "rt.basePrice >= :minPrice AND rt.basePrice <= :maxPrice")
    List<RoomType> findByHotelIdAndPriceRange(@Param("hotelId") Long hotelId,
                                             @Param("minPrice") BigDecimal minPrice,
                                             @Param("maxPrice") BigDecimal maxPrice);
    
    @Query("SELECT rt FROM RoomType rt WHERE rt.hotel.id = :hotelId ORDER BY rt.basePrice ASC")
    List<RoomType> findByHotelIdOrderByPriceAsc(@Param("hotelId") Long hotelId);
}