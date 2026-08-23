package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.InventoryManagementSystem.Model.BranchType;

@Repository
public interface BranchTypeRepository extends JpaRepository<BranchType, Long> {
}