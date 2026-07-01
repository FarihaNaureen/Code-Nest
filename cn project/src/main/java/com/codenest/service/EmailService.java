package com.codenest.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @org.springframework.beans.factory.annotation.Value("${spring.mail.username:}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            if (mailSender != null && !fromEmail.isEmpty() && !fromEmail.contains("your_gmail")) {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(fromEmail);
                message.setTo(toEmail);
                message.setSubject("Code Nest Academy - Your Verification Code");
                message.setText("Welcome wizard!\n\nYour OTP for registration is: " + otp + "\n\nDo not share this code with anyone.");
                mailSender.send(message);
                System.out.println("Email sent successfully to " + toEmail);
            } else {
                // Mock sending if SMTP is not configured
                System.out.println("=========================================");
                System.out.println("MOCK EMAIL SENDER (SMTP not configured)");
                System.out.println("To: " + toEmail);
                System.out.println("OTP: " + otp);
                System.out.println("=========================================");
            }
        } catch (Exception e) {
            System.err.println("Failed to send email. Falling back to mock email.");
            System.out.println("MOCK EMAIL SENDER - OTP: " + otp);
        }
    }
}
