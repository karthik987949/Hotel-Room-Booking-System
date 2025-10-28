package com.hotelbooking.controller;

import com.hotelbooking.model.*;
import com.hotelbooking.service.EmailService;
import com.hotelbooking.service.UserService;
import com.hotelbooking.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test")
@CrossOrigin(origins = "*")
public class EmailTestController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserService userService;

    @Autowired
    private HotelService hotelService;

    @PostMapping("/email")
    public ResponseEntity<?> testEmail(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Create a mock booking for testing
            Hotel hotel = hotelService.getAllHotels().get(0); // Get first hotel
            RoomType roomType = hotel.getRoomTypes().get(0); // Get first room type

            Booking mockBooking = new Booking();
            mockBooking.setId(12345L);
            mockBooking.setUser(user);
            mockBooking.setHotel(hotel);
            mockBooking.setRoomType(roomType);
            mockBooking.setCheckInDate(LocalDate.of(2024, 12, 1));
            mockBooking.setCheckOutDate(LocalDate.of(2024, 12, 3));
            mockBooking.setGuestCount(2);
            mockBooking.setTotalAmount(new BigDecimal("25000.00"));
            mockBooking.setStatus(BookingStatus.CONFIRMED);

            // Send test email
            emailService.sendBookingConfirmationEmail(user, mockBooking, hotel, roomType);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Test email sent successfully!");
            response.put("recipient", user.getEmail());
            response.put("hotel", hotel.getName());
            response.put("checkConsole", "Check backend console logs for AI-generated email content");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to send test email: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }
}