package com.hotelbooking.service;

import com.hotelbooking.model.Booking;
import com.hotelbooking.model.Hotel;
import com.hotelbooking.model.RoomType;
import com.hotelbooking.repository.BookingRepository;
import com.hotelbooking.repository.HotelRepository;
import com.hotelbooking.repository.RoomTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public Page<Hotel> searchHotels(String city, String country, Integer starRating, Pageable pageable) {
        return hotelRepository.findHotelsWithFilters(city, country, starRating, pageable);
    }

    public List<Hotel> searchHotelsByLocation(String city, String country) {
        if (city != null && country != null) {
            return hotelRepository.findHotelsWithFilters(city, country, null, Pageable.unpaged()).getContent();
        } else if (city != null) {
            return hotelRepository.findByCity(city);
        } else if (country != null) {
            return hotelRepository.findByCountry(country);
        } else {
            return hotelRepository.findAll();
        }
    }

    public Optional<Hotel> findById(Long id) {
        return hotelRepository.findById(id);
    }

    public Hotel getHotelById(Long id) {
        return hotelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Hotel not found with id: " + id));
    }

    public List<RoomType> getAvailableRoomTypes(Long hotelId, LocalDate checkInDate, LocalDate checkOutDate, Integer guestCount) {
        List<RoomType> roomTypes = roomTypeRepository.findByHotelId(hotelId);
        
        return roomTypes.stream()
                .filter(roomType -> {
                    // Check if room type has sufficient capacity
                    if (guestCount != null && roomType.getCapacity() < guestCount) {
                        return false;
                    }
                    
                    // Check availability for the date range
                    return isRoomTypeAvailable(roomType.getId(), checkInDate, checkOutDate);
                })
                .toList();
    }

    public List<RoomType> getRoomTypesByHotel(Long hotelId) {
        return roomTypeRepository.findByHotelId(hotelId);
    }

    private boolean isRoomTypeAvailable(Long roomTypeId, LocalDate checkInDate, LocalDate checkOutDate) {
        if (checkInDate == null || checkOutDate == null) {
            return true; // If no dates specified, assume available
        }
        
        // Check for conflicting bookings
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(roomTypeId, checkInDate, checkOutDate);
        
        // For simplicity, assume available if no conflicts
        // In a real system, you'd check against actual room inventory
        return conflictingBookings.isEmpty();
    }

    public Hotel saveHotel(Hotel hotel) {
        return hotelRepository.save(hotel);
    }

    public void deleteHotel(Long id) {
        hotelRepository.deleteById(id);
    }

    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }

    public List<Hotel> findHotelsByName(String name) {
        return hotelRepository.findByNameContaining(name);
    }

    // ===== ADMIN METHODS =====

    public Hotel createHotel(Hotel hotel) {
        // Validate required fields
        if (hotel.getName() == null || hotel.getName().trim().isEmpty()) {
            throw new RuntimeException("Hotel name is required");
        }
        if (hotel.getCity() == null || hotel.getCity().trim().isEmpty()) {
            throw new RuntimeException("Hotel city is required");
        }
        if (hotel.getCountry() == null || hotel.getCountry().trim().isEmpty()) {
            throw new RuntimeException("Hotel country is required");
        }

        return hotelRepository.save(hotel);
    }

    public Hotel updateHotel(Long id, Hotel hotelDetails) {
        Hotel hotel = getHotelById(id);
        
        // Update fields
        if (hotelDetails.getName() != null) {
            hotel.setName(hotelDetails.getName());
        }
        if (hotelDetails.getDescription() != null) {
            hotel.setDescription(hotelDetails.getDescription());
        }
        if (hotelDetails.getAddress() != null) {
            hotel.setAddress(hotelDetails.getAddress());
        }
        if (hotelDetails.getCity() != null) {
            hotel.setCity(hotelDetails.getCity());
        }
        if (hotelDetails.getCountry() != null) {
            hotel.setCountry(hotelDetails.getCountry());
        }
        if (hotelDetails.getLatitude() != null) {
            hotel.setLatitude(hotelDetails.getLatitude());
        }
        if (hotelDetails.getLongitude() != null) {
            hotel.setLongitude(hotelDetails.getLongitude());
        }
        if (hotelDetails.getStarRating() != null) {
            hotel.setStarRating(hotelDetails.getStarRating());
        }
        if (hotelDetails.getAmenities() != null) {
            hotel.setAmenities(hotelDetails.getAmenities());
        }

        return hotelRepository.save(hotel);
    }

    public RoomType createRoomType(Long hotelId, RoomType roomType) {
        Hotel hotel = getHotelById(hotelId);
        roomType.setHotel(hotel);
        
        // Validate required fields
        if (roomType.getName() == null || roomType.getName().trim().isEmpty()) {
            throw new RuntimeException("Room type name is required");
        }
        if (roomType.getCapacity() == null || roomType.getCapacity() <= 0) {
            throw new RuntimeException("Room capacity must be greater than 0");
        }
        if (roomType.getBasePrice() == null || roomType.getBasePrice().doubleValue() <= 0) {
            throw new RuntimeException("Base price must be greater than 0");
        }

        return roomTypeRepository.save(roomType);
    }

    public RoomType updateRoomType(Long roomTypeId, RoomType roomTypeDetails) {
        RoomType roomType = roomTypeRepository.findById(roomTypeId)
                .orElseThrow(() -> new RuntimeException("Room type not found with id: " + roomTypeId));
        
        // Update fields
        if (roomTypeDetails.getName() != null) {
            roomType.setName(roomTypeDetails.getName());
        }
        if (roomTypeDetails.getDescription() != null) {
            roomType.setDescription(roomTypeDetails.getDescription());
        }
        if (roomTypeDetails.getCapacity() != null) {
            roomType.setCapacity(roomTypeDetails.getCapacity());
        }
        if (roomTypeDetails.getBasePrice() != null) {
            roomType.setBasePrice(roomTypeDetails.getBasePrice());
        }
        if (roomTypeDetails.getAmenities() != null) {
            roomType.setAmenities(roomTypeDetails.getAmenities());
        }

        return roomTypeRepository.save(roomType);
    }

    public void deleteRoomType(Long roomTypeId) {
        RoomType roomType = roomTypeRepository.findById(roomTypeId)
                .orElseThrow(() -> new RuntimeException("Room type not found with id: " + roomTypeId));
        
        // Check if there are any active bookings for this room type
        List<Booking> activeBookings = bookingRepository.findByRoomTypeIdAndStatusIn(
                roomTypeId, List.of(com.hotelbooking.model.BookingStatus.CONFIRMED, com.hotelbooking.model.BookingStatus.PENDING));
        
        if (!activeBookings.isEmpty()) {
            throw new RuntimeException("Cannot delete room type with active bookings");
        }

        roomTypeRepository.delete(roomType);
    }
}