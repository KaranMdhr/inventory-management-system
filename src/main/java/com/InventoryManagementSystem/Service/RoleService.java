package com.InventoryManagementSystem.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.InventoryManagementSystem.Model.Role;
import com.InventoryManagementSystem.Repository.RoleRepository;

import java.time.LocalDateTime;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

    public Role saveRole(Role role) {
        if (role.getRoleName() != null) {
            role.setRoleName(role.getRoleName().toUpperCase());
        }

        if (roleRepository.findByRoleName(role.getRoleName()).isPresent()) {
            return null;
        }

        LocalDateTime now = LocalDateTime.now();
        if (role.getCreatedAt() == null) {
            role.setCreatedAt(now);
        }
        role.setUpdatedAt(now);

        return roleRepository.save(role);
    }
}