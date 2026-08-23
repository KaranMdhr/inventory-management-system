package com.InventoryManagementSystem.Controller;

import com.InventoryManagementSystem.Dto.OrganizationDto;
import com.InventoryManagementSystem.Model.Organization;
import com.InventoryManagementSystem.Service.OrganizationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Controller
@RequestMapping("/organization")
public class OrganizationController {

    @Autowired
    private OrganizationService organizationService;

    @PostMapping("/submit-organization")
    public ResponseEntity<?> submitOrganization(
            @RequestParam("orgName") String orgName,
            @RequestParam("address") String address,
            @RequestParam("mobile") String mobile,
            @RequestParam(value = "alternateMobile", required = false) String alternateMobile,
            @RequestParam("email") String email,
            @RequestParam(value = "registrationNumber", required = false) String registrationNumber,
            @RequestParam(value = "panVatNumber", required = false) String panVatNumber,
            @RequestParam(value = "display", required = false) Boolean display,
            @RequestParam(value = "inventoryMethod", required = false) String inventoryMethod,
            @RequestParam(value = "logo") MultipartFile logo
    ) {
        return organizationService.handleSubmitOrganization(
                orgName, address, mobile, alternateMobile, email,
                registrationNumber, panVatNumber, display, inventoryMethod, logo
        );
    }

    @PutMapping("/update-organization")
    @ResponseBody
    public ResponseEntity<?> updateOrganization(
            @RequestParam("id") Long id,
            @RequestParam("orgName") String orgName,
            @RequestParam("address") String address,
            @RequestParam("mobile") String mobile,
            @RequestParam(value = "alternateMobile", required = false) String alternateMobile,
            @RequestParam("email") String email,
            @RequestParam(value = "registrationNumber", required = false) String registrationNumber,
            @RequestParam(value = "panVatNumber", required = false) String panVatNumber,
            @RequestParam(value = "display", required = false) Boolean display,
            @RequestParam(value = "inventoryMethod", required = false) String inventoryMethod,
            @RequestParam(value = "logo") MultipartFile logo
    ) {
        return organizationService.handleUpdateOrganization(
                id, orgName, address, mobile, alternateMobile, email,
                registrationNumber, panVatNumber, display, inventoryMethod, logo
        );
    }

    @GetMapping("/get-organization")
    @ResponseBody
    public ResponseEntity<?> getOrganization() {
        Organization org = organizationService.getOrganization();
        if (org == null) {
            return ResponseEntity.ok().body(null);
        }
        return ResponseEntity.ok(org);
    }

    @GetMapping("/get-inventorymethod")
    public ResponseEntity<?> getInventoryMethod() {
        Organization org = organizationService.getOrganization();
        if (org == null) {
            return ResponseEntity.ok().body(null);
        }

        OrganizationDto dto = new OrganizationDto();
        dto.setInventoryMethod(org.getInventoryMethod());
        return ResponseEntity.ok(dto);
    }

    @PutMapping("/update-inventorymethod")
    public ResponseEntity<?> updateInventoryMethod(@RequestBody Map<String, String> request) {
        String method = request.get("inventoryMethod");

        Organization org = organizationService.getOrganization();
        if (org == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Organization not found.");
        }

        String result = organizationService.updateInventoryMethod(org.getId(), method);
        if ("success".equals(result)) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(result);
        }
    }
}