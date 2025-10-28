package com.hotelbooking.repository;

import com.hotelbooking.model.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    
    @Query("SELECT h FROM Hotel h WHERE " +
           "(:city IS NULL OR LOWER(h.city) LIKE LOWER(CONCAT('%', :city, '%'))) AND " +
           "(:country IS NULL OR LOWER(h.country) LIKE LOWER(CONCAT('%', :country, '%'))) AND " +
           "(:starRating IS NULL OR h.starRating >= :starRating)")
    Page<Hotel> findHotelsWithFilters(@Param("city") String city, 
                                     @Param("country") String country, 
                                     @Param("starRating") Integer starRating, 
                                     Pageable pageable);
    
    List<Hotel> findByCity(String city);
    
    List<Hotel> findByCountry(String country);
    
    List<Hotel> findByStarRating(Integer starRating);
    
    @Query("SELECT h FROM Hotel h WHERE h.starRating >= :minRating AND h.starRating <= :maxRating")
    List<Hotel> findByStarRatingBetween(@Param("minRating") Integer minRating, 
                                       @Param("maxRating") Integer maxRating);
    
    @Query("SELECT h FROM Hotel h WHERE LOWER(h.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<Hotel> findByNameContaining(@Param("name") String name);
}