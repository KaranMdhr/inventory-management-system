package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.InventoryManagementSystem.Model.ReceiveItems;

public interface ReceiveItemsRepository extends JpaRepository<ReceiveItems, Long> {
}