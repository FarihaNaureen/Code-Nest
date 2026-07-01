package com.codenest.controller;

import com.codenest.model.Achievement;
import com.codenest.model.Level;
import com.codenest.model.MultiplayerRoom;
import com.codenest.model.Submission;
import com.codenest.model.User;
import com.codenest.model.World;
import com.codenest.repository.AchievementRepository;
import com.codenest.repository.LevelRepository;
import com.codenest.repository.MultiplayerRoomRepository;
import com.codenest.repository.SubmissionRepository;
import com.codenest.repository.WorldRepository;
import com.codenest.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import com.codenest.repository.UserRepository;

import java.util.List;
import java.util.Optional;

@Controller
public class PageController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorldRepository worldRepository;

    @Autowired
    private LevelRepository levelRepository;

    @Autowired
    private AchievementRepository achievementRepository;

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private MultiplayerRoomRepository multiplayerRoomRepository;

    private User getAuthenticatedUser() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        if ("anonymousUser".equals(username)) return null;
        return userService.findByUsername(username).orElse(null);
    }

    @GetMapping("/")
    public String showLandingPage(Model model) {
        User user = getAuthenticatedUser();
        if (user != null) {
            model.addAttribute("currentUser", user);
        }
        return "index";
    }

    @GetMapping("/map")
    public String showWorldMap(Model model) {
        User user = getAuthenticatedUser();
        if (user == null) return "redirect:/auth/login";

        if ("ADMIN".equals(user.getRole())) {
            return "redirect:/admin";
        }

        // The old Thymeleaf-driven world map has been replaced by the
        // standalone GAME_33 game, served as a static page.
        return "redirect:/play-game.html";
    }

    @GetMapping("/world/{worldId}/levels")
    public String showLevelSelection(@PathVariable String worldId, Model model) {
        User user = getAuthenticatedUser();
        if (user == null) return "redirect:/auth/login";

        World world = worldRepository.findById(worldId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid world ID: " + worldId));
        List<Level> levels = levelRepository.findByWorldIdOrderByNumberAsc(worldId);

        model.addAttribute("currentUser", user);
        model.addAttribute("world", world);
        model.addAttribute("levels", levels);
        return "levelSelect";
    }

    @GetMapping("/gameplay/{levelId}")
    public String showGameplayPage(@PathVariable String levelId, Model model) {
        User user = getAuthenticatedUser();
        if (user == null) return "redirect:/auth/login";

        if ("ADMIN".equals(user.getRole())) {
            return "redirect:/admin";
        }

        // The old per-level gameplay screen has been replaced by the
        // standalone GAME_33 game, which manages its own level flow.
        return "redirect:/play-game.html";
    }

    // In-memory mapping of active rooms to selected levels
    private static final java.util.concurrent.ConcurrentHashMap<String, String> activeRoomLevels = new java.util.concurrent.ConcurrentHashMap<>();

    @GetMapping("/multiplayer")
    public String showMultiplayerLobby(Model model) {
        User user = getAuthenticatedUser();
        if (user == null) return "redirect:/auth/login";

        model.addAttribute("currentUser", user);
        model.addAttribute("levels", levelRepository.findAll());
        return "multiplayer";
    }

    @GetMapping("/multiplayer/room/{roomCode}")
    public String showMultiplayerRoom(@PathVariable String roomCode, 
                                      @org.springframework.web.bind.annotation.RequestParam(required = false) String levelId, 
                                      Model model) {
        User user = getAuthenticatedUser();
        if (user == null) return "redirect:/auth/login";

        String codeUpper = roomCode.toUpperCase();

        // Load or create the persistent room document
        MultiplayerRoom room = multiplayerRoomRepository.findByRoomCode(codeUpper).orElse(null);
        if (room == null) {
            room = new MultiplayerRoom(codeUpper, "Room " + codeUpper, user.getUsername());
        }

        // Add joining user to participants if not already present
        if (!room.getParticipants().contains(user.getUsername())) {
            room.getParticipants().add(user.getUsername());
        }

        // Determine the level: prefer query param, then room's stored level, then cache, then default
        if (levelId != null && !levelId.trim().isEmpty()) {
            room.setCurrentLevelId(levelId);
            activeRoomLevels.put(codeUpper, levelId);
        } else if (room.getCurrentLevelId() != null) {
            levelId = room.getCurrentLevelId();
            activeRoomLevels.put(codeUpper, levelId);
        } else {
            levelId = activeRoomLevels.get(codeUpper);
        }

        // Default fallback to first level if none selected or found
        if (levelId == null) {
            List<Level> allLevels = levelRepository.findAll();
            if (!allLevels.isEmpty()) {
                levelId = allLevels.get(0).getId();
                room.setCurrentLevelId(levelId);
                activeRoomLevels.put(codeUpper, levelId);
            }
        }

        // Persist room state to MongoDB
        multiplayerRoomRepository.save(room);

        // Unlock multiplayer_expert achievement on first room join (Bug 13)
        userService.unlockMultiplayerAchievement(user.getUsername());

        Level level = null;
        if (levelId != null) {
            level = levelRepository.findById(levelId).orElse(null);
        }

        model.addAttribute("currentUser", user);
        model.addAttribute("roomCode", codeUpper);
        model.addAttribute("level", level);
        return "multiplayer_room";
    }

    @GetMapping("/leaderboard")
    public String showLeaderboard(Model model) {
        User user = getAuthenticatedUser();
        if (user == null) return "redirect:/auth/login";

        List<User> topPlayers = userService.getGlobalLeaderboard();

        model.addAttribute("currentUser", user);
        model.addAttribute("topPlayers", topPlayers);
        return "leaderboards";
    }

    @GetMapping("/achievements")
    public String showAchievements(Model model) {
        User user = getAuthenticatedUser();
        if (user == null) return "redirect:/auth/login";

        List<Achievement> allAchievements = achievementRepository.findAll();

        model.addAttribute("currentUser", user);
        model.addAttribute("achievements", allAchievements);
        return "achievements";
    }

    @GetMapping("/admin")
    public String showAdminPanel(Model model) {
        User user = getAuthenticatedUser();
        if (user == null) return "redirect:/auth/login";
        if (!"ADMIN".equals(user.getRole())) {
            return "redirect:/map";
        }

        List<User> allUsers = userRepository.findAll(); // Show ALL registered users, not just leaderboard top 20
        List<Submission> recentSubmissions = submissionRepository.findTop100ByOrderByTimestampDesc();

        model.addAttribute("currentUser", user);
        model.addAttribute("users", allUsers);
        model.addAttribute("totalWorlds", worldRepository.count());
        model.addAttribute("totalLevels", levelRepository.count());
        model.addAttribute("submissions", recentSubmissions);
        return "admin";
    }

    @PostMapping("/admin/user/delete/{id}")
    public String deleteUser(@PathVariable String id) {
        User user = getAuthenticatedUser();
        if (user != null && "ADMIN".equals(user.getRole())) {
            userRepository.deleteById(id);
        }
        return "redirect:/admin";
    }

    @GetMapping("/admin/user/edit/{id}")
    public String editUserPage(@PathVariable String id, Model model) {
        User user = getAuthenticatedUser();
        if (user == null || !"ADMIN".equals(user.getRole())) return "redirect:/admin";
        
        Optional<User> targetUser = userRepository.findById(id);
        if (targetUser.isPresent()) {
            model.addAttribute("targetUser", targetUser.get());
            return "admin-edit-user";
        }
        return "redirect:/admin";
    }

    @PostMapping("/admin/user/edit/{id}")
    public String updateUser(@PathVariable String id, @RequestParam String username, @RequestParam String email, @RequestParam String role, @RequestParam int xp, @RequestParam int gold,
                             org.springframework.web.servlet.mvc.support.RedirectAttributes redirectAttributes) {
        User user = getAuthenticatedUser();
        if (user != null && "ADMIN".equals(user.getRole())) {
            // Validate username (Bug 14)
            if (username == null || username.trim().isEmpty()) {
                redirectAttributes.addFlashAttribute("error", "Username cannot be empty.");
                return "redirect:/admin/user/edit/" + id;
            }

            // Validate XP range
            if (xp < 0 || xp > 1000000) {
                redirectAttributes.addFlashAttribute("error", "XP must be between 0 and 1,000,000.");
                return "redirect:/admin/user/edit/" + id;
            }

            // Validate gold range
            if (gold < 0 || gold > 1000000) {
                redirectAttributes.addFlashAttribute("error", "Gold must be between 0 and 1,000,000.");
                return "redirect:/admin/user/edit/" + id;
            }

            Optional<User> targetUserOpt = userRepository.findById(id);
            if (targetUserOpt.isPresent()) {
                User targetUser = targetUserOpt.get();

                // Validate duplicate username — allow if it's the same user keeping their name
                Optional<User> existingByUsername = userRepository.findByUsername(username.trim());
                if (existingByUsername.isPresent() && !existingByUsername.get().getId().equals(id)) {
                    redirectAttributes.addFlashAttribute("error", "Username '" + username.trim() + "' is already taken by another user.");
                    return "redirect:/admin/user/edit/" + id;
                }

                targetUser.setUsername(username.trim());
                targetUser.setEmail(email);
                targetUser.setRole(role);
                targetUser.setXp(xp);
                targetUser.setGold(gold);
                userRepository.save(targetUser);
            }
        }
        return "redirect:/admin";
    }

    @GetMapping("/profile")
    public String showProfile(Model model) {
        User user = getAuthenticatedUser();
        if (user == null) return "redirect:/auth/login";

        model.addAttribute("currentUser", user);
        return "profile";
    }
}
