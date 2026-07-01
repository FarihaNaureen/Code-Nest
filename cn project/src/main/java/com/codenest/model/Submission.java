package com.codenest.model;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "submissions")
public class Submission {
    @Id
    private String id;
    private String userId;
    private String username;
    private String levelId;
    private String language;
    private String code;
    private String status; // PASSED, FAILED, COMPILE_ERROR
    private int score;

    @CreatedDate
    private Date timestamp;

    public Submission() {}

    public Submission(String userId, String username, String levelId, String language, String code, String status, int score) {
        this.userId = userId;
        this.username = username;
        this.levelId = levelId;
        this.language = language;
        this.code = code;
        this.status = status;
        this.score = score;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getLevelId() { return levelId; }
    public void setLevelId(String levelId) { this.levelId = levelId; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}