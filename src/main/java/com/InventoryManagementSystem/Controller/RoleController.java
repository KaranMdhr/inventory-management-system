package com.InventoryManagementSystem.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.InventoryManagementSystem.Model.Role;
import com.InventoryManagementSystem.Service.RoleService;

@RestController
@RequestMapping("/api")
public class RoleController {

    @Autowired
    private RoleService roleService;

    @PostMapping("/save-roles")
    public ResponseEntity<?> createRole(@RequestBody Role role) {
        Role savedRole = roleService.saveRole(role);
        if (savedRole == null) {
            return ResponseEntity.badRequest().body("Role already exists");
        }
        return ResponseEntity.ok(savedRole);
    }
}