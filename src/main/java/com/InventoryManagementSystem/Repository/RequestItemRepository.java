package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.InventoryManagementSystem.Model.RequestItem;

public interface RequestItemRepository extends JpaRepository<RequestItem, Long> {
    
}
