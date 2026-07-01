package com.codenest.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "multiplayer_rooms")
public class MultiplayerRoom {
    @Id
    private String id;
    private String roomCode;
    private String roomName;
    private String hostUsername;
    private List<String> participants = new ArrayList<>();
    private String currentLevelId;
    private String sharedCode = "";
    private String sharedLanguage = "java";
    private List<ChatMessage> chatHistory = new ArrayList<>();
    private String whiteboardState = "[]"; // Serialized JSON array of whiteboard strokes

    public MultiplayerRoom() {}

    public MultiplayerRoom(String roomCode, String roomName, String hostUsername) {
        this.roomCode = roomCode;
        this.roomName = roomName;
        this.hostUsername = hostUsername;
        this.participants.add(hostUsername);
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getRoomCode() { return roomCode; }
    public void setRoomCode(String roomCode) { this.roomCode = roomCode; }

    public String getRoomName() { return roomName; }
    public void setRoomName(String roomName) { this.roomName = roomName; }

    public String getHostUsername() { return hostUsername; }
    public void setHostUsername(String hostUsername) { this.hostUsername = hostUsername; }

    public List<String> getParticipants() { return participants; }
    public void setParticipants(List<String> participants) { this.participants = participants; }

    public String getCurrentLevelId() { return currentLevelId; }
    public void setCurrentLevelId(String currentLevelId) { this.currentLevelId = currentLevelId; }

    public String getSharedCode() { return sharedCode; }
    public void setSharedCode(String sharedCode) { this.sharedCode = sharedCode; }

    public String getSharedLanguage() { return sharedLanguage; }
    public void setSharedLanguage(String sharedLanguage) { this.sharedLanguage = sharedLanguage; }

    public List<ChatMessage> getChatHistory() { return chatHistory; }
    public void setChatHistory(List<ChatMessage> chatHistory) { this.chatHistory = chatHistory; }

    public String getWhiteboardState() { return whiteboardState; }
    public void setWhiteboardState(String whiteboardState) { this.whiteboardState = whiteboardState; }
}
