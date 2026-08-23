package com.InventoryManagementSystem.Service;

import com.InventoryManagementSystem.Dto.CodeNameDto;
import com.InventoryManagementSystem.Model.CodeName;
import com.InventoryManagementSystem.Model.Department;
import com.InventoryManagementSystem.Repository.CodeNameRepository;
import com.InventoryManagementSystem.Repository.DepartmentRepository;
import com.InventoryManagementSystem.Repository.GenerateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class CodeService {

    @Autowired
    private CodeNameRepository codeNameRepository;

    @Autowired
    private GenerateRepository generateRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public ResponseEntity<?> saveOrUpdateManual(CodeNameDto dto) {
        // Check for existing records with display=true
        boolean nameExists = codeNameRepository.existsByCodeName(dto.getCodeName());
        boolean codeExists = codeNameRepository.existsByCode(dto.getCode());

        // Check for records with display=false
        CodeName existing = codeNameRepository.findFirstByCodeNameIgnoreCaseOrCodeIgnoreCaseAndDisplay(
                dto.getCodeName(), dto.getCode(), false);

        if (nameExists && codeExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Both code name and code already exist.");
        } else if (nameExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Code name already exists.");
        } else if (codeExists) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("Code already exists.");
        } else if (existing != null) {
            // Update display to true and other fields
            existing.setDisplay(true);
            existing.setCodeName(dto.getCodeName().toUpperCase());
            existing.setCode(dto.getCode().toUpperCase());
            existing.setType(dto.getType().toUpperCase());
            codeNameRepository.save(existing);
            return ResponseEntity.ok(existing);
        }

        CodeName codeName = new CodeName();
        codeName.setCodeName(dto.getCodeName().toUpperCase());
        codeName.setCode(dto.getCode().toUpperCase());
        codeName.setType(dto.getType().toUpperCase());
        codeName.setDisplay(true);
        codeNameRepository.save(codeName);

        if ("DEPARTMENT".equalsIgnoreCase(dto.getType())) {
            saveDepartment(codeName, dto.getCodeName());
        }

        return ResponseEntity.ok(codeName);

    }

    private void saveDepartment(CodeName codeName, String departmentName) {
        Department department = new Department();
        department.setDepartmentName(departmentName.toUpperCase());
        department.setDepartmentCode(codeName.getCode().toUpperCase());
        department.setDepartmentTypeCode(codeName);
        department.setDisplay(true);
        department.setCreatedAt(java.time.LocalDateTime.now());
        department.setUpdatedAt(java.time.LocalDateTime.now());
        departmentRepository.save(department);
    }
}