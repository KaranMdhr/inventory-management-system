package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.InventoryManagementSystem.Model.Permissions;

@Repository
public interface PermissionsRepository extends JpaRepository<Permissions, Long> {

}
