package com.hotelbooking.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiAIService {

    private static final Logger logger = LoggerFactory.getLogger(GeminiAIService.class);

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public GeminiAIService() {
        this.webClient = WebClient.builder()
                .codecs(configurer -> configurer.defaultCodecs().maxInMemorySize(1024 * 1024))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    public Mono<String> generateResponse(String userMessage, String userName, String userRole) {
        try {
            logger.info("Generating response for user: {} with role: {}", userName, userRole);
            
            // Check if API key is configured properly
            if (apiKey == null || apiKey.isEmpty() || "your-gemini-api-key-here".equals(apiKey)) {
                logger.warn("Gemini API key is not configured properly, using fallback responses");
                return Mono.just(generateFallbackResponse(userMessage, userRole));
            }

            logger.info("Attempting to use Gemini AI for response generation");
            
            // Create the system prompt for hotel booking context
            String systemPrompt = createSystemPrompt(userName, userRole);
            String fullPrompt = systemPrompt + "\n\nUser: " + userMessage + "\nAssistant:";

            // Create request body for Gemini API
            Map<String, Object> requestBody = createRequestBody(fullPrompt);
            
            logger.debug("Calling Gemini API with URL: {}", apiUrl);

            return webClient.post()
                    .uri(apiUrl + "?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .map(this::extractResponseText)
                    .doOnSuccess(response -> logger.info("Successfully received AI response"))
                    .doOnError(error -> {
                        logger.error("Error calling Gemini API: {}", error.getMessage());
                        if (error.getMessage().contains("SSL") || error.getMessage().contains("certificate")) {
                            logger.error("SSL/Certificate error - falling back to local responses");
                        }
                    })
                    .onErrorReturn(generateFallbackResponse(userMessage, userRole));

        } catch (Exception e) {
            logger.error("Error creating Gemini API request, using fallback: ", e);
            return Mono.just(generateFallbackResponse(userMessage, userRole));
        }
    }

    private String createSystemPrompt(String userName, String userRole) {
        String basePrompt = """
            You are a helpful AI assistant for LuxeStay, a premium hotel booking platform in India. 
            You help customers with hotel bookings, recommendations, and general inquiries.
            
            Key Information:
            - LuxeStay offers luxury hotels across India including Mumbai, Goa, Udaipur, Agra, Srinagar, Hyderabad, Bangalore, and Tirupati
            - Price ranges: 3-star (₹5,000-8,000/night), 4-star (₹8,000-15,000/night), 5-star (₹15,000+/night)
            - All prices include 18% GST
            - Free cancellation up to 24 hours before check-in
            - 24/7 customer support: +91 1800-123-4567, support@luxestay.com
            
            Featured Hotels:
            - Mumbai: The Taj Mahal Palace (5-star luxury)
            - Goa: Leela Palace Goa (5-star beachfront)
            - Udaipur: Taj Lake Palace (5-star heritage)
            - Agra: The Oberoi Amarvilas (5-star with Taj Mahal views)
            - Srinagar: Vivanta Dal View (5-star with lake views)
            
            Guidelines:
            - Be friendly, professional, and helpful
            - Provide specific hotel recommendations when asked
            - Include prices in Indian Rupees (₹)
            - Mention key amenities and unique features
            - Always offer to help with bookings or provide more information
            - Keep responses concise but informative
            - If asked about bookings, guide users to the booking section
            """;

        if ("HOTEL_ADMIN".equals(userRole)) {
            basePrompt += """
                
                Note: This user is a hotel administrator. Focus on:
                - Hotel management features
                - Booking analytics and reports
                - Customer management
                - Administrative tasks
                - System features for hotel operations
                """;
        }

        return basePrompt + "\n\nUser name: " + (userName != null ? userName : "Guest");
    }

    private Map<String, Object> createRequestBody(String prompt) {
        Map<String, Object> requestBody = new HashMap<>();
        
        // Create contents array
        Map<String, Object> content = new HashMap<>();
        Map<String, Object> part = new HashMap<>();
        part.put("text", prompt);
        content.put("parts", List.of(part));
        requestBody.put("contents", List.of(content));
        
        // Add generation config for better responses
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);
        generationConfig.put("topK", 40);
        generationConfig.put("topP", 0.95);
        generationConfig.put("maxOutputTokens", 1024);
        requestBody.put("generationConfig", generationConfig);
        
        // Add safety settings
        Map<String, Object> safetySettings = Map.of(
            "category", "HARM_CATEGORY_HARASSMENT",
            "threshold", "BLOCK_MEDIUM_AND_ABOVE"
        );
        requestBody.put("safetySettings", List.of(safetySettings));
        
        return requestBody;
    }

    private String generateFallbackResponse(String userMessage, String userRole) {
        String message = userMessage.toLowerCase();
        
        // Provide helpful fallback responses based on common queries
        if (message.contains("hotel") && (message.contains("mumbai") || message.contains("bombay"))) {
            return "I'd be happy to help you find hotels in Mumbai! 🏨\n\n" +
                   "Here are some of our top recommendations:\n" +
                   "• The Taj Mahal Palace - Iconic 5-star luxury hotel\n" +
                   "• ITC Grand Central - Premium business hotel\n" +
                   "• The Oberoi Mumbai - Elegant waterfront location\n\n" +
                   "Prices typically range from ₹15,000-₹30,000 per night for luxury hotels.\n" +
                   "Would you like me to help you search for available dates?";
        }
        
        if (message.contains("price") || message.contains("cost")) {
            return "Here's our general pricing guide for Indian hotels: 💰\n\n" +
                   "• 3-star hotels: ₹5,000-8,000 per night\n" +
                   "• 4-star hotels: ₹8,000-15,000 per night\n" +
                   "• 5-star hotels: ₹15,000+ per night\n\n" +
                   "All prices include 18% GST. We offer free cancellation up to 24 hours before check-in!\n" +
                   "Which destination are you interested in?";
        }
        
        if (message.contains("booking") || message.contains("reservation")) {
            return "I can help you with your bookings! 📋\n\n" +
                   "Here's what I can assist with:\n" +
                   "• Finding and booking hotels\n" +
                   "• Checking your current reservations\n" +
                   "• Modifying or canceling bookings\n" +
                   "• Answering questions about policies\n\n" +
                   "What would you like to do today?";
        }
        
        if (message.contains("cancel")) {
            return "I understand you need help with cancellation. 🔄\n\n" +
                   "Our cancellation policy:\n" +
                   "• Free cancellation up to 24 hours before check-in\n" +
                   "• Full refund for eligible cancellations\n" +
                   "• Easy online cancellation process\n\n" +
                   "You can cancel your booking from the 'My Bookings' section or contact our support team at +91 1800-123-4567.";
        }
        
        if ("HOTEL_ADMIN".equals(userRole)) {
            return "Hello! I'm here to help with your hotel management needs. 👨‍💼\n\n" +
                   "I can assist you with:\n" +
                   "• Hotel listing management\n" +
                   "• Booking analytics and reports\n" +
                   "• Customer inquiries and support\n" +
                   "• System features and operations\n\n" +
                   "What would you like to work on today?";
        }
        
        // Default welcome response
        return "Hello! Welcome to LuxeStay! 👋\n\n" +
               "I'm your personal hotel booking assistant. I can help you with:\n" +
               "• Finding the perfect hotel for your stay\n" +
               "• Checking prices and availability\n" +
               "• Managing your bookings\n" +
               "• Answering questions about our services\n\n" +
               "What can I help you with today? You can ask me about hotels in specific cities, pricing, or any other questions!";
    }

    private String extractResponseText(String response) {
        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode candidates = jsonNode.get("candidates");
            
            if (candidates != null && candidates.isArray() && candidates.size() > 0) {
                JsonNode firstCandidate = candidates.get(0);
                JsonNode content = firstCandidate.get("content");
                
                if (content != null) {
                    JsonNode parts = content.get("parts");
                    if (parts != null && parts.isArray() && parts.size() > 0) {
                        JsonNode firstPart = parts.get(0);
                        JsonNode text = firstPart.get("text");
                        if (text != null) {
                            return text.asText().trim();
                        }
                    }
                }
            }
            
            logger.warn("Unexpected response format from Gemini API: {}", response);
            return "I'm sorry, I couldn't process that request. Please try again.";
            
        } catch (Exception e) {
            logger.error("Error parsing Gemini API response: ", e);
            return "I encountered an error processing your request. Please try again.";
        }
    }
}