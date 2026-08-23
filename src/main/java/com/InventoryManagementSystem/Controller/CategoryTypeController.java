package com.InventoryManagementSystem.Controller;

import com.InventoryManagementSystem.Model.CategoryType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.InventoryManagementSystem.Service.CategoryTypeService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categorytype")
public class CategoryTypeController {

    @Autowired
    private CategoryTypeService categoryTypeService;

    @PostMapping("/save")
    public ResponseEntity<String> saveCategoryType(@RequestBody Map<String, String> payload) {
        try {
            String result = categoryTypeService.saveCategoryAndSubCategory(payload.get("category"),
                    payload.get("categoryType"));
            return ResponseEntity.ok(result);
        } catch (IllegalStateException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

}