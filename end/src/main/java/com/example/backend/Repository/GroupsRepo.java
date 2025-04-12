package com.example.backend.Repository;

import com.example.backend.Entity.Groups;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface GroupsRepo extends JpaRepository<Groups, Integer> {


    Optional<Object> findByHemisId(Integer hemisId);

    @Query(value = "select * from groups where hemis_id=:groupId", nativeQuery = true)
    Groups findGroupByHemisId(Integer groupId);
}
