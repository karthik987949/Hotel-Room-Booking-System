package com.hotelbooking.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "room_availability", 
       uniqueConstraints = @UniqueConstraint(columnNames = {"room_type_id", "availability_date"}))
public class RoomAvailability {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_type_id", nullable = false)
    @NotNull(message = "Room type is required")
    private RoomType roomType;

    @Column(name = "availability_date", nullable = false)
    @NotNull(message = "Availability date is required")
    private LocalDate availabilityDate;

    @Column(name = "available_rooms", nullable = false)
    @PositiveOrZero(message = "Available rooms must be zero or positive")
    private Integer availableRooms;

    @Column(name = "price_override", precision = 10, scale = 2)
    private BigDecimal priceOverride;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public RoomAvailability() {}

    public RoomAvailability(RoomType roomType, LocalDate availabilityDate, 
                           Integer availableRooms, BigDecimal priceOverride) {
        this.roomType = roomType;
        this.availabilityDate = availabilityDate;
        this.availableRooms = availableRooms;
        this.priceOverride = priceOverride;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public RoomType getRoomType() {
        return roomType;
    }

    public void setRoomType(RoomType roomType) {
        this.roomType = roomType;
    }

    public LocalDate getAvailabilityDate() {
        return availabilityDate;
    }

    public void setAvailabilityDate(LocalDate availabilityDate) {
        this.availabilityDate = availabilityDate;
    }

    public Integer getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(Integer availableRooms) {
        this.availableRooms = availableRooms;
    }

    public BigDecimal getPriceOverride() {
        return priceOverride;
    }

    public void setPriceOverride(BigDecimal priceOverride) {
        this.priceOverride = priceOverride;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public BigDecimal getEffectivePrice() {
        return priceOverride != null ? priceOverride : roomType.getBasePrice();
    }
}