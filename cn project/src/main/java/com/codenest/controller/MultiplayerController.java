package com.codenest.controller;

import com.codenest.model.ChatMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.Map;

@Controller
public class MultiplayerController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/room/{roomCode}/chat")
    public void handleChatMessage(@DestinationVariable String roomCode, @Payload ChatMessage message) {
        // Broadcast chat to everyone in the room
        messagingTemplate.convertAndSend("/topic/room/" + roomCode + "/chat", message);
    }

    @MessageMapping("/room/{roomCode}/editor")
    public void handleEditorSync(@DestinationVariable String roomCode, @Payload Map<String, Object> syncData) {
        // syncData contains: username, code, language, cursorRow, cursorCol
        // Broadcast changes to other participants in the room
        messagingTemplate.convertAndSend("/topic/room/" + roomCode + "/editor", syncData);
    }

    @MessageMapping("/room/{roomCode}/whiteboard")
    public void handleWhiteboardSync(@DestinationVariable String roomCode, @Payload java.util.Map<String, Object> strokeData) {
        // strokeData contains serialized drawings/coordinates
        messagingTemplate.convertAndSend("/topic/room/" + roomCode + "/whiteboard", strokeData);
    }

    @MessageMapping("/room/{roomCode}/webrtc")
    public void handleWebRTCSignaling(@DestinationVariable String roomCode, @Payload Map<String, Object> signalData) {
        // signalData contains WebRTC SDP offers, answers, or ICE candidates
        // Send to other peer
        messagingTemplate.convertAndSend("/topic/room/" + roomCode + "/webrtc", signalData);
    }

    @MessageMapping("/room/{roomCode}/hint")
    public void handleHintSync(@DestinationVariable String roomCode, @Payload Map<String, Object> hintData) {
        // Broadcast hint sync info to other participants in the room
        messagingTemplate.convertAndSend("/topic/room/" + roomCode + "/hint", hintData);
    }
}
