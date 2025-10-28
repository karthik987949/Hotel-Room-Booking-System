package com.hotelbooking.repository;

import com.hotelbooking.model.Payment;
import com.hotelbooking.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByBookingId(Long bookingId);
    
    Optional<Payment> findByTransactionId(String transactionId);
    
    List<Payment> findByStatus(PaymentStatus status);
    
    @Query("SELECT p FROM Payment p WHERE p.processedAt >= :startDate AND p.processedAt <= :endDate")
    List<Payment> findByProcessedAtBetween(@Param("startDate") LocalDateTime startDate, 
                                          @Param("endDate") LocalDateTime endDate);
    
    @Query("SELECT p FROM Payment p WHERE p.booking.user.id = :userId")
    List<Payment> findByUserId(@Param("userId") Long userId);
}