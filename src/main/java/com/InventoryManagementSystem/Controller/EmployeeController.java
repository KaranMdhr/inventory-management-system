package com.InventoryManagementSystem.Controller;

import com.InventoryManagementSystem.Dto.EmployeeDto;
import com.InventoryManagementSystem.Model.Department;
import com.InventoryManagementSystem.Model.Branch;
import com.InventoryManagementSystem.Model.Role;
import com.InventoryManagementSystem.Repository.RoleRepository;
import com.InventoryManagementSystem.Service.EmployeeService;
import com.InventoryManagementSystem.Repository.BranchRepository;
import com.InventoryManagementSystem.Repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/api")
public class EmployeeController {

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private EmployeeService employeeService;

    @Autowired
    private RoleRepository roleRepository;

    @GetMapping("/branches/branch-list")
    public List<Branch> getBranches() {
        return branchRepository.findAllActiveBranch();
    }

    @GetMapping("/departments/department-list")
    public List<Department> getDepartment() {
        return departmentRepository.findAllActiveDepartment();
    }

    @GetMapping("/roles/role-list")
    public List<Role> getRoles() {
        return roleRepository.findAllActiveRole();
    }


    @PostMapping("/employees/save")
    public ResponseEntity<?> saveEmployee(
            @RequestParam("firstName") String firstName,
            @RequestParam(value = "middleName", required = false) String middleName,
            @RequestParam("lastName") String lastName,
            @RequestParam("employeeType") String employeeType,
            @RequestParam("gender") String gender,
            @RequestParam("email") String email,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("branch") Long branchId,
            @RequestParam("department") Long departmentId,
            @RequestParam(value = "role", required = false) Long roleId,
            @RequestParam(value = "permissions", required = false) List<String> permissions,
            @RequestParam(value = "image", required = false) MultipartFile image
    ) {
        EmployeeDto dto = new EmployeeDto();
        dto.setFirstname(firstName);
        dto.setMiddleName(middleName);
        dto.setLastName(lastName);
        dto.setType(employeeType);
        dto.setGender(gender);
        dto.setEmail(email);
        dto.setMobile(phoneNumber);
        dto.setBranchId(branchId);
        dto.setDepartmentId(departmentId);
        dto.setUserRoleId(roleId);

        // Handle permissions mapping
        if (permissions != null && !permissions.isEmpty()) {
            Long permissionId = mapPermissionsToId(permissions);
            dto.setPermissionsId(permissionId);
        }

        return employeeService.saveEmployee(dto, image);
    }

    private Long mapPermissionsToId(List<String> permissions) {
        // Map checkbox permissions to permission ID based on binary combinations
        int permissionValue = 0;

        // Check for "all" selection first
        if (permissions.contains("all")) {
            permissionValue = 31;
        } else {
            // Individual permission checking
            if (permissions.contains("approve")) {
                permissionValue |= 1;
            }
            if (permissions.contains("delete")) {
                permissionValue |= 2;
            }
            if (permissions.contains("edit")) {
                permissionValue |= 4;
            }
            if (permissions.contains("create")) {
                permissionValue |= 8;
            }
            if (permissions.contains("view")) {
                permissionValue |= 16;
            }
        }

        return (long) (permissionValue + 1);
    }
}