package com.InventoryManagementSystem.Controller;

import java.time.LocalDateTime;
import java.util.List;

import com.InventoryManagementSystem.Model.CodeName;
import com.InventoryManagementSystem.Repository.CodeNameRepository;
import com.InventoryManagementSystem.Util.CodeGeneratorUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.InventoryManagementSystem.Model.Company;
import com.InventoryManagementSystem.Repository.CompanyRepository;

@RestController
@RequestMapping("/company")
public class CompanyController {
    @Autowired
    private CompanyRepository companyRepository;

    @Autowired
    private CodeNameRepository codeNameRepository;

    @PostMapping("/company-save")
    public String saveCompany(@RequestBody Company company) {
        try {
            LocalDateTime now = LocalDateTime.now();
            if (company.getCreatedAt() == null) {
                company.setCreatedAt(now);
            }
            company.setUpdatedAt(now);
            companyRepository.save(company);
            return "success";
        } catch (Exception e) {
            return "error";
        }
    }

    @GetMapping("/company-types")
    public List<CodeName> getCompanyTypes() {
        return codeNameRepository.findByTypeIgnoreCase("COMPANY");
    }

    @GetMapping("/next-company-code")
    public String getNextCompanyCode(@RequestParam String typeCode) {
        List<Company> companies = companyRepository.findAll();
        return CodeGeneratorUtil.generateNextCode(
                typeCode, companies, Company::getCompanyCode
        );
    }
}