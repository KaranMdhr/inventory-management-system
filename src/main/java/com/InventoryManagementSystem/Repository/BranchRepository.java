package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.InventoryManagementSystem.Model.Branch;
import org.springframework.data.jpa.repository.Query;

import java.util.List;


public interface BranchRepository extends JpaRepository<Branch, Long> {
    boolean findByBranchNameIgnoreCase(String branchName);

    @Query("SELECT b FROM Branch b WHERE b.display = true")
    List<Branch> findAllActiveBranch();

    boolean existsByBranchNameIgnoreCase(String branchName);

    @Query("SELECT b FROM Branch b WHERE b.display = true")
    List<Branch> findAllActive();
}