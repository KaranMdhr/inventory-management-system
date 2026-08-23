package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.InventoryManagementSystem.Model.PurchaseItem;

public interface PurchaseItemRepository extends JpaRepository<PurchaseItem, String> {
    
}
