package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.InventoryManagementSystem.Model.DamageItems;

public interface DamageItemsRepository extends JpaRepository<DamageItems, Long> {
}
