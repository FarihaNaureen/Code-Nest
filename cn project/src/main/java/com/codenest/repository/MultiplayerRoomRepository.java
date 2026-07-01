package com.codenest.repository;

import com.codenest.model.MultiplayerRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface MultiplayerRoomRepository extends MongoRepository<MultiplayerRoom, String> {
    Optional<MultiplayerRoom> findByRoomCode(String roomCode);
}
