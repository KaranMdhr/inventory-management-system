package com.InventoryManagementSystem.Service;

import com.InventoryManagementSystem.Dto.EmployeeDto;
import com.InventoryManagementSystem.Model.*;
import com.InventoryManagementSystem.Repository.*;
import com.InventoryManagementSystem.Util.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private WhatsAppService whatsAppService;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PermissionsRepository permissionsRepository;

    public ResponseEntity<?> saveEmployee(EmployeeDto dto, MultipartFile image) {
        try {
            if (dto.getFirstname() == null || dto.getFirstname().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(error("First name is required."));
            }
            if (dto.getLastName() == null || dto.getLastName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(error("Last name is required."));
            }
            if (dto.getEmail() == null || dto.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(error("Email is required."));
            }

            // Check for duplicate email
            Optional<Employee> existingEmployeeByEmail = employeeRepository.findByEmail(dto.getEmail());
            if (existingEmployeeByEmail.isPresent()) {
                return ResponseEntity.badRequest().body(error("Email already exists."));
            }

            // Check for duplicate mobile if provided
            if (dto.getMobile() != null && !dto.getMobile().trim().isEmpty()) {
                Optional<Employee> existingEmployeeByMobile = employeeRepository.findByMobile(dto.getMobile());
                if (existingEmployeeByMobile.isPresent()) {
                    return ResponseEntity.badRequest().body(error("Mobile number already exists."));
                }
            }

            Branch branch = branchRepository.findById(dto.getBranchId()).orElse(null);
            Department department = departmentRepository.findById(dto.getDepartmentId()).orElse(null);

            // Determine if this is user registration or company staff registration
            Role userRole;
            Permissions permissions;

            if (dto.getUserRoleId() != null && dto.getPermissionsId() != null) {
                // User registration path - use provided role and permissions
                Optional<Role> selectedRole = roleRepository.findById(dto.getUserRoleId());
                Optional<Permissions> selectedPermissions = permissionsRepository.findById(dto.getPermissionsId());

                if (!selectedRole.isPresent()) {
                    return ResponseEntity.badRequest().body(error("Selected role not found."));
                }
                if (!selectedPermissions.isPresent()) {
                    return ResponseEntity.badRequest().body(error("Selected permissions not found."));
                }

                userRole = selectedRole.get();
                permissions = selectedPermissions.get();
            } else {
                // Company staff path - use defaults
                Optional<Role> employeeRole = roleRepository.findById(1L);
                Optional<Permissions> defaultPermissions = permissionsRepository.findById(2L);

                if (!employeeRole.isPresent()) {
                    return ResponseEntity.badRequest().body(error("Employee role not found."));
                }
                if (!defaultPermissions.isPresent()) {
                    return ResponseEntity.badRequest().body(error("Default permissions not found."));
                }

                userRole = employeeRole.get();
                permissions = defaultPermissions.get();
            }

            Employee employee = new Employee();
            employee.setFirstname(dto.getFirstname());
            employee.setMiddleName(dto.getMiddleName());
            employee.setLastName(dto.getLastName());
            employee.setType(dto.getType());
            employee.setGender(dto.getGender());
            employee.setEmail(dto.getEmail());
            employee.setMobile(dto.getMobile());

            // Generate and set password automatically
            String generatedPassword = generatePassword(dto);
            employee.setPassword(generatedPassword);

            employee.setBranch(branch);
            employee.setDepartment(department);
            employee.setUserRole(userRole);
            employee.setPermissions(permissions);
            employee.setStatus("ACTIVE");
            employee.setDisplay(true);
            employee.setSuspend(false);

            employee.setCreatedAt(LocalDateTime.now());
            employee.setUpdatedAt(LocalDateTime.now());

            if (image != null && !image.isEmpty()) {
                String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/image/uploads/";
                String fileName = FileUploadUtil.saveFile(uploadDir, image);
                employee.setPicture("/image/uploads/" + fileName);
            }

            Employee savedEmployee = employeeRepository.save(employee);

            // Send WhatsApp message with password
            if (dto.getMobile() != null && !dto.getMobile().trim().isEmpty()) {
                String message = String.format(
                        "Welcome to our company, %s!\n\n" +
                                "Your account has been created successfully.\n" +
                                "Email: %s\n" +
                                "Password: %s\n\n" +
                                "Please keep this password secure and change it upon first login.",
                        dto.getFirstname(),
                        dto.getEmail(),
                        generatedPassword
                );

                boolean messageSent = whatsAppService.sendMessage(dto.getMobile(), message);

                Map<String, Object> response = new HashMap<>();
                response.put("employee", savedEmployee);
                response.put("message", "Employee created successfully.");
                response.put("whatsappSent", messageSent);

                return ResponseEntity.ok(response);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("employee", savedEmployee);
            response.put("message", "Employee created successfully. No mobile number provided for WhatsApp notification.");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(error("Error saving employee: " + e.getMessage()));
        }
    }

    private String generatePassword(EmployeeDto dto) {
        // Generate password: FirstName + LastName + last 4 digits of mobile (or "0000" if no mobile)
        String firstName = dto.getFirstname().toLowerCase();
        String lastName = dto.getLastName().toLowerCase();
        String mobileSuffix = "0000";

        if (dto.getMobile() != null && dto.getMobile().length() >= 4) {
            mobileSuffix = dto.getMobile().substring(dto.getMobile().length() - 4);
        }

        return firstName + lastName + mobileSuffix;
    }

    private Map<String, String> error(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("message", message);
        return error;
    }
}