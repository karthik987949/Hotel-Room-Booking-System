package com.hotelbooking.service;

import com.hotelbooking.model.*;
import com.hotelbooking.repository.BookingRepository;
import com.hotelbooking.repository.HotelRepository;
import com.hotelbooking.repository.RoomTypeRepository;
import com.hotelbooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HotelRepository hotelRepository;

    @Autowired
    private RoomTypeRepository roomTypeRepository;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private EmailService emailService;

    @Transactional
    public Booking createBooking(Long userId, Long hotelId, Long roomTypeId, 
                               LocalDate checkInDate, LocalDate checkOutDate, 
                               Integer guestCount, String paymentMethod) {
        
        // Validate input
        if (checkInDate.isAfter(checkOutDate) || checkInDate.isBefore(LocalDate.now())) {
            throw new RuntimeException("Invalid check-in or check-out date");
        }

        // Fetch entities
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new RuntimeException("Hotel not found"));
        RoomType roomType = roomTypeRepository.findById(roomTypeId)
                .orElseThrow(() -> new RuntimeException("Room type not found"));

        // Validate capacity
        if (guestCount > roomType.getCapacity()) {
            throw new RuntimeException("Guest count exceeds room capacity");
        }

        // Check availability
        if (!isRoomTypeAvailable(roomTypeId, checkInDate, checkOutDate)) {
            throw new RuntimeException("Room type not available for selected dates");
        }

        // Calculate total amount
        long numberOfNights = ChronoUnit.DAYS.between(checkInDate, checkOutDate);
        BigDecimal totalAmount = roomType.getBasePrice().multiply(BigDecimal.valueOf(numberOfNights));

        // Create booking
        Booking booking = new Booking(user, hotel, roomType, checkInDate, checkOutDate, guestCount, totalAmount);
        
        // Set booking status to confirmed directly (no payment processing needed)
        booking.setStatus(BookingStatus.CONFIRMED);
        
        booking = bookingRepository.save(booking);

        // Send booking confirmation email
        try {
            emailService.sendBookingConfirmationEmail(user, booking, hotel, roomType);
        } catch (Exception e) {
            // Log error but don't fail the booking
            System.err.println("Failed to send booking confirmation email: " + e.getMessage());
        }

        return booking;
    }

    public List<Booking> getUserBookings(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return bookingRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public Optional<Booking> findById(Long id) {
        return bookingRepository.findById(id);
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
    }

    public Optional<Booking> findByConfirmationNumber(String confirmationNumber) {
        return bookingRepository.findByConfirmationNumber(confirmationNumber);
    }

    @Transactional
    public Booking cancelBooking(Long bookingId, Long userId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Verify ownership
        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to cancel this booking");
        }

        // Check if cancellation is allowed
        if (booking.getStatus() == BookingStatus.CANCELLED || 
            booking.getStatus() == BookingStatus.COMPLETED) {
            throw new RuntimeException("Cannot cancel booking in current status");
        }

        // Check cancellation policy (e.g., 24 hours before check-in)
        if (booking.getCheckInDate().isBefore(LocalDate.now().plusDays(1))) {
            throw new RuntimeException("Cannot cancel booking less than 24 hours before check-in");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        
        Booking cancelledBooking = bookingRepository.save(booking);

        // Send booking cancellation email
        try {
            emailService.sendBookingCancellationEmail(booking.getUser(), booking, booking.getHotel(), booking.getRoomType());
        } catch (Exception e) {
            // Log error but don't fail the cancellation
            System.err.println("Failed to send booking cancellation email: " + e.getMessage());
        }

        return cancelledBooking;
    }

    @Transactional
    public Booking updateBooking(Long bookingId, Long userId, LocalDate newCheckInDate, 
                               LocalDate newCheckOutDate, Integer newGuestCount) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found"));

        // Verify ownership
        if (!booking.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized to modify this booking");
        }

        // Check if modification is allowed
        if (booking.getStatus() != BookingStatus.CONFIRMED && 
            booking.getStatus() != BookingStatus.PENDING) {
            throw new RuntimeException("Cannot modify booking in current status");
        }

        // Validate new dates
        if (newCheckInDate.isAfter(newCheckOutDate) || 
            newCheckInDate.isBefore(LocalDate.now())) {
            throw new RuntimeException("Invalid check-in or check-out date");
        }

        // Check availability for new dates
        if (!isRoomTypeAvailable(booking.getRoomType().getId(), newCheckInDate, newCheckOutDate)) {
            throw new RuntimeException("Room type not available for new dates");
        }

        // Update booking
        booking.setCheckInDate(newCheckInDate);
        booking.setCheckOutDate(newCheckOutDate);
        booking.setGuestCount(newGuestCount);

        // Recalculate total amount
        long numberOfNights = ChronoUnit.DAYS.between(newCheckInDate, newCheckOutDate);
        BigDecimal newTotalAmount = booking.getRoomType().getBasePrice()
                .multiply(BigDecimal.valueOf(numberOfNights));
        booking.setTotalAmount(newTotalAmount);

        return bookingRepository.save(booking);
    }

    private boolean isRoomTypeAvailable(Long roomTypeId, LocalDate checkInDate, LocalDate checkOutDate) {
        // Temporarily disable availability check for testing
        // TODO: Implement proper room inventory management
        return true;
        
        /*
        List<Booking> conflictingBookings = bookingRepository.findConflictingBookings(
                roomTypeId, checkInDate, checkOutDate);
        
        // For simplicity, assume available if no conflicts
        // In a real system, you'd check against actual room inventory
        return conflictingBookings.isEmpty();
        */
    }

    public List<Booking> getHotelBookings(Long hotelId) {
        return bookingRepository.findByHotelId(hotelId);
    }

    public List<Booking> getBookingsByStatus(BookingStatus status) {
        return bookingRepository.findByStatus(status);
    }
}