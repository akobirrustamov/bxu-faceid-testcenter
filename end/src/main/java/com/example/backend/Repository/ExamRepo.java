package com.example.backend.Repository;

import com.example.backend.Entity.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ExamRepo extends JpaRepository<Exam,Integer> {
    @Query(value = "select * from exams where group_id=:groupId", nativeQuery = true)
    List<Exam> findAllByGroupId(Integer groupId);

    Optional<Object> findByHemisId(Integer id);



    @Query(value = "Select * from exams where group_id=:id1 and hemis_id=:id", nativeQuery = true)
   List<Exam> findByHemisIdAndGrooupId(Integer id, Integer id1);
}
