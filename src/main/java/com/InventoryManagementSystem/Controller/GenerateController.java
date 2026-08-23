package com.InventoryManagementSystem.Controller;

import com.InventoryManagementSystem.Dto.GenerateDto;
import com.InventoryManagementSystem.Model.Generate;
import com.InventoryManagementSystem.Repository.GenerateRepository;
import com.InventoryManagementSystem.Service.GenerateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class GenerateController {

    @Autowired
    private GenerateRepository generateRepository;

    @Autowired
    private GenerateService generateService;

    @PostMapping("/generate")
    public Generate saveGenerate(@RequestBody GenerateDto dto) {
        return generateService.saveOrUpdateGenerate(dto);
    }

    @GetMapping("/generate")
    public Generate getGenerateByName(@RequestParam String name) {
        return generateRepository.findByName(name);
    }
}