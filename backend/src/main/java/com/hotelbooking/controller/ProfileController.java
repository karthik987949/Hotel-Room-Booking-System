package com.hotelbooking.controller;

import com.hotelbooking.dto.ProfileUpdateRequest;
import com.hotelbooking.model.User;
import com.hotelbooking.service.UserService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/profile")
@CrossOrigin(origins = "*")
public class ProfileController {

    private static final Logger logger = LoggerFactory.getLogger(ProfileController.class);

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getProfile(Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmailDirect(email);

            // Create profile response without password
            Map<String, Object> profileData = new HashMap<>();
            profileData.put("id", user.getId());
            profileData.put("email", user.getEmail());
            profileData.put("firstName", user.getFirstName());
            profileData.put("lastName", user.getLastName());
            profileData.put("fullName", user.getFullName());
            profileData.put("phone", user.getPhone());
            profileData.put("profilePicture", user.getProfilePicture());
            profileData.put("dateOfBirth", user.getDateOfBirth());
            profileData.put("address", user.getAddress());
            profileData.put("city", user.getCity());
            profileData.put("state", user.getState());
            profileData.put("postalCode", user.getPostalCode());
            profileData.put("country", user.getCountry());
            profileData.put("fullAddress", user.getFullAddress());
            profileData.put("emergencyContactName", user.getEmergencyContactName());
            profileData.put("emergencyContactPhone", user.getEmergencyContactPhone());
            profileData.put("preferredLanguage", user.getPreferredLanguage());
            profileData.put("notificationPreferences", user.getNotificationPreferences());
            profileData.put("role", user.getRole());
            profileData.put("createdAt", user.getCreatedAt());
            profileData.put("updatedAt", user.getUpdatedAt());

            // Add statistics
            if (user.getBookings() != null) {
                profileData.put("totalBookings", user.getBookings().size());
            } else {
                profileData.put("totalBookings", 0);
            }

            if (user.getReviews() != null) {
                profileData.put("totalReviews", user.getReviews().size());
            } else {
                profileData.put("totalReviews", 0);
            }

            logger.info("Profile retrieved for user: {}", email);
            return ResponseEntity.ok(profileData);

        } catch (Exception e) {
            logger.error("Error retrieving profile: ", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to retrieve profile"));
        }
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@Valid @RequestBody ProfileUpdateRequest request, 
                                         Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmailDirect(email);

            // Update user fields
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            user.setEmail(request.getEmail());
            user.setPhone(request.getPhone());
            user.setProfilePicture(request.getProfilePicture());
            user.setDateOfBirth(request.getDateOfBirth());
            user.setAddress(request.getAddress());
            user.setCity(request.getCity());
            user.setState(request.getState());
            user.setPostalCode(request.getPostalCode());
            user.setCountry(request.getCountry());
            user.setEmergencyContactName(request.getEmergencyContactName());
            user.setEmergencyContactPhone(request.getEmergencyContactPhone());
            user.setPreferredLanguage(request.getPreferredLanguage());
            user.setNotificationPreferences(request.getNotificationPreferences());

            User updatedUser = userService.updateUser(user);

            // Create response without password
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile updated successfully");
            response.put("user", Map.of(
                "id", updatedUser.getId(),
                "email", updatedUser.getEmail(),
                "firstName", updatedUser.getFirstName(),
                "lastName", updatedUser.getLastName(),
                "fullName", updatedUser.getFullName(),
                "phone", updatedUser.getPhone(),
                "profilePicture", updatedUser.getProfilePicture(),
                "role", updatedUser.getRole()
            ));

            logger.info("Profile updated for user: {}", email);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error updating profile: ", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to update profile"));
        }
    }

    @PostMapping("/upload-picture")
    public ResponseEntity<?> uploadProfilePicture(@RequestParam("profilePicture") String profilePictureUrl,
                                                 Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userService.findByEmailDirect(email);

            user.setProfilePicture(profilePictureUrl);
            User updatedUser = userService.updateUser(user);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Profile picture updated successfully");
            response.put("profilePicture", updatedUser.getProfilePicture());

            logger.info("Profile picture updated for user: {}", email);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            logger.error("Error uploading profile picture: ", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to upload profile picture"));
        }
    }
}