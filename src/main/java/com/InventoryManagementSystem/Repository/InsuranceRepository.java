package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.InventoryManagementSystem.Model.Insurance;

public interface InsuranceRepository extends JpaRepository<Insurance, Long> {
    
}
