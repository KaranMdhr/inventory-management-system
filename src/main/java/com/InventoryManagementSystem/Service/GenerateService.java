package com.InventoryManagementSystem.Service;

import com.InventoryManagementSystem.Dto.GenerateDto;
import com.InventoryManagementSystem.Model.CodeName;
import com.InventoryManagementSystem.Model.Generate;
import com.InventoryManagementSystem.Repository.CodeNameRepository;
import com.InventoryManagementSystem.Repository.GenerateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GenerateService {

    @Autowired
    private CodeNameRepository codeNameRepository;

    @Autowired
    private GenerateRepository generateRepository;

    public Generate saveOrUpdateGenerate(GenerateDto dto) {
        Generate generate = generateRepository.findByName(dto.getName());
        if (generate == null) {
            generate = new Generate();
            generate.setName(dto.getName());
        }
        generate.setGenerate(dto.getGenerate());
        generate.setDisplay(dto.getDisplay());
        Generate saved = generateRepository.save(generate);

        updateCompanyAutoGenerate(dto.getName(), dto.getGenerate());
        return saved;
    }

    public void updateCompanyAutoGenerate(String name, boolean generate) {
        if ("Company".equalsIgnoreCase(name)) {
            List<CodeName> codes = codeNameRepository.findByTypeIgnoreCase("COMPANY");
            String[][] predefined = {
                    {"SUPPLIER", "SU"},
                    {"SUPPORT", "SP"},
                    {"MAINTENANCE", "MA"},
                    {"OTHER", "OT"}
            };

            for (CodeName code : codes) {
                boolean isPredefined = false;
                for (String[] entry : predefined) {
                    if (code.getCodeName().equalsIgnoreCase(entry[0]) && code.getCode().equalsIgnoreCase(entry[1])) {
                        isPredefined = true;
                        break;
                    }
                }
                if (isPredefined) {
                    code.setDisplay(generate); // true if checked, false if unchecked
                }
            }
            codeNameRepository.saveAll(codes);

            if (generate) {
                for (String[] entry : predefined) {
                    String codeNameStr = entry[0];
                    String codeStr = entry[1];
                    // Check for duplicates across all types
                    List<CodeName> duplicates = codeNameRepository.findByCodeNameIgnoreCaseAndCodeIgnoreCase(codeNameStr, codeStr);
                    boolean anyActive = duplicates.stream().anyMatch(cn -> Boolean.TRUE.equals(cn.getDisplay()));
                    if (anyActive) {
                        continue;
                    }
                    if (!duplicates.isEmpty()) {
                        // If all are inactive, reactivate the first one
                        CodeName codeName = duplicates.get(0);
                        codeName.setDisplay(true);
                        codeNameRepository.save(codeName);
                    } else {
                        CodeName newCode = new CodeName();
                        newCode.setCodeName(codeNameStr);
                        newCode.setCode(codeStr);
                        newCode.setType("COMPANY");
                        newCode.setDisplay(true);
                        codeNameRepository.save(newCode);
                    }
                }
            }
        }
    }
}