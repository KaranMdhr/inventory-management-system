package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.InventoryManagementSystem.Model.PurchaseOrder;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, String> {

}
