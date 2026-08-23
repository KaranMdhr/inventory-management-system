package com.InventoryManagementSystem.Controller;

import com.InventoryManagementSystem.Dto.CodeNameDto;
import com.InventoryManagementSystem.Repository.CodeNameRepository;
import com.InventoryManagementSystem.Service.CodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class CodeController {

    @Autowired
    private CodeService codeService;

    @Autowired
    private CodeNameRepository codeNameRepository;

    @PostMapping("/code-name/manual")
    public ResponseEntity<?> saveOrUpdateManual(@RequestBody CodeNameDto dto) {
        return codeService.saveOrUpdateManual(dto);
    }
}