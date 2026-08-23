package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.InventoryManagementSystem.Model.ItemDetails;

public interface ItemDetailsRepository extends JpaRepository<ItemDetails, Long> {
    
}
