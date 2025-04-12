package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.sql.Struct;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "students")
@Entity
@Builder
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    @Column(unique = true, nullable = false)
    private Integer hemisId;


    private String fullName;
    private String shortName;
    private String studentIdNumber;
    private String image;
    private String educationalType;
    private String level;
    private String passport_pin;
    @ManyToOne
    private Groups group;
    private String levelName;
    private String semesterName;
    @ManyToOne
    private Attachment image_file;
    @CreationTimestamp
    private LocalDateTime updated_at;

    public Student(Integer hemisId, String fullName, String studentIdNumber, String shortName, String image, String level, String educationalType, String passport_pin, Groups group, String semesterName, String levelName, LocalDateTime updated_at) {
        this.hemisId = hemisId;
        this.fullName = fullName;
        this.studentIdNumber = studentIdNumber;
        this.shortName = shortName;
        this.image = image;
        this.level = level;
        this.educationalType = educationalType;
        this.passport_pin = passport_pin;
        this.group = group;
        this.semesterName = semesterName;
        this.levelName = levelName;
        this.updated_at = updated_at;
    }
}
