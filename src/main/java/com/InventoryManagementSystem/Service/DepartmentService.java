package com.InventoryManagementSystem.Service;

import com.InventoryManagementSystem.Dto.DepartmentDto;
import com.InventoryManagementSystem.Model.CodeName;
import com.InventoryManagementSystem.Model.Department;
import com.InventoryManagementSystem.Model.Generate;
import com.InventoryManagementSystem.Repository.CodeNameRepository;
import com.InventoryManagementSystem.Repository.DepartmentRepository;
import com.InventoryManagementSystem.Repository.GenerateRepository;
import com.InventoryManagementSystem.Util.CodeGeneratorUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;
    @Autowired
    private CodeNameRepository codeNameRepository;
    @Autowired
    private GenerateRepository generateRepository;

    public ResponseEntity<?> handleDepartmentSetup(DepartmentDto dto) {
        Generate generate = generateRepository.findByNameIgnoreCase("department");
        boolean autoGenerate = generate != null && Boolean.TRUE.equals(generate.getGenerate());

        if (!autoGenerate) {
            return ResponseEntity.badRequest().body("Auto-generate must be enabled to save a department.");
        }

        // 1. Check if department name already exists
        boolean nameExists = codeNameRepository.existsByCodeName(dto.getDepartmentName(), "department");
        if (nameExists) {
            return ResponseEntity.badRequest().body("Department name already exists.");
        }

        // 2. Generate unique two-letter code for department type
        String typeCode = CodeGeneratorUtil.generateUniqueCode(dto.getDepartmentName(), generate, codeNameRepository, "department");

        // 3. Save to CodeName table
        CodeName codeName = new CodeName();
        codeName.setCodeName(dto.getDepartmentName().toUpperCase());
        codeName.setCode(typeCode.toUpperCase());
        codeName.setType("DEPARTMENT");
        codeName.setDisplay(true);
        codeNameRepository.save(codeName);

        // 4. Fetch the saved CodeName for department_type_code
        CodeName savedCodeName = codeNameRepository.findByCodeNameIgnoreCaseAndCodeIgnoreCase(dto.getDepartmentName(), typeCode)
                .stream().filter(cn -> "department".equalsIgnoreCase(cn.getType())).findFirst().orElse(null);

        if (savedCodeName == null) {
            return ResponseEntity.badRequest().body("Failed to retrieve saved department code.");
        }

        // 5. Generate department code (e.g., DE-001)
        List<Department> departments = departmentRepository.findAll();
        String nextCode = CodeGeneratorUtil.generateNextCode(savedCodeName.getCode(), departments, Department::getDepartmentCode);
        String departmentCode = savedCodeName.getCode() + nextCode.substring(savedCodeName.getCode().length());

        // 6. Save the department
        Department department = new Department();
        department.setDepartmentName(dto.getDepartmentName());
        department.setDepartmentCode(departmentCode);
        department.setDepartmentTypeCode(savedCodeName);
        department.setDisplay(true);
        department.setCreatedAt(LocalDateTime.now());
        department.setUpdatedAt(LocalDateTime.now());

        departmentRepository.save(department);
        return ResponseEntity.ok("Department created successfully with code: " + departmentCode);
    }

    public List<Department> getAllDepartments() {
        return departmentRepository.findAllActiveDepartment();
    }

    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Department not found with id: " + id));
    }

    public void deleteDepartment(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Department not found with id: " + id));
        department.setDisplay(false);
        departmentRepository.save(department);
    }


}