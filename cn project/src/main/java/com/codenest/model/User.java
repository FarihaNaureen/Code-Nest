package com.codenest.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "users")
public class User {
    @Id
    private String id;
    private String username;
    private String password;
    private String email;
    private String role = "USER";
    private int xp = 0;
    private int gold = 1250; // Starting gold as seen in UI screenshots
    private int mana = 45;   // Starting mana as seen in UI screenshots
    private int gems = 8;    // Starting gems as seen in UI screenshots
    private int streak = 1;
    private LocalDate lastActiveDate = LocalDate.now();
    private List<String> unlockedWorlds = new ArrayList<>();
    private List<String> completedLevels = new ArrayList<>();
    private List<String> unlockedAchievements = new ArrayList<>();
    private List<String> claimedAchievements = new ArrayList<>();
    private Map<String, Integer> levelStars = new HashMap<>(); // levelId -> stars (1-3)
    private String avatar = "default_avatar.png";
    private String fullName;
    private String location;
    private String work;
    private String education;
    private String website;
    private String bio;
    private List<String> skills = new ArrayList<>();

    public User() {
        // All worlds are accessible by default; first level of each is playable
        this.unlockedWorlds.add("world_1");
        this.unlockedWorlds.add("world_2");
        this.unlockedWorlds.add("world_3");
        this.unlockedWorlds.add("world_4");
    }

    public User(String username, String password, String email) {
        this();
        this.username = username;
        this.password = password;
        this.email = email;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public int getXp() { return xp; }
    public void setXp(int xp) { this.xp = xp; }

    public int getGold() { return gold; }
    public void setGold(int gold) { this.gold = gold; }

    public int getMana() { return mana; }
    public void setMana(int mana) { this.mana = mana; }

    public int getGems() { return gems; }
    public void setGems(int gems) { this.gems = gems; }

    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }

    public LocalDate getLastActiveDate() { return lastActiveDate; }
    public void setLastActiveDate(LocalDate lastActiveDate) { this.lastActiveDate = lastActiveDate; }

    public List<String> getUnlockedWorlds() { return unlockedWorlds; }
    public void setUnlockedWorlds(List<String> unlockedWorlds) { this.unlockedWorlds = unlockedWorlds; }

    public List<String> getCompletedLevels() { return completedLevels; }
    public void setCompletedLevels(List<String> completedLevels) { this.completedLevels = completedLevels; }

    public List<String> getUnlockedAchievements() { return unlockedAchievements; }
    public void setUnlockedAchievements(List<String> unlockedAchievements) { this.unlockedAchievements = unlockedAchievements; }

    public List<String> getClaimedAchievements() { return claimedAchievements; }
    public void setClaimedAchievements(List<String> claimedAchievements) { this.claimedAchievements = claimedAchievements; }

    public Map<String, Integer> getLevelStars() { return levelStars; }
    public void setLevelStars(Map<String, Integer> levelStars) { this.levelStars = levelStars; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }

    public String getWork() { return work; }
    public void setWork(String work) { this.work = work; }

    public String getEducation() { return education; }
    public void setEducation(String education) { this.education = education; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }

    public boolean isCustomAvatar() {
        return this.avatar != null && this.avatar.trim().startsWith("{");
    }

    public String getAvatarDisplay() {
        String avatarVal = this.avatar;
        if (avatarVal == null || "default_avatar.png".equals(avatarVal) || isCustomAvatar()) {
            return "/images/avatars/avatar_wizard.png";
        }
        if (avatarVal.startsWith("/")) {
            return avatarVal;
        }
        // Map old emojis to the new 2D character paths
        switch (avatarVal.trim()) {
            case "🧙‍♂️": return "/images/avatars/avatar_wizard.png";
            case "🥷": return "/images/avatars/avatar_ninja.png";
            case "🧝‍♂️": return "/images/avatars/avatar_elf_male.png";
            case "🧝‍♀️": return "/images/avatars/avatar_elf_female.png";
            case "🧛": return "/images/avatars/avatar_vampire.png";
            case "🐉": return "/images/avatars/avatar_dragon.png";
            case "👾": return "/images/avatars/avatar_retro_alien.png";
            case "🤖": return "/images/avatars/avatar_robot.png";
            case "🦁": return "/images/avatars/avatar_lion.png";
            case "🦄": return "/images/avatars/avatar_unicorn.png";
            case "🧜‍♀️": return "/images/avatars/avatar_mermaid.png";
            case "🧚‍♀️": return "/images/avatars/avatar_fairy.png";
            case "🦊": return "/images/avatars/avatar_fox.png";
            case "🐺": return "/images/avatars/avatar_wolf.png";
            case "🦉": return "/images/avatars/avatar_owl.png";
            case "🧟": return "/images/avatars/avatar_zombie.png";
            case "👩‍💻": return "/images/avatars/avatar_coder_female.png";
            case "👨‍💻": return "/images/avatars/avatar_coder_male.png";
            default: return "/images/avatars/avatar_wizard.png";
        }
    }

    public Map<String, String> getAvatarAttributes() {
        if (isCustomAvatar()) {
            try {
                com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                Map<String, String> rawMap = mapper.readValue(this.avatar, new com.fasterxml.jackson.core.type.TypeReference<Map<String, String>>() {});
                Map<String, String> formattedMap = new java.util.LinkedHashMap<>();
                for (Map.Entry<String, String> entry : rawMap.entrySet()) {
                    String formattedKey = camelCaseToTitle(entry.getKey());
                    formattedMap.put(formattedKey, entry.getValue());
                }
                return formattedMap;
            } catch (Exception e) {
                // Return empty map on error
            }
        }
        return new java.util.HashMap<>();
    }

    private String camelCaseToTitle(String camelCase) {
        if (camelCase == null || camelCase.isEmpty()) return "";
        StringBuilder result = new StringBuilder();
        result.append(Character.toUpperCase(camelCase.charAt(0)));
        for (int i = 1; i < camelCase.length(); i++) {
            char c = camelCase.charAt(i);
            if (Character.isUpperCase(c)) {
                result.append(" ");
            }
            result.append(c);
        }
        return result.toString();
    }
}

