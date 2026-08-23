package com.InventoryManagementSystem.Controller;

import com.InventoryManagementSystem.Model.Employee;
import com.InventoryManagementSystem.Repository.RoleRepository;
import com.InventoryManagementSystem.Model.Role;
import com.InventoryManagementSystem.Service.PermissionsSeeder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/access")
public class AccessController {

    @Autowired
    private PermissionsSeeder permissionsSeeder;

    @Autowired
    private RoleRepository roleRepository;

    @GetMapping("/employees-list")
    public ResponseEntity<List<Employee>> getActiveEmployees() {
        List<Employee> employees = permissionsSeeder.getAllEmployees();
        return ResponseEntity.ok(employees);
    }

    @GetMapping("/active-roles")
    public ResponseEntity<List<Role>> getActiveRoles() {
        List<Role> roles = roleRepository.findAllActiveRole();
        return ResponseEntity.ok(roles);
    }

}