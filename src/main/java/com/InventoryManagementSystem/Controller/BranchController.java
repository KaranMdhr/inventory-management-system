package com.InventoryManagementSystem.Controller;

import com.InventoryManagementSystem.Dto.BranchDto;
import com.InventoryManagementSystem.Model.Branch;
import com.InventoryManagementSystem.Model.CodeName;
import com.InventoryManagementSystem.Model.Generate;
import com.InventoryManagementSystem.Repository.CodeNameRepository;
import com.InventoryManagementSystem.Repository.GenerateRepository;
import com.InventoryManagementSystem.Service.BranchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.ClientInfoStatus;
import java.util.List;

@RestController
@RequestMapping("/api/branch")
public class BranchController {

    @Autowired
    private BranchService branchService;

    @Autowired
    private CodeNameRepository codeNameRepository;

    @Autowired
    private GenerateRepository generateRepository;

    @GetMapping("/generate/branch-generate")
    public ResponseEntity<Generate> getGenerate() {
        Generate generate = generateRepository.findByNameIgnoreCase("Branch");
        if (generate == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(generate);
    }

    @GetMapping("/types")
    public ResponseEntity<?> getBranchTypes() {
        List<CodeName> branchTypes = branchService.getBranchTypes();
        return ResponseEntity.ok(branchTypes);
    }

    @PostMapping("/setup")
    public ResponseEntity<?> setupBranch(
            @RequestParam(required = false) Long branchId,
            @RequestParam String branchName,
            @RequestParam String country,
            @RequestParam String province,
            @RequestParam String city,
            @RequestParam String address,
            @RequestParam String branchManager,
            @RequestParam String branchPhone,
            @RequestParam(required = false) String branchAlternatePhone,
            @RequestParam String branchEmail,
            @RequestParam(required = false) String contactPersonName,
            @RequestParam(required = false) String contactPersonPhone,
            @RequestParam(required = false) String branchTypeCode,
            @RequestParam(required = false) Boolean display
    ) {
        BranchDto branchDto = new BranchDto();
        branchDto.setBranchId(branchId);
        branchDto.setBranchName(branchName);
        branchDto.setBranchManager(branchManager);
        branchDto.setBranchPhone(branchPhone);
        branchDto.setBranchAlternatePhone(branchAlternatePhone);
        branchDto.setBranchEmail(branchEmail);
        branchDto.setContactPersonName(contactPersonName);
        branchDto.setContactPersonPhone(contactPersonPhone);
        branchDto.setBranchCode(branchTypeCode);
        branchDto.setDisplay(display);

        return branchService.handleBranchSetup(branchDto, country, province, city, address);
    }


    @GetMapping("/branch-list")
    public ResponseEntity<List<Branch>> getAllBranches() {
        List<Branch> branches = branchService.getBranches();
        return ResponseEntity.ok(branches);
    }

    @GetMapping("/branch/{id}")
    public ResponseEntity<Branch> getBranchById(@PathVariable Long id) {
        try {
            Branch branch = branchService.getBranchById(id);
            return ResponseEntity.ok(branch);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/branch-update/{id}")
    public ResponseEntity<String> updateBranch(@PathVariable Long id, @RequestBody BranchDto dto) {
        try {
            branchService.updateBranch(id, dto);
            return ResponseEntity.ok("Updated successfully!");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping("/branch-delete/{id}")
    public ResponseEntity<String> deleteBranch(@PathVariable Long id) {
        try {
            branchService.deleteBranch(id);
            return ResponseEntity.ok("Branch deleted successfully!");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body("Cannot delete branch: " + ex.getMessage());
        }
    }

}