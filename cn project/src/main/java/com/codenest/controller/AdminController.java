package com.codenest.controller;

import com.codenest.config.JwtUtils;
import com.codenest.model.User;
import com.codenest.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDateTime;
import java.util.concurrent.ConcurrentHashMap;

@Controller
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    // In-memory rate limiting and account lockout structures
    private final ConcurrentHashMap<String, Integer> loginAttempts = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, LocalDateTime> lockedAccounts = new ConcurrentHashMap<>();
    private static final int MAX_ATTEMPTS = 5;
    private static final int LOCKOUT_MINUTES = 15;

    @GetMapping("/admin/login")
    public String showAdminLoginPage() {
        return "admin-login";
    }

    @PostMapping("/admin/login")
    public String processAdminLogin(@RequestParam String username,
                                    @RequestParam String password,
                                    HttpServletResponse response,
                                    Model model) {
        // Check lockout
        if (lockedAccounts.containsKey(username)) {
            LocalDateTime lockTime = lockedAccounts.get(username);
            if (lockTime.plusMinutes(LOCKOUT_MINUTES).isAfter(LocalDateTime.now())) {
                model.addAttribute("error", "Account is locked due to too many failed attempts. Try again later.");
                logger.warn("Admin login attempt on locked account: {}", username);
                return "admin-login";
            } else {
                // Lockout expired
                lockedAccounts.remove(username);
                loginAttempts.remove(username);
            }
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(username, password)
            );

            if (authentication.isAuthenticated()) {
                User user = userService.findByUsername(username).orElse(null);

                if (user == null || !"ADMIN".equals(user.getRole())) {
                    logger.warn("Non-admin user attempted admin login: {}", username);
                    model.addAttribute("error", "Access Denied: Administrator privileges required.");
                    return "admin-login";
                }

                // Successful login
                loginAttempts.remove(username);
                lockedAccounts.remove(username);
                
                String token = jwtUtils.generateToken(username);
                Cookie jwtCookie = new Cookie("JWT", token);
                jwtCookie.setHttpOnly(true);
                jwtCookie.setPath("/");
                jwtCookie.setMaxAge(86400); // 24 hours
                response.addCookie(jwtCookie);
                
                logger.info("Admin user logged in successfully: {}", username);
                return "redirect:/admin/dashboard"; // As per requirement
            }
        } catch (Exception e) {
            // Failed login
            int attempts = loginAttempts.getOrDefault(username, 0) + 1;
            loginAttempts.put(username, attempts);
            
            logger.warn("Failed admin login attempt for user: {} (Attempt {})", username, attempts);

            if (attempts >= MAX_ATTEMPTS) {
                lockedAccounts.put(username, LocalDateTime.now());
                logger.error("Account locked for user: {} due to {} failed attempts", username, attempts);
                model.addAttribute("error", "Account locked due to multiple failed login attempts.");
            } else {
                model.addAttribute("error", "Invalid username or password.");
            }
        }

        return "admin-login";
    }

    @GetMapping("/admin/dashboard")
    public String adminDashboardRedirect() {
        // Redirect to existing admin page if that's the intention
        return "redirect:/admin";
    }
}
