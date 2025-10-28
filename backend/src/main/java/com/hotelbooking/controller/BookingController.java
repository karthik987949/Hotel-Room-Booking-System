package com.hotelbooking.controller;

import com.hotelbooking.dto.BookingRequest;
import com.hotelbooking.model.Booking;
import com.hotelbooking.model.User;
import com.hotelbooking.service.BookingService;
import com.hotelbooking.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "*", maxAge = 3600)
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingRequest bookingRequest, 
                                         Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Booking booking = bookingService.createBooking(
                    user.getId(),
                    bookingRequest.getHotelId(),
                    bookingRequest.getRoomTypeId(),
                    bookingRequest.getCheckInDate(),
                    bookingRequest.getCheckOutDate(),
                    bookingRequest.getGuestCount(),
                    bookingRequest.getPaymentMethod()
            );

            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping
    public ResponseEntity<?> getUserBookings(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Booking> bookings = bookingService.getUserBookings(user.getId());
            return ResponseEntity.ok(bookings);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getBookingById(@PathVariable Long id, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Booking booking = bookingService.getBookingById(id);
            
            // Check if user owns this booking
            if (!booking.getUser().getId().equals(user.getId())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Unauthorized access to booking");
                return ResponseEntity.status(403).body(error);
            }

            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateBooking(@PathVariable Long id,
                                         @RequestParam LocalDate checkInDate,
                                         @RequestParam LocalDate checkOutDate,
                                         @RequestParam Integer guestCount,
                                         Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Booking booking = bookingService.updateBooking(id, user.getId(), 
                    checkInDate, checkOutDate, guestCount);
            
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelBooking(@PathVariable Long id, Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Booking booking = bookingService.cancelBooking(id, user.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Booking cancelled successfully");
            response.put("booking", booking);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/confirmation/{confirmationNumber}")
    public ResponseEntity<?> getBookingByConfirmationNumber(@PathVariable String confirmationNumber,
                                                          Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            Booking booking = bookingService.findByConfirmationNumber(confirmationNumber)
                    .orElseThrow(() -> new RuntimeException("Booking not found"));
            
            // Check if user owns this booking
            if (!booking.getUser().getId().equals(user.getId())) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Unauthorized access to booking");
                return ResponseEntity.status(403).body(error);
            }

            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}