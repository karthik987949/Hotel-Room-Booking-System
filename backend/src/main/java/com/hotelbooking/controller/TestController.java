package com.hotelbooking.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test")
public class TestController {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.api.url}")
    private String apiUrl;

    @GetMapping("/gemini-config")
    public Map<String, Object> testGeminiConfig() {
        Map<String, Object> response = new HashMap<>();
        response.put("apiKeyConfigured", apiKey != null && !apiKey.isEmpty() && !apiKey.equals("your-gemini-api-key-here"));
        response.put("apiKeyLength", apiKey != null ? apiKey.length() : 0);
        response.put("apiUrl", apiUrl);
        response.put("apiKeyPrefix", apiKey != null && apiKey.length() > 10 ? apiKey.substring(0, 10) + "..." : "Not configured");
        return response;
    }
}