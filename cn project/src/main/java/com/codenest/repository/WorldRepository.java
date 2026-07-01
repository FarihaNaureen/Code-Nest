package com.codenest.repository;

import com.codenest.model.World;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface WorldRepository extends MongoRepository<World, String> {
    List<World> findAllByOrderByOrderAsc();
}
