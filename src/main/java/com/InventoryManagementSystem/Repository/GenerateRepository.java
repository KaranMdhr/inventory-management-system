package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.InventoryManagementSystem.Model.Generate;

public interface GenerateRepository extends JpaRepository<Generate, Long> {
    Generate findByName(String name);

    Generate findByNameIgnoreCase(String category);
}
