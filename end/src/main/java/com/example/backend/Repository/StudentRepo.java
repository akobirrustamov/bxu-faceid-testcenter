package com.example.backend.Repository;

import com.example.backend.Entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface StudentRepo extends JpaRepository<Student, UUID> {

    @Query(value = "select * from students where group_id=:groupId", nativeQuery = true)
    List<Student> findAllByGroupId(Integer groupId);

    Optional<Student> findByHemisId(Integer hemisId);
}
