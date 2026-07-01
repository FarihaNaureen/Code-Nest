package com.codenest.controller;

import com.codenest.config.JwtUtils;
import com.codenest.model.Level;
import com.codenest.model.Submission;
import com.codenest.model.User;
import com.codenest.repository.LevelRepository;
import com.codenest.repository.SubmissionRepository;
import com.codenest.service.ChallengeService;
import com.codenest.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/game")
public class GameController {

    // Server-enforced hint cost — ignores any client-sent value (Bug 11)
    private static final int HINT_MANA_COST = 10;

    @Autowired
    private UserService userService;

    @Autowired
    private LevelRepository levelRepository;

    @Autowired
    private ChallengeService challengeService;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private String getAuthenticatedUsername() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    @GetMapping("/progress")
    public ResponseEntity<?> getProgress() {
        String username = getAuthenticatedUsername();
        if ("anonymousUser".equals(username)) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User user = userService.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }

    @PostMapping("/run-code")
    public ResponseEntity<?> runCode(@RequestBody Map<String, String> payload) {
        String levelId = payload.get("levelId");
        String language = payload.get("language");
        String code = payload.get("code");

        Level level = levelRepository.findById(levelId).orElse(null);
        if (level == null) {
            return ResponseEntity.badRequest().body("Invalid Level ID: " + levelId);
        }

        ChallengeService.ValidationResult result = challengeService.validateCode(level, language, code);

        // Save this attempt to submission history
        String username = getAuthenticatedUsername();
        if (!"anonymousUser".equals(username)) {
            User user = userService.findByUsername(username).orElse(null);
            if (user != null) {
                String status = result.isSuccess() ? "PASSED" : "FAILED";
                int score = result.isSuccess() ? 100 : 0;
                Submission submission = new Submission(user.getId(), username, levelId, language, code, status, score);
                submissionRepository.save(submission);
            }
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/submissions")
    public ResponseEntity<?> getMySubmissions() {
        String username = getAuthenticatedUsername();
        if ("anonymousUser".equals(username)) {
            return ResponseEntity.status(401).body("Unauthorized");
        }
        User user = userService.findByUsername(username).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        List<Submission> history = submissionRepository.findByUserIdOrderByTimestampDesc(user.getId());
        return ResponseEntity.ok(history);
    }

    // 🔴 THIS IS THE MISSING ENDPOINT - ADD THIS!
    @PostMapping("/log-submission")
    public ResponseEntity<?> logSubmission(@RequestBody Map<String, String> payload) {
        System.out.println("📨 /log-submission endpoint called!");
        
        String username = getAuthenticatedUsername();
        System.out.println("Username: " + username);
        
        if ("anonymousUser".equals(username)) {
            System.out.println("❌ User is anonymous!");
            return ResponseEntity.status(401).body(Map.of("error", "User not authenticated"));
        }
        
        User user = userService.findByUsername(username).orElse(null);
        System.out.println("User Found: " + (user != null ? user.getUsername() : "NULL"));
        
        if (user == null) {
            System.out.println("❌ User not found in database!");
            return ResponseEntity.status(404).body(Map.of("error", "User not found"));
        }

        String levelId = payload.get("levelId");
        String language = payload.get("language");
        String code = payload.get("code");
        String status = payload.get("status");
        
        System.out.println("LevelId: " + levelId);
        System.out.println("Language: " + language);
        System.out.println("Status: " + status);
        
        int score = "PASSED".equals(status) ? 100 : 0;

        Submission submission = new Submission(user.getId(), username, levelId, language, code, status, score);
        System.out.println("💾 Saving submission...");
        
        Submission saved = submissionRepository.save(submission);
        
        System.out.println("✅ SUCCESS! Saved submission with ID: " + saved.getId());
        System.out.println("✅ Timestamp: " + saved.getTimestamp());

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("submissionId", saved.getId());
        response.put("timestamp", saved.getTimestamp());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/complete")
    public ResponseEntity<?> completeLevel(@RequestBody Map<String, Object> payload) {
        String levelId = (String) payload.get("levelId");
        int stars = (Integer) payload.get("stars");

        // Validate stars value server-side (Bug 12)
        if (stars < 1 || stars > 3) {
            return ResponseEntity.badRequest()
                .body("Invalid stars value. Must be between 1 and 3.");
        }

        Level level = levelRepository.findById(levelId).orElse(null);
        if (level == null) {
            return ResponseEntity.badRequest().body("Invalid Level ID: " + levelId);
        }

        // Rewards scale with difficulty
        int goldReward = "Hard".equalsIgnoreCase(level.getDifficulty()) ? 200 : "Medium".equalsIgnoreCase(level.getDifficulty()) ? 100 : 50;
        int xpReward = "Hard".equalsIgnoreCase(level.getDifficulty()) ? 150 : "Medium".equalsIgnoreCase(level.getDifficulty()) ? 80 : 40;

        String username = getAuthenticatedUsername();
        User updatedUser = userService.completeLevel(username, levelId, stars, goldReward, xpReward);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("user", updatedUser);
        response.put("goldReward", goldReward);
        response.put("xpReward", xpReward);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/buy-hint")
    public ResponseEntity<?> buyHint(@RequestBody Map<String, Object> payload) {
        String levelId = (String) payload.get("levelId");
        int hintIndex = (Integer) payload.get("hintIndex");
        int cost = HINT_MANA_COST; // Server-enforced cost, ignores client-sent value

        Level level = levelRepository.findById(levelId).orElse(null);
        if (level == null) {
            return ResponseEntity.badRequest().body("Invalid Level ID: " + levelId);
        }

        if (hintIndex < 0 || hintIndex >= level.getHints().size()) {
            return ResponseEntity.badRequest().body("No more hints available for this level.");
        }

        String username = getAuthenticatedUsername();
        try {
            User updatedUser = userService.buyHint(username, levelId, cost);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("hint", level.getHints().get(hintIndex));
            response.put("user", updatedUser);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/profile/avatar")
    public ResponseEntity<?> updateProfileAvatar(@RequestBody Map<String, String> payload) {
        String avatar = payload.get("avatar");
        String username = getAuthenticatedUsername();
        try {
            User updatedUser = userService.updateAvatar(username, avatar);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/profile/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> payload,
                                           HttpServletResponse response) {
        String currentUsername = getAuthenticatedUsername();
        try {
            String newUsername = (String) payload.get("username");
            String fullName = (String) payload.get("fullName");
            String location = (String) payload.get("location");
            String work = (String) payload.get("work");
            String education = (String) payload.get("education");
            String website = (String) payload.get("website");
            String bio = (String) payload.get("bio");
            java.util.List<String> skills = (java.util.List<String>) payload.get("skills");

            User updatedUser = userService.updateProfile(currentUsername, newUsername, fullName, location, work, education, website, bio, skills);

            // If username changed, reissue JWT so the session stays valid (Bug 9)
            if (!currentUsername.equals(updatedUser.getUsername())) {
                String newToken = jwtUtils.generateToken(updatedUser.getUsername());
                Cookie jwtCookie = new Cookie("JWT", newToken);
                jwtCookie.setHttpOnly(true);
                jwtCookie.setPath("/");
                jwtCookie.setMaxAge(86400); // 24 hours
                response.addCookie(jwtCookie);
            }

            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/claim-achievement")
    public ResponseEntity<?> claimAchievement(@RequestBody Map<String, String> payload) {
        String achievementId = payload.get("achievementId");
        if (achievementId == null || achievementId.isEmpty()) {
            return ResponseEntity.badRequest().body("Achievement ID is required");
        }
        
        String username = getAuthenticatedUsername();
        try {
            User updatedUser = userService.claimAchievement(username, achievementId);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("user", updatedUser);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}