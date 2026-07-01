package com.codenest.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "achievements")
public class Achievement {
    @Id
    private String id;
    private String title;
    private String description;
    private int xpReward;
    private int goldReward;
    private String icon;

    public Achievement() {}

    public Achievement(String id, String title, String description, int xpReward, int goldReward, String icon) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.xpReward = xpReward;
        this.goldReward = goldReward;
        this.icon = icon;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getXpReward() { return xpReward; }
    public void setXpReward(int xpReward) { this.xpReward = xpReward; }

    public int getGoldReward() { return goldReward; }
    public void setGoldReward(int goldReward) { this.goldReward = goldReward; }

    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
}
