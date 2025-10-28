package com.hotelbooking.service;

import com.hotelbooking.model.Booking;
import com.hotelbooking.model.Payment;
import com.hotelbooking.model.PaymentStatus;
import com.hotelbooking.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Transactional
    public Payment processPayment(Booking booking, BigDecimal amount, String paymentMethod) {
        // Create payment record
        Payment payment = new Payment(booking, amount, paymentMethod);
        payment.setStatus(PaymentStatus.PROCESSING);
        payment = paymentRepository.save(payment);

        try {
            // Simulate payment gateway integration
            String transactionId = processWithPaymentGateway(amount, paymentMethod);
            
            payment.setTransactionId(transactionId);
            payment.setStatus(PaymentStatus.COMPLETED);
            payment.setProcessedAt(LocalDateTime.now());
            
        } catch (Exception e) {
            payment.setStatus(PaymentStatus.FAILED);
            throw new RuntimeException("Payment processing failed: " + e.getMessage());
        }

        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment processRefund(Payment originalPayment) {
        if (originalPayment.getStatus() != PaymentStatus.COMPLETED) {
            throw new RuntimeException("Cannot refund payment that is not completed");
        }

        try {
            // Simulate refund processing
            String refundTransactionId = processRefundWithPaymentGateway(
                    originalPayment.getTransactionId(), originalPayment.getAmount());
            
            originalPayment.setStatus(PaymentStatus.REFUNDED);
            originalPayment.setProcessedAt(LocalDateTime.now());
            
            return paymentRepository.save(originalPayment);
            
        } catch (Exception e) {
            throw new RuntimeException("Refund processing failed: " + e.getMessage());
        }
    }

    public Payment getPaymentByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new RuntimeException("Payment not found for booking"));
    }

    public Payment getPaymentById(Long paymentId) {
        return paymentRepository.findById(paymentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
    }

    // Simulate payment gateway integration
    private String processWithPaymentGateway(BigDecimal amount, String paymentMethod) {
        // In a real implementation, this would integrate with a payment gateway like Stripe, PayPal, etc.
        
        // Simulate processing time
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Simulate random failures (10% failure rate)
        if (Math.random() < 0.1) {
            throw new RuntimeException("Payment gateway error: Insufficient funds");
        }

        // Generate mock transaction ID
        return "TXN_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }

    private String processRefundWithPaymentGateway(String originalTransactionId, BigDecimal amount) {
        // In a real implementation, this would process refund with the payment gateway
        
        // Simulate processing time
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        // Generate mock refund transaction ID
        return "REF_" + UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
    }

    public boolean validatePaymentMethod(String paymentMethod) {
        // Basic validation for supported payment methods
        return paymentMethod != null && 
               (paymentMethod.equals("CREDIT_CARD") || 
                paymentMethod.equals("DEBIT_CARD") || 
                paymentMethod.equals("PAYPAL") ||
                paymentMethod.equals("BANK_TRANSFER"));
    }
}