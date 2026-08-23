package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.InventoryManagementSystem.Model.CategoryType;

public interface CategoryTypeRepository extends JpaRepository<CategoryType, Long> {
}