package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.InventoryManagementSystem.Model.Warranty;

public interface WarrantyRepository extends JpaRepository<Warranty, Long> {
    
}
