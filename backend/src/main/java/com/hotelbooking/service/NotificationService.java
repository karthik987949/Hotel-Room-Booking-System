package com.hotelbooking.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class NotificationService {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void notifyHotelUpdate(Long hotelId, String updateType) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "HOTEL_UPDATE");
        notification.put("hotelId", hotelId);
        notification.put("updateType", updateType);
        notification.put("timestamp", System.currentTimeMillis());
        
        messagingTemplate.convertAndSend("/topic/hotel-updates", notification);
    }

    public void notifyPriceUpdate(Long hotelId, String roomType, Double newPrice) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "PRICE_UPDATE");
        notification.put("hotelId", hotelId);
        notification.put("roomType", roomType);
        notification.put("newPrice", newPrice);
        notification.put("timestamp", System.currentTimeMillis());
        
        messagingTemplate.convertAndSend("/topic/price-updates", notification);
    }

    public void notifyImageUpdate(Long hotelId, String newImageUrl) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "IMAGE_UPDATE");
        notification.put("hotelId", hotelId);
        notification.put("newImageUrl", newImageUrl);
        notification.put("timestamp", System.currentTimeMillis());
        
        messagingTemplate.convertAndSend("/topic/image-updates", notification);
    }

    public void notifyAvailabilityUpdate(Long hotelId, String roomType, Boolean available) {
        Map<String, Object> notification = new HashMap<>();
        notification.put("type", "AVAILABILITY_UPDATE");
        notification.put("hotelId", hotelId);
        notification.put("roomType", roomType);
        notification.put("available", available);
        notification.put("timestamp", System.currentTimeMillis());
        
        messagingTemplate.convertAndSend("/topic/availability-updates", notification);
    }
}