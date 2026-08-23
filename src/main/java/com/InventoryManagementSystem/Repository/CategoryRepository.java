package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.InventoryManagementSystem.Model.Category;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findByCategoryCodeStartingWith(String baseCode);
    boolean existsByCategoryName(String categoryName);

    @Query("SELECT c FROM Category c WHERE c.display = true")
    List<Category> findAllActive();


    List<Category> findByCategoryNameContainingIgnoreCase(String q);
}