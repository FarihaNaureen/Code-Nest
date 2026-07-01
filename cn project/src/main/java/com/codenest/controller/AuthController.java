package com.codenest.controller;

import com.codenest.config.JwtUtils;
import com.codenest.model.User;
import com.codenest.service.UserService;
import com.codenest.service.EmailService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.security.SecureRandom;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private EmailService emailService;

    @GetMapping("/login")
    public String showLoginPage() {
        return "login";
    }

    @GetMapping("/register")
    public String showRegisterPage() {
        return "register";
    }



    @PostMapping("/register")
    public String registerUser(@RequestParam String username, @RequestParam String email,
                               @RequestParam String password, HttpSession session, Model model) {
        try {
            // Validate password length here just in case before OTP
            if (password == null || password.length() < 6) {
                throw new IllegalArgumentException("Password must be at least 6 characters long.");
            }
            if (userService.findByUsername(username).isPresent()) {
                throw new IllegalArgumentException("Username already exists!");
            }

            // Generate 6-digit OTP using SecureRandom for cryptographic strength
            String otp = String.format("%06d", new SecureRandom().nextInt(999999));
            
            // Store registration data in session
            session.setAttribute("reg_username", username);
            session.setAttribute("reg_email", email);
            session.setAttribute("reg_password", password);
            session.setAttribute("reg_otp", otp);
            session.setAttribute("reg_otp_time", System.currentTimeMillis());
            session.setAttribute("reg_otp_attempts", 0);
            
            // Send email
            emailService.sendOtpEmail(email, otp);
            
            model.addAttribute("email", email);
            return "verify-otp";
        } catch (Exception e) {
            model.addAttribute("error", e.getMessage());
            return "register";
        }
    }

    @PostMapping("/register/verify")
    public String verifyOtp(@RequestParam String otp, HttpSession session, Model model) {
        String sessionOtp = (String) session.getAttribute("reg_otp");
        String username = (String) session.getAttribute("reg_username");
        String email = (String) session.getAttribute("reg_email");
        String password = (String) session.getAttribute("reg_password");
        Long otpTime = (Long) session.getAttribute("reg_otp_time");
        Integer attempts = (Integer) session.getAttribute("reg_otp_attempts");
        if (attempts == null) attempts = 0;

        // Check OTP expiry (10 minutes)
        if (otpTime == null || System.currentTimeMillis() - otpTime > 600000) {
            session.removeAttribute("reg_username");
            session.removeAttribute("reg_email");
            session.removeAttribute("reg_password");
            session.removeAttribute("reg_otp");
            session.removeAttribute("reg_otp_time");
            session.removeAttribute("reg_otp_attempts");
            model.addAttribute("error", "OTP has expired. Please register again.");
            model.addAttribute("email", email);
            return "verify-otp";
        }

        if (sessionOtp == null || !sessionOtp.equals(otp)) {
            attempts++;
            session.setAttribute("reg_otp_attempts", attempts);

            // Check attempt limit (max 5)
            if (attempts >= 5) {
                session.removeAttribute("reg_username");
                session.removeAttribute("reg_email");
                session.removeAttribute("reg_password");
                session.removeAttribute("reg_otp");
                session.removeAttribute("reg_otp_time");
                session.removeAttribute("reg_otp_attempts");
                model.addAttribute("error", "Too many failed attempts. Please register again.");
                return "register";
            }

            model.addAttribute("error", "Invalid or expired OTP!");
            model.addAttribute("email", email);
            return "verify-otp";
        }

        try {
            // Complete registration
            userService.registerUser(username, email, password);
            
            // Clear session data
            session.removeAttribute("reg_username");
            session.removeAttribute("reg_email");
            session.removeAttribute("reg_password");
            session.removeAttribute("reg_otp");
            session.removeAttribute("reg_otp_time");
            session.removeAttribute("reg_otp_attempts");
            
            return "redirect:/auth/login?registered=true";
        } catch (IllegalArgumentException e) {
            model.addAttribute("error", e.getMessage());
            return "register";
        }
    }

    @PostMapping("/login")
    public String loginUser(@RequestParam String username, @RequestParam String password,
                            HttpServletResponse response, Model model) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            if (authentication.isAuthenticated()) {
                String token = jwtUtils.generateToken(username);

                // Set secure HTTP-only cookie
                Cookie jwtCookie = new Cookie("JWT", token);
                jwtCookie.setHttpOnly(true);
                jwtCookie.setPath("/");
                jwtCookie.setMaxAge(86400); // 24 hours
                response.addCookie(jwtCookie);

                // Update active streak
                User user = userService.findByUsername(username).orElse(null);
                if (user != null) {
                    userService.updateStreak(user);
                    // Ensure first_login achievement exists (idempotent, never clears others)
                    userService.ensureFirstLoginAchievement(user);
                    if ("ADMIN".equals(user.getRole())) {
                        return "redirect:/admin";
                    }
                }

                return "redirect:/map";
            }
        } catch (Exception e) {
            model.addAttribute("error", "Invalid username or password.");
        }
        return "login";
    }



    @GetMapping("/logout")
    public String logoutUser(HttpServletResponse response) {
        Cookie jwtCookie = new Cookie("JWT", "");
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0); // Clear immediately
        response.addCookie(jwtCookie);
        return "redirect:/";
    }
}
