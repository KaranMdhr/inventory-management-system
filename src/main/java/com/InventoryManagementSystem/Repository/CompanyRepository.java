package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.InventoryManagementSystem.Model.Company;

public interface CompanyRepository extends JpaRepository<Company, String> {
}
