package com.codenest.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "worlds")
public class World {
    @Id
    private String id;
    private String name;
    private String theme;
    private String description;
    private int order;

    public World() {}

    public World(String id, String name, String theme, String description, int order) {
        this.id = id;
        this.name = name;
        this.theme = theme;
        this.description = description;
        this.order = order;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTheme() { return theme; }
    public void setTheme(String theme) { this.theme = theme; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public int getOrder() { return order; }
    public void setOrder(int order) { this.order = order; }
}
