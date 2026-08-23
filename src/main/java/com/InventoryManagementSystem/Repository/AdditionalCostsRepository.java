package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.InventoryManagementSystem.Model.AdditionalCosts;

public interface AdditionalCostsRepository extends JpaRepository<AdditionalCosts, Long> {
    
}
