package com.InventoryManagementSystem.Service;

import java.time.LocalDateTime;
import java.util.List;

import com.InventoryManagementSystem.Model.Employee;
import com.InventoryManagementSystem.Repository.EmployeeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.InventoryManagementSystem.Model.Permissions;
import com.InventoryManagementSystem.Repository.PermissionsRepository;

@Component
public class PermissionsSeeder implements CommandLineRunner {

    @Autowired
    private EmployeeRepository employeeRepository;

    private final PermissionsRepository permissionsRepository;

    public PermissionsSeeder(PermissionsRepository permissionsRepository) {
        this.permissionsRepository = permissionsRepository;
    }

    @Override
    public void run(String... args) {
        if (permissionsRepository.count() == 0) {
            for (int i = 0; i < 32; i++) {
                Permissions p = new Permissions();
                p.setRequest((i & 16) != 0);
                p.setApprove((i & 8) != 0);
                p.setPurchase((i & 4) != 0);
                p.setUsers((i & 2) != 0);
                p.setStaff((i & 1) != 0);
                p.setDisplay(true);
                p.setCreatedAt(LocalDateTime.now());
                p.setUpdatedAt(LocalDateTime.now());
                permissionsRepository.save(p);
            }
            System.out.println("Permissions table seeded with all combinations.");
        }
    }

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }
}
