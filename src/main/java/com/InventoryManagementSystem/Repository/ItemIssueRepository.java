package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.InventoryManagementSystem.Model.ItemIssue;

@Repository
public interface ItemIssueRepository extends JpaRepository<ItemIssue, Long> {
    
}
