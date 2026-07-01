package com.codenest.service;

import com.codenest.model.Achievement;
import com.codenest.model.User;
import com.codenest.repository.AchievementRepository;
import com.codenest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String username, String email, String password) {
        if (userRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Username already exists!");
        }
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Email already exists!");
        }
        if (password == null || password.length() < 6) {
            throw new IllegalArgumentException("Password must be at least 6 characters long.");
        }

        User user = new User(username, passwordEncoder.encode(password), email);
        // Seed default achievement for registering
        user.getUnlockedAchievements().add("first_login");
        user.setGold(user.getGold() + 100);
        user.setXp(user.getXp() + 50);

        return userRepository.save(user);
    }

    public Optional<User> findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public void updateStreak(User user) {
        LocalDate today = LocalDate.now();
        LocalDate lastActive = user.getLastActiveDate();

        if (lastActive == null) {
            user.setStreak(1);
        } else if (lastActive.isBefore(today)) {
            if (lastActive.equals(today.minusDays(1))) {
                user.setStreak(user.getStreak() + 1);
                // Reward for streak increment
                user.setGold(user.getGold() + 20 * user.getStreak());
                user.setMana(user.getMana() + 10);
            } else {
                user.setStreak(1); // Reset streak
            }
        }
        user.setLastActiveDate(today);
        userRepository.save(user);
    }

    public User completeLevel(String username, String levelId, int stars, int goldReward, int xpReward) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        if (!user.getCompletedLevels().contains(levelId)) {
            user.getCompletedLevels().add(levelId);
            user.setGold(user.getGold() + goldReward);
            user.setXp(user.getXp() + xpReward);
            user.setMana(user.getMana() + 15); // Completing levels recovers some mana
        }

        // Keep maximum stars
        int previousStars = user.getLevelStars().getOrDefault(levelId, 0);
        if (stars > previousStars) {
            user.getLevelStars().put(levelId, stars);
        }

        // Check for achievements based on level completion
        checkAchievements(user, levelId);

        // World unlock logic removed: all worlds are already unlocked by default in the User constructor

        return userRepository.save(user);
    }

    public User buyHint(String username, String levelId, int hintCost) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        if (user.getMana() < hintCost) {
            throw new IllegalArgumentException("Insufficient Mana to buy a hint!");
        }

        user.setMana(user.getMana() - hintCost);
        return userRepository.save(user);
    }

    public User updateAvatar(String username, String avatar) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        user.setAvatar(avatar);
        return userRepository.save(user);
    }

    public List<User> getGlobalLeaderboard() {
        // Return top 20 non-admin players sorted by XP descending
        return userRepository.findAll().stream()
                .filter(u -> !"ADMIN".equals(u.getRole()))
                .sorted((u1, u2) -> Integer.compare(u2.getXp(), u1.getXp()))
                .limit(20)
                .toList();
    }

    private void checkAchievements(User user, String completedLevelId) {
        List<String> achievements = user.getUnlockedAchievements();

        // Achievement: First Challenge
        if (!achievements.contains("first_challenge")) {
            unlockAchievement(user, "first_challenge");
        }

        // Achievement: Array Master (complete world_1_4 Reverse Array)
        if (completedLevelId.equals("world_1_4") && !achievements.contains("array_master")) {
            unlockAchievement(user, "array_master");
        }

        // Achievement: String Wizard (complete world_1_7 Frequency Castle)
        if (completedLevelId.equals("world_1_7") && !achievements.contains("string_wizard")) {
            unlockAchievement(user, "string_wizard");
        }

        // Achievement: Linked List Hero (complete world_2_5 Reverse Journey)
        if (completedLevelId.equals("world_2_5") && !achievements.contains("linked_list_hero")) {
            unlockAchievement(user, "linked_list_hero");
        }

        // Achievement: Stack Master (complete world_3_1 The Alchemist's Challenge)
        if (completedLevelId.equals("world_3_1") && !achievements.contains("stack_master")) {
            unlockAchievement(user, "stack_master");
        }

        // Achievement: Queue Champion (complete world_3_3 Queue Escape Gate)
        if (completedLevelId.equals("world_3_3") && !achievements.contains("queue_champion")) {
            unlockAchievement(user, "queue_champion");
        }

        // Achievement: Search Explorer (complete world_4_3 Binary Temple)
        if (completedLevelId.equals("world_4_3") && !achievements.contains("search_explorer")) {
            unlockAchievement(user, "search_explorer");
        }

        // Achievement: Coding Legend (complete all boss battles)
        if (completedLevelId.equals("world_4_10") && !achievements.contains("coding_legend")) {
            unlockAchievement(user, "coding_legend");
        }
    }

    private void unlockAchievement(User user, String achievementId) {
        if (!user.getUnlockedAchievements().contains(achievementId)) {
            user.getUnlockedAchievements().add(achievementId);
        }
    }

    public User claimAchievement(String username, String achievementId) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));
        
        if (!user.getUnlockedAchievements().contains(achievementId)) {
            throw new IllegalArgumentException("Achievement not unlocked yet!");
        }
        if (user.getClaimedAchievements().contains(achievementId)) {
            throw new IllegalArgumentException("Achievement already claimed!");
        }

        Optional<Achievement> achOpt = achievementRepository.findById(achievementId);
        if (achOpt.isPresent()) {
            Achievement ach = achOpt.get();
            user.setGold(user.getGold() + ach.getGoldReward());
            user.setXp(user.getXp() + ach.getXpReward());
            user.getClaimedAchievements().add(achievementId);
            return userRepository.save(user);
        } else {
            throw new IllegalArgumentException("Achievement data not found!");
        }
    }

    /**
     * Ensures the "first_login" achievement is present without clearing any existing achievements.
     * This is safe to call on every login — it is idempotent.
     */
    public void ensureFirstLoginAchievement(User user) {
        if (!user.getUnlockedAchievements().contains("first_login")) {
            user.getUnlockedAchievements().add("first_login");
            userRepository.save(user);
        }
    }

    public User updateProfile(String currentUsername, String newUsername, String fullName, String location, String work, String education, String website, String bio, List<String> skills) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + currentUsername));
        
        if (newUsername != null && !newUsername.trim().isEmpty() && !newUsername.equals(currentUsername)) {
            if (userRepository.findByUsername(newUsername).isPresent()) {
                throw new IllegalArgumentException("Username is already taken");
            }
            user.setUsername(newUsername.trim());
        }
        
        user.setFullName(fullName);
        user.setLocation(location);
        user.setWork(work);
        user.setEducation(education);
        user.setWebsite(website);
        user.setBio(bio);
        user.setSkills(skills);
        return userRepository.save(user);
    }

    /**
     * Unlocks the multiplayer_expert achievement the first time a user joins a multiplayer room.
     * Idempotent — does nothing if already unlocked.
     */
    public void unlockMultiplayerAchievement(String username) {
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (!user.getUnlockedAchievements().contains("multiplayer_expert")) {
                user.getUnlockedAchievements().add("multiplayer_expert");
                userRepository.save(user);
            }
        }
    }
}
