package com.hotelbooking.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDate;

public class BookingRequest {
    @NotNull(message = "Hotel ID is required")
    private Long hotelId;

    @NotNull(message = "Room type ID is required")
    private Long roomTypeId;

    @NotNull(message = "Check-in date is required")
    private LocalDate checkInDate;

    @NotNull(message = "Check-out date is required")
    private LocalDate checkOutDate;

    @NotNull(message = "Guest count is required")
    @Positive(message = "Guest count must be positive")
    private Integer guestCount;

    private String paymentMethod; // Optional - not used for payment processing

    // Constructors
    public BookingRequest() {}

    public BookingRequest(Long hotelId, Long roomTypeId, LocalDate checkInDate, 
                         LocalDate checkOutDate, Integer guestCount, String paymentMethod) {
        this.hotelId = hotelId;
        this.roomTypeId = roomTypeId;
        this.checkInDate = checkInDate;
        this.checkOutDate = checkOutDate;
        this.guestCount = guestCount;
        this.paymentMethod = paymentMethod;
    }

    // Getters and Setters
    public Long getHotelId() {
        return hotelId;
    }

    public void setHotelId(Long hotelId) {
        this.hotelId = hotelId;
    }

    public Long getRoomTypeId() {
        return roomTypeId;
    }

    public void setRoomTypeId(Long roomTypeId) {
        this.roomTypeId = roomTypeId;
    }

    public LocalDate getCheckInDate() {
        return checkInDate;
    }

    public void setCheckInDate(LocalDate checkInDate) {
        this.checkInDate = checkInDate;
    }

    public LocalDate getCheckOutDate() {
        return checkOutDate;
    }

    public void setCheckOutDate(LocalDate checkOutDate) {
        this.checkOutDate = checkOutDate;
    }

    public Integer getGuestCount() {
        return guestCount;
    }

    public void setGuestCount(Integer guestCount) {
        this.guestCount = guestCount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}