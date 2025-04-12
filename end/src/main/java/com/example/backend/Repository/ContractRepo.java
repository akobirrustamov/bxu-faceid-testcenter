package com.example.backend.Repository;

import com.example.backend.Entity.Contract;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ContractRepo extends JpaRepository<Contract, UUID> {

    Contract findByHemisId(Long aLong);
}
