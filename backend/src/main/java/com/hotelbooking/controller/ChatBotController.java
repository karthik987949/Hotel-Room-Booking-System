package com.hotelbooking.controller;

import com.hotelbooking.model.User;
import com.hotelbooking.service.GeminiAIService;
import com.hotelbooking.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/chatbot")
@CrossOrigin(origins = "*")
public class ChatBotController {

    private static final Logger logger = LoggerFactory.getLogger(ChatBotController.class);

    @Autowired
    private GeminiAIService geminiAIService;

    @Autowired
    private UserService userService;

    @PostMapping("/chat")
    public Mono<ResponseEntity<Map<String, Object>>> chat(
            @RequestBody ChatRequest request,
            Authentication authentication) {
        
        try {
            // Get user information
            String userEmail = authentication.getName();
            User user = userService.findByEmail(userEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String userName = user.getFirstName();
            String userRole = user.getRole().name();
            
            logger.info("Chat request from user: {} ({})", userName, userRole);
            
            return geminiAIService.generateResponse(request.getMessage(), userName, userRole)
                    .map(response -> {
                        Map<String, Object> result = new HashMap<>();
                        result.put("response", response);
                        result.put("timestamp", System.currentTimeMillis());
                        result.put("success", true);
                        
                        // Add suggestions based on the response content
                        result.put("suggestions", generateSuggestions(response, userRole));
                        
                        return ResponseEntity.ok(result);
                    })
                    .onErrorReturn(ResponseEntity.badRequest().body(Map.of(
                            "error", "Failed to generate response",
                            "success", false
                    )));
                    
        } catch (Exception e) {
            logger.error("Error processing chat request: ", e);
            return Mono.just(ResponseEntity.badRequest().body(Map.of(
                    "error", "Internal server error",
                    "success", false
            )));
        }
    }

    private String[] generateSuggestions(String response, String userRole) {
        // Generate contextual suggestions based on the AI response and user role
        if ("HOTEL_ADMIN".equals(userRole)) {
            return new String[]{
                "Show booking analytics",
                "Manage hotel listings",
                "View customer feedback",
                "Update room availability"
            };
        } else {
            // Customer suggestions
            if (response.toLowerCase().contains("hotel") || response.toLowerCase().contains("book")) {
                return new String[]{
                    "Search available hotels",
                    "Check my bookings",
                    "View hotel amenities",
                    "Contact support"
                };
            } else if (response.toLowerCase().contains("price") || response.toLowerCase().contains("cost")) {
                return new String[]{
                    "Compare hotel prices",
                    "Check for discounts",
                    "View luxury options",
                    "Budget-friendly hotels"
                };
            } else {
                return new String[]{
                    "Find hotels near me",
                    "Popular destinations",
                    "Special offers",
                    "Help with booking"
                };
            }
        }
    }

    // DTO for chat request
    public static class ChatRequest {
        private String message;

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }
}