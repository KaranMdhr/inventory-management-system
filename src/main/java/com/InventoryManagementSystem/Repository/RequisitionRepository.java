package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.InventoryManagementSystem.Model.Requisition;

public interface RequisitionRepository extends JpaRepository<Requisition, String> {
}
