package com.hotelbooking.service;

import com.hotelbooking.model.Booking;
import com.hotelbooking.model.Hotel;
import com.hotelbooking.model.RoomType;
import com.hotelbooking.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import reactor.core.publisher.Mono;
import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private GeminiAIService geminiAIService;

    @Value("${spring.mail.username:noreply@luxestay.com}")
    private String fromEmail;

    public void sendBookingConfirmationEmail(User user, Booking booking, Hotel hotel, RoomType roomType) {
        try {
            logger.info("🤖 Generating AI-powered booking confirmation email for: {}", user.getEmail());
            
            // Try to generate AI content first
            String htmlContent;
            try {
                htmlContent = generateAIBookingEmail(user, booking, hotel, roomType).block();
                logger.info("✅ AI email content generated successfully");
            } catch (Exception aiError) {
                logger.warn("⚠️ AI email generation failed, using fallback template: {}", aiError.getMessage());
                htmlContent = createBookingConfirmationHtml(user, booking, hotel, roomType);
            }

            // Log email content to console for testing
            logEmailToConsole("BOOKING CONFIRMATION", user.getEmail(), htmlContent);

            // Try to send email
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

                helper.setFrom(fromEmail);
                helper.setTo(user.getEmail());
                helper.setSubject("🎉 Booking Confirmed - LuxeStay Reservation #" + booking.getId());
                helper.setText(htmlContent, true);

                mailSender.send(message);
                logger.info("📧 Booking confirmation email sent successfully to: {}", user.getEmail());
            } catch (Exception emailError) {
                logger.warn("📧 SMTP not configured, email content logged to console: {}", emailError.getMessage());
            }

        } catch (Exception e) {
            logger.error("❌ Failed to process booking confirmation email for: {}", user.getEmail(), e);
        }
    }

    public void sendBookingCancellationEmail(User user, Booking booking, Hotel hotel, RoomType roomType) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(user.getEmail());
            helper.setSubject("❌ Booking Cancelled - LuxeStay Reservation #" + booking.getId());

            String htmlContent = createBookingCancellationHtml(user, booking, hotel, roomType);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Booking cancellation email sent to: {}", user.getEmail());

        } catch (MessagingException e) {
            logger.error("Failed to send booking cancellation email to: {}", user.getEmail(), e);
        } catch (Exception e) {
            logger.error("Unexpected error sending cancellation email to: {}", user.getEmail(), e);
        }
    }

    private String createBookingConfirmationHtml(User user, Booking booking, Hotel hotel, RoomType roomType) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
        BigDecimal totalAmount = booking.getTotalAmount();
        
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Booking Confirmation</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; }
                    .header { background: linear-gradient(135deg, #667eea 0%%, #764ba2 100%%); color: white; padding: 30px; text-align: center; }
                    .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
                    .header p { margin: 10px 0 0 0; opacity: 0.9; }
                    .content { padding: 30px; }
                    .booking-card { background: #f8fafc; border-radius: 12px; padding: 25px; margin: 20px 0; border-left: 4px solid #4f46e5; }
                    .hotel-info { display: flex; align-items: center; margin-bottom: 20px; }
                    .hotel-image { width: 80px; height: 80px; border-radius: 8px; object-fit: cover; margin-right: 15px; }
                    .hotel-details h3 { margin: 0 0 5px 0; color: #1f2937; font-size: 20px; }
                    .hotel-details p { margin: 0; color: #6b7280; }
                    .booking-details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0; }
                    .detail-item { background: white; padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
                    .detail-label { font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: 600; margin-bottom: 5px; }
                    .detail-value { font-size: 16px; color: #1f2937; font-weight: 600; }
                    .total-amount { background: #10b981; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
                    .total-amount h3 { margin: 0; font-size: 24px; }
                    .footer { background: #1f2937; color: white; padding: 25px; text-align: center; }
                    .footer p { margin: 5px 0; }
                    .contact-info { margin-top: 15px; }
                    .contact-info a { color: #60a5fa; text-decoration: none; }
                    @media (max-width: 600px) {
                        .booking-details { grid-template-columns: 1fr; }
                        .hotel-info { flex-direction: column; text-align: center; }
                        .hotel-image { margin: 0 0 15px 0; }
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🎉 Booking Confirmed!</h1>
                        <p>Thank you for choosing LuxeStay</p>
                    </div>
                    
                    <div class="content">
                        <p>Dear %s,</p>
                        <p>We're delighted to confirm your reservation. Your booking details are below:</p>
                        
                        <div class="booking-card">
                            <div class="hotel-info">
                                <img src="%s" alt="%s" class="hotel-image" onerror="this.src='https://via.placeholder.com/80x80/4f46e5/ffffff?text=Hotel'">
                                <div class="hotel-details">
                                    <h3>%s</h3>
                                    <p>📍 %s, %s</p>
                                    <p>⭐ %d-Star Hotel</p>
                                </div>
                            </div>
                            
                            <div class="booking-details">
                                <div class="detail-item">
                                    <div class="detail-label">Booking ID</div>
                                    <div class="detail-value">#%d</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Room Type</div>
                                    <div class="detail-value">%s</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Check-in Date</div>
                                    <div class="detail-value">%s</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Check-out Date</div>
                                    <div class="detail-value">%s</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Guests</div>
                                    <div class="detail-value">%d</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Status</div>
                                    <div class="detail-value">%s</div>
                                </div>
                            </div>
                            
                            <div class="total-amount">
                                <h3>Total Amount: ₹%,.2f</h3>
                                <p>Including all taxes and fees</p>
                            </div>
                        </div>
                        
                        <h3>📋 Important Information:</h3>
                        <ul>
                            <li><strong>Check-in Time:</strong> 3:00 PM onwards</li>
                            <li><strong>Check-out Time:</strong> 12:00 PM</li>
                            <li><strong>Cancellation:</strong> Free cancellation up to 24 hours before check-in</li>
                            <li><strong>ID Proof:</strong> Please carry a valid government-issued photo ID</li>
                            <li><strong>Payment:</strong> Payment confirmation will be sent separately</li>
                        </ul>
                        
                        <p>We look forward to welcoming you and ensuring you have a memorable stay!</p>
                        
                        <p>Best regards,<br>
                        <strong>The LuxeStay Team</strong></p>
                    </div>
                    
                    <div class="footer">
                        <p><strong>LuxeStay - Premium Hotel Booking</strong></p>
                        <div class="contact-info">
                            <p>📞 +91 1800-123-4567 | ✉️ <a href="mailto:support@luxestay.com">support@luxestay.com</a></p>
                            <p>🌐 <a href="http://localhost:3000">www.luxestay.com</a></p>
                        </div>
                        <p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
                            This is an automated email. Please do not reply to this message.
                        </p>
                    </div>
                </div>
            </body>
            </html>
            """,
            user.getFullName(),
            hotel.getMainImageUrl(),
            hotel.getName(),
            hotel.getName(),
            hotel.getAddress(),
            hotel.getCity(),
            hotel.getStarRating(),
            booking.getId(),
            roomType.getName(),
            booking.getCheckInDate().format(dateFormatter),
            booking.getCheckOutDate().format(dateFormatter),
            booking.getGuestCount(),
            booking.getStatus(),
            totalAmount
        );
    }

    private String createBookingCancellationHtml(User user, Booking booking, Hotel hotel, RoomType roomType) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
        
        return String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Booking Cancelled</title>
                <style>
                    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
                    .container { max-width: 600px; margin: 0 auto; background-color: white; }
                    .header { background: linear-gradient(135deg, #ef4444 0%%, #dc2626 100%%); color: white; padding: 30px; text-align: center; }
                    .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
                    .content { padding: 30px; }
                    .booking-card { background: #fef2f2; border-radius: 12px; padding: 25px; margin: 20px 0; border-left: 4px solid #ef4444; }
                    .footer { background: #1f2937; color: white; padding: 25px; text-align: center; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>❌ Booking Cancelled</h1>
                        <p>Your reservation has been cancelled</p>
                    </div>
                    
                    <div class="content">
                        <p>Dear %s,</p>
                        <p>Your booking has been successfully cancelled. Here are the details:</p>
                        
                        <div class="booking-card">
                            <h3>%s</h3>
                            <p><strong>Booking ID:</strong> #%d</p>
                            <p><strong>Room Type:</strong> %s</p>
                            <p><strong>Dates:</strong> %s to %s</p>
                            <p><strong>Cancellation Date:</strong> %s</p>
                        </div>
                        
                        <p>If you paid for this booking, your refund will be processed within 5-7 business days.</p>
                        
                        <p>We hope to serve you again in the future!</p>
                        
                        <p>Best regards,<br>
                        <strong>The LuxeStay Team</strong></p>
                    </div>
                    
                    <div class="footer">
                        <p><strong>LuxeStay - Premium Hotel Booking</strong></p>
                        <p>📞 +91 1800-123-4567 | ✉️ support@luxestay.com</p>
                    </div>
                </div>
            </body>
            </html>
            """,
            user.getFullName(),
            hotel.getName(),
            booking.getId(),
            roomType.getName(),
            booking.getCheckInDate().format(dateFormatter),
            booking.getCheckOutDate().format(dateFormatter),
            java.time.LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd MMM yyyy, HH:mm"))
        );
    }

    private Mono<String> generateAIBookingEmail(User user, Booking booking, Hotel hotel, RoomType roomType) {
        DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("dd MMM yyyy");
        
        String prompt = String.format("""
            Create a beautiful, professional HTML email for a hotel booking confirmation. Use the following details:
            
            Customer: %s
            Hotel: %s (%d-star) in %s, %s
            Room Type: %s
            Booking ID: %d
            Check-in: %s
            Check-out: %s
            Guests: %d
            Total Amount: ₹%,.2f
            Hotel Image: %s
            
            Requirements:
            1. Create a complete HTML email with modern styling and LuxeStay branding
            2. Include hotel image and all booking details in an organized layout
            3. Add check-in/out times, cancellation policy, and contact information
            4. Use professional blue/white colors and responsive design
            5. Make it warm, welcoming, and include appropriate emojis
            6. Add a footer with LuxeStay contact details
            
            Generate only the HTML content, no explanations.
            """,
            user.getFullName(),
            hotel.getName(),
            hotel.getStarRating(),
            hotel.getCity(),
            hotel.getCountry(),
            roomType.getName(),
            booking.getId(),
            booking.getCheckInDate().format(dateFormatter),
            booking.getCheckOutDate().format(dateFormatter),
            booking.getGuestCount(),
            booking.getTotalAmount(),
            hotel.getMainImageUrl()
        );

        return geminiAIService.generateResponse(prompt, user.getFullName(), user.getRole().toString())
                .onErrorReturn(createBookingConfirmationHtml(user, booking, hotel, roomType));
    }

    private void logEmailToConsole(String emailType, String recipient, String content) {
        logger.info("=".repeat(80));
        logger.info("📧 {} EMAIL", emailType);
        logger.info("To: {}", recipient);
        logger.info("Subject: LuxeStay - {}", emailType);
        logger.info("Content Preview (first 500 chars):");
        logger.info(content.substring(0, Math.min(content.length(), 500)) + "...");
        logger.info("=".repeat(80));
    }

    public void sendWelcomeEmail(User user) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Welcome to LuxeStay! 🎉");
            message.setText(String.format("""
                Dear %s,
                
                Welcome to LuxeStay - India's premier hotel booking platform!
                
                We're excited to have you join our community of travelers who trust us for their accommodation needs.
                
                With LuxeStay, you can:
                ✅ Book luxury hotels across India
                ✅ Enjoy competitive prices and exclusive deals
                ✅ Get 24/7 customer support
                ✅ Experience hassle-free booking and cancellation
                
                Start exploring our collection of premium hotels and make your next trip unforgettable!
                
                Visit us at: http://localhost:3000
                
                Best regards,
                The LuxeStay Team
                
                📞 +91 1800-123-4567
                ✉️ support@luxestay.com
                """, user.getFullName()));

            mailSender.send(message);
            logger.info("Welcome email sent to: {}", user.getEmail());

        } catch (Exception e) {
            logger.error("Failed to send welcome email to: {}", user.getEmail(), e);
        }
    }
}