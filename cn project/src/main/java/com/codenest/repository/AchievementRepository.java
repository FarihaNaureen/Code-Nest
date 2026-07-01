package com.codenest.repository;

import com.codenest.model.Achievement;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AchievementRepository extends MongoRepository<Achievement, String> {
}
