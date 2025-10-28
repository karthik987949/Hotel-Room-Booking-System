package com.hotelbooking.controller;

import com.hotelbooking.dto.HotelSearchRequest;
import com.hotelbooking.model.Hotel;
import com.hotelbooking.model.RoomType;
import com.hotelbooking.model.User;
import com.hotelbooking.model.UserRole;
import com.hotelbooking.service.HotelService;
import com.hotelbooking.service.UserService;
import com.hotelbooking.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/hotels")
@CrossOrigin(origins = "*", maxAge = 3600)
public class HotelController {

    @Autowired
    private HotelService hotelService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserService userService;

    @GetMapping("/search")
    public ResponseEntity<?> searchHotels(
            @RequestParam(required = false) String city,
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String checkInDate,
            @RequestParam(required = false) String checkOutDate,
            @RequestParam(required = false) Integer guestCount,
            @RequestParam(required = false) Integer starRating,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        
        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<Hotel> hotels = hotelService.searchHotels(city, country, starRating, pageable);
            
            Map<String, Object> response = new HashMap<>();
            response.put("hotels", hotels.getContent());
            response.put("currentPage", hotels.getNumber());
            response.put("totalItems", hotels.getTotalElements());
            response.put("totalPages", hotels.getTotalPages());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error searching hotels: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getHotelById(@PathVariable Long id) {
        try {
            Hotel hotel = hotelService.getHotelById(id);
            return ResponseEntity.ok(hotel);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/rooms")
    public ResponseEntity<?> getHotelRooms(
            @PathVariable Long id,
            @RequestParam(required = false) String checkInDate,
            @RequestParam(required = false) String checkOutDate,
            @RequestParam(required = false) Integer guestCount) {
        
        try {
            LocalDate checkIn = checkInDate != null ? LocalDate.parse(checkInDate) : null;
            LocalDate checkOut = checkOutDate != null ? LocalDate.parse(checkOutDate) : null;
            
            List<RoomType> roomTypes;
            if (checkIn != null && checkOut != null) {
                roomTypes = hotelService.getAvailableRoomTypes(id, checkIn, checkOut, guestCount);
            } else {
                roomTypes = hotelService.getRoomTypesByHotel(id);
            }
            
            return ResponseEntity.ok(roomTypes);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching room types: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllHotels() {
        try {
            List<Hotel> hotels = hotelService.getAllHotels();
            return ResponseEntity.ok(hotels);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error fetching hotels: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/search/name")
    public ResponseEntity<?> searchHotelsByName(@RequestParam String name) {
        try {
            List<Hotel> hotels = hotelService.findHotelsByName(name);
            return ResponseEntity.ok(hotels);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error searching hotels by name: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // ===== ADMIN ONLY ENDPOINTS =====

    @PostMapping("/admin")
    public ResponseEntity<?> createHotel(@Valid @RequestBody Hotel hotel, Authentication authentication) {
        try {
            // Check if user is admin
            if (!isAdmin(authentication)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Access denied. Admin privileges required.");
                return ResponseEntity.status(403).body(error);
            }

            Hotel createdHotel = hotelService.createHotel(hotel);
            return ResponseEntity.ok(createdHotel);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error creating hotel: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/admin/{id}")
    public ResponseEntity<?> updateHotel(@PathVariable Long id, @Valid @RequestBody Hotel hotel, Authentication authentication) {
        try {
            // Check if user is admin
            if (!isAdmin(authentication)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Access denied. Admin privileges required.");
                return ResponseEntity.status(403).body(error);
            }

            Hotel updatedHotel = hotelService.updateHotel(id, hotel);
            
            // Send real-time notification for hotel update
            notificationService.notifyHotelUpdate(updatedHotel.getId(), "HOTEL_DETAILS_UPDATED");
            
            // If image was updated, send specific image update notification
            if (hotel.getMainImageUrl() != null) {
                notificationService.notifyImageUpdate(updatedHotel.getId(), hotel.getMainImageUrl());
            }
            
            return ResponseEntity.ok(updatedHotel);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error updating hotel: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/admin/{id}")
    public ResponseEntity<?> deleteHotel(@PathVariable Long id, Authentication authentication) {
        try {
            // Check if user is admin
            if (!isAdmin(authentication)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Access denied. Admin privileges required.");
                return ResponseEntity.status(403).body(error);
            }

            hotelService.deleteHotel(id);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Hotel deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error deleting hotel: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PostMapping("/admin/{hotelId}/rooms")
    public ResponseEntity<?> createRoomType(@PathVariable Long hotelId, @Valid @RequestBody RoomType roomType, Authentication authentication) {
        try {
            // Check if user is admin
            if (!isAdmin(authentication)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Access denied. Admin privileges required.");
                return ResponseEntity.status(403).body(error);
            }

            RoomType createdRoomType = hotelService.createRoomType(hotelId, roomType);
            return ResponseEntity.ok(createdRoomType);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error creating room type: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/admin/rooms/{roomTypeId}")
    public ResponseEntity<?> updateRoomType(@PathVariable Long roomTypeId, @Valid @RequestBody RoomType roomType, Authentication authentication) {
        try {
            // Check if user is admin
            if (!isAdmin(authentication)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Access denied. Admin privileges required.");
                return ResponseEntity.status(403).body(error);
            }

            RoomType updatedRoomType = hotelService.updateRoomType(roomTypeId, roomType);
            
            // Send real-time notification for price update
            notificationService.notifyPriceUpdate(updatedRoomType.getHotel().getId(), 
                                                 updatedRoomType.getName(), 
                                                 updatedRoomType.getBasePrice().doubleValue());
            
            return ResponseEntity.ok(updatedRoomType);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error updating room type: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/admin/rooms/{roomTypeId}")
    public ResponseEntity<?> deleteRoomType(@PathVariable Long roomTypeId, Authentication authentication) {
        try {
            // Check if user is admin
            if (!isAdmin(authentication)) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Access denied. Admin privileges required.");
                return ResponseEntity.status(403).body(error);
            }

            hotelService.deleteRoomType(roomTypeId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Room type deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Error deleting room type: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    private boolean isAdmin(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email).orElse(null);
            return user != null && user.getRole() == UserRole.HOTEL_ADMIN;
        } catch (Exception e) {
            return false;
        }
    }
}