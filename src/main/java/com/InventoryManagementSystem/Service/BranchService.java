package com.InventoryManagementSystem.Service;

import java.util.List;
import java.util.Optional;

import com.InventoryManagementSystem.Model.BranchType;
import com.InventoryManagementSystem.Repository.BranchTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.InventoryManagementSystem.Dto.BranchDto;
import com.InventoryManagementSystem.Model.Branch;
import com.InventoryManagementSystem.Model.CodeName;
import com.InventoryManagementSystem.Model.Generate;
import com.InventoryManagementSystem.Repository.BranchRepository;
import com.InventoryManagementSystem.Repository.CodeNameRepository;
import com.InventoryManagementSystem.Repository.GenerateRepository;
import com.InventoryManagementSystem.Util.CodeGeneratorUtil;

@Service
public class BranchService {

    @Autowired
    private BranchRepository branchRepository;

    @Autowired
    private BranchTypeRepository branchTypeRepository;

    @Autowired
    private CodeNameRepository codeNameRepository;

    @Autowired
    private GenerateRepository generateRepository;

    public List<CodeName> getBranchTypes() {
        return codeNameRepository.findByTypeIgnoreCase("BRANCH");
    }

    public ResponseEntity<?> handleBranchSetup(BranchDto branchDto, String country, String province, String city,
            String address) {
        if (branchRepository.existsByBranchNameIgnoreCase(branchDto.getBranchName())) {
            return ResponseEntity.badRequest().body("Branch name already exists.");
        }

        // If branchCode is provided
        if (branchDto.getBranchCode() != null && !branchDto.getBranchCode().isEmpty()) {
            String inputCode = branchDto.getBranchCode();
            BranchType branchType = branchTypeRepository.findAll().stream()
                    .filter(bt -> inputCode.equals(bt.getBranchCode()))
                    .findFirst()
                    .orElse(null);

            List<Branch> existingBranches = branchRepository.findAll();
            String newBranchCode;

            if (branchType == null) {
                // Not present: create new BranchType and use inputCode-001
                branchType = new BranchType();
                branchType.setBranchCode(inputCode);
                branchType.setBranchName(branchDto.getBranchName().toUpperCase());
                branchType = branchTypeRepository.save(branchType);
                newBranchCode = CodeGeneratorUtil.generateNextCode(
                        branchType.getBranchCode(),
                        existingBranches,
                        Branch::getBranchCode);
            } else {
                newBranchCode = CodeGeneratorUtil.generateNextCode(
                        branchType.getBranchCode(),
                        existingBranches,
                        Branch::getBranchCode);
            }

            Branch branch = new Branch();
            branch.setBranchCode(newBranchCode);
            branch.setBranchName(branchDto.getBranchName().toUpperCase());
            branch.setBranchType(branchType);
            branch.setBranchManager(branchDto.getBranchManager());
            branch.setBranchAddress(String.join(", ", country, province, city, address).toUpperCase());
            branch.setBranchPhone(branchDto.getBranchPhone());
            branch.setBranchAlternatePhone(branchDto.getBranchAlternatePhone());
            branch.setBranchEmail(branchDto.getBranchEmail());
            branch.setContactPersonName(branchDto.getContactPersonName());
            branch.setContactPersonPhone(branchDto.getContactPersonPhone());
            branch.setDisplay(branchDto.getDisplay() != null ? branchDto.getDisplay() : true);
            branch.setCreatedAt(java.time.LocalDateTime.now());
            branch.setUpdatedAt(java.time.LocalDateTime.now());
            branchRepository.save(branch);
            return ResponseEntity.ok(branch);
        } else {
            Generate generate = generateRepository.findByNameIgnoreCase("Branch");

            // If branchCode is not provided
            CodeName countryCodeName = getOrCreateCodeName(country, "COUNTRY", generate);
            CodeName provinceCodeName = getOrCreateCodeName(province, "PROVINCE", generate);
            CodeName cityCodeName = getOrCreateCodeName(city, "CITY", generate);
            CodeName addressCodeName = getOrCreateCodeName(address, "ADDRESS", generate);

            String combinedShortform = countryCodeName.getCode() + provinceCodeName.getCode() + cityCodeName.getCode()
                    + addressCodeName.getCode();

            BranchType branchType = branchTypeRepository.findAll().stream()
                    .filter(bt -> combinedShortform.equals(bt.getBranchCode()))
                    .findFirst()
                    .orElse(null);

            List<Branch> existingBranches = branchRepository.findAll();
            String newBranchCode;

            if (branchType == null) {
                // Not present: create new BranchType and use combinedShortform-001
                branchType = new BranchType();
                branchType.setBranchCode(combinedShortform);
                branchType.setBranchName((city + address).toUpperCase());
                branchType.setCountry(countryCodeName);
                branchType.setState(provinceCodeName);
                branchType.setCity(cityCodeName);
                branchType.setAddress(addressCodeName);
                branchType = branchTypeRepository.save(branchType);
                newBranchCode = CodeGeneratorUtil.generateNextCode(
                        branchType.getBranchCode(),
                        existingBranches,
                        Branch::getBranchCode);
            } else {
                newBranchCode = CodeGeneratorUtil.generateNextCode(
                        branchType.getBranchCode(),
                        existingBranches,
                        Branch::getBranchCode);
            }

            Branch branch = new Branch();
            branch.setBranchCode(newBranchCode);
            branch.setBranchName(branchDto.getBranchName().toUpperCase());
            branch.setBranchType(branchType);
            branch.setBranchManager(branchDto.getBranchManager());
            branch.setBranchAddress(String.join(", ", country, province, city, address).toUpperCase());
            branch.setBranchPhone(branchDto.getBranchPhone());
            branch.setBranchAlternatePhone(branchDto.getBranchAlternatePhone());
            branch.setBranchEmail(branchDto.getBranchEmail());
            branch.setContactPersonName(branchDto.getContactPersonName());
            branch.setContactPersonPhone(branchDto.getContactPersonPhone());
            branch.setDisplay(branchDto.getDisplay() != null ? branchDto.getDisplay() : true);
            branch.setCreatedAt(java.time.LocalDateTime.now());
            branch.setUpdatedAt(java.time.LocalDateTime.now());

            branchRepository.save(branch);

            return ResponseEntity.ok(branch);
        }
    }

    private CodeName getOrCreateCodeName(String name, String type, Generate generate) {
        return codeNameRepository.findByCodeNameIgnoreCaseAndType(name, type)
                .orElseGet(() -> {
                    String code = CodeGeneratorUtil.generateUniqueCode(name, generate, codeNameRepository, type);
                    CodeName codeName = new CodeName();
                    codeName.setCode(code);
                    codeName.setCodeName(name.toUpperCase());
                    codeName.setType(type);
                    codeName.setDisplay(true);
                    return codeNameRepository.save(codeName);
                });
    }

    public List<Branch> getBranches() {
        return branchRepository.findAllActive();
    }

    public Branch getBranchById(Long branchId) {
        return branchRepository.findById(branchId)
                .orElseThrow(() -> new IllegalArgumentException("Branch not found with id: " + branchId));
    }

    public void updateBranch(Long id, BranchDto dto) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Branch not found."));

        // Check for duplicate branch name (case-insensitive), except for current branch
        if (!branch.getBranchName().equalsIgnoreCase(dto.getBranchName()) &&
                branchRepository.existsByBranchNameIgnoreCase(dto.getBranchName())) {
            throw new IllegalArgumentException("Branch name already exists.");
        }

        branch.setBranchName(dto.getBranchName().toUpperCase());
        branch.setBranchManager(dto.getBranchManager());
        branch.setBranchPhone(dto.getBranchPhone());
        branch.setBranchAlternatePhone(dto.getBranchAlternatePhone());
        branch.setBranchEmail(dto.getBranchEmail());
        branch.setContactPersonName(dto.getContactPersonName());
        branch.setContactPersonPhone(dto.getContactPersonPhone());
        branch.setDisplay(dto.getDisplay() != null ? dto.getDisplay() : true);
        branch.setUpdatedAt(java.time.LocalDateTime.now());

        // Optionally handle branchType change if branchTypeCode is provided and different
        if (dto.getBranchTypeCode() != null &&
                (branch.getBranchType() == null
                        || !dto.getBranchTypeCode().equals(branch.getBranchType().getBranchCode()))) {
            BranchType newType = branchTypeRepository.findAll().stream()
                    .filter(bt -> dto.getBranchTypeCode().equals(bt.getBranchCode()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Branch type not found."));
            branch.setBranchType(newType);
        }

        branchRepository.save(branch);
    }

    public void deleteBranch(Long id) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Branch not found with id: " + id));
        branch.setDisplay(false);
        branchRepository.save(branch);
    }

}