package com.codenest.repository;

import com.codenest.model.Level;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface LevelRepository extends MongoRepository<Level, String> {
    List<Level> findByWorldIdOrderByNumberAsc(String worldId);
}
