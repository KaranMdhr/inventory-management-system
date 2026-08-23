package com.InventoryManagementSystem.Repository;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.InventoryManagementSystem.Model.Organization;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    boolean existsByOrgName(String orgName);

    boolean existsByOrgNameAndIdNot(String orgName, Long id);

    @Modifying
    @Transactional
    @Query("UPDATE Organization o SET o.inventoryMethod = :method WHERE o.id = :id")
    int updateInventoryMethod(@Param("id") Long id, @Param("method") String method);
}
