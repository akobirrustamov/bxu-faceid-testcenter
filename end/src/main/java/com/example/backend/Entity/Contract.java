package com.example.backend.Entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "contract")
@Entity
@Builder
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;
    private String fullName;
    private String level;
    private Long hemisId;

    private Integer amount;
    private Integer payment;
    private Integer debt;
    private Integer extra;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Contract(String fullName, String level, Long hemisId, Integer amount, Integer payment, Integer debt, Integer extra, LocalDateTime createdAt) {
        this.fullName = fullName;
        this.level = level;
        this.hemisId = hemisId;
        this.amount = amount;
        this.payment = payment;
        this.debt = debt;
        this.extra = extra;
        this.createdAt = createdAt;
    }
}
