package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.InventoryManagementSystem.Model.IssuedItem;

@Repository
public interface IssuedItemRepository extends JpaRepository<IssuedItem, Long> {
    
}
