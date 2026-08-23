package com.InventoryManagementSystem.Controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.InventoryManagementSystem.Service.FiscalYearService;

@RestController
@RequestMapping("/api/fiscalyear")
public class FiscalYearController {

    @Autowired
    private FiscalYearService fiscalYearService;

    @PostMapping("/save")
    public void saveFiscalYear(@RequestBody Map<String, String> payload) {
        fiscalYearService.saveFiscalYear(payload);
    }
}