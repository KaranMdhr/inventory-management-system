package com.InventoryManagementSystem.Service;

import com.InventoryManagementSystem.Dto.OrganizationDto;
import com.InventoryManagementSystem.Model.Organization;
import com.InventoryManagementSystem.Repository.OrganizationRepository;
import com.InventoryManagementSystem.Util.FileUploadUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@Service
public class OrganizationService {

    @Autowired
    private OrganizationRepository organizationRepository;

    public ResponseEntity<?> handleSubmitOrganization(
            String orgName, String address, String mobile, String alternateMobile,
            String email, String registrationNumber, String panVatNumber,
            Boolean display, String inventoryMethod, MultipartFile logo) {

        OrganizationDto dto = new OrganizationDto();
        dto.setOrgName(orgName);
        dto.setAddress(address);
        dto.setMobile(mobile);
        dto.setAlternateMobile(alternateMobile);
        dto.setEmail(email);
        dto.setRegistrationNumber(registrationNumber);
        dto.setPanVatNumber(panVatNumber);
        dto.setDisplay(display);
        dto.setInventoryMethod(inventoryMethod);

        String result = saveOrganization(dto, logo);
        if ("success".equals(result)) {
            return ResponseEntity.ok("Saved successfully");
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", result);
            return ResponseEntity.badRequest().body(error);
        }
    }

    public ResponseEntity<?> handleUpdateOrganization(
            Long id, String orgName, String address, String mobile, String alternateMobile,
            String email, String registrationNumber, String panVatNumber,
            Boolean display, String inventoryMethod, MultipartFile logo) {

        OrganizationDto dto = new OrganizationDto();
        dto.setOrgName(orgName);
        dto.setAddress(address);
        dto.setMobile(mobile);
        dto.setAlternateMobile(alternateMobile);
        dto.setEmail(email);
        dto.setRegistrationNumber(registrationNumber);
        dto.setPanVatNumber(panVatNumber);
        dto.setDisplay(display);
        dto.setInventoryMethod(inventoryMethod);

        String result = updateOrganization(id, dto, logo);
        if ("success".equals(result)) {
            return ResponseEntity.ok("Updated successfully");
        } else {
            Map<String, String> error = new HashMap<>();
            error.put("message", result);
            return ResponseEntity.badRequest().body(error);
        }
    }

    public String saveOrganization(OrganizationDto dto, MultipartFile logo) {
        try {
            if (dto.getOrgName() == null || dto.getOrgName().trim().isEmpty()) {
                return "Error: Organization name is required.";
            }
            if (organizationRepository.existsByOrgName(dto.getOrgName())) {
                return "Error: Organization name already exists.";
            }
            Organization organization = new Organization();
            organization.setOrgName(dto.getOrgName());
            organization.setAddress(dto.getAddress());
            organization.setMobile(dto.getMobile());
            organization.setAlternateMobile(dto.getAlternateMobile());
            organization.setEmail(dto.getEmail());
            organization.setRegistrationNumber(dto.getRegistrationNumber());
            organization.setPanVatNumber(dto.getPanVatNumber());
            if (logo != null && !logo.isEmpty()) {
                String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/image/uploads/";
                String fileName = FileUploadUtil.saveFile(uploadDir, logo);
                organization.setLogo("/image/uploads/" + fileName);
            }
            organizationRepository.save(organization);
            return "success";
        } catch (DataIntegrityViolationException e) {
            return "Error: Duplicate entry detected.";
        } catch (Exception e) {
            return "Error saving organization: " + e.getMessage();
        }
    }

    public Organization getOrganization() {
        return organizationRepository.findAll().stream().findFirst().orElse(null);
    }

    public String updateOrganization(Long id, OrganizationDto dto, MultipartFile logo) {
        try {
            Organization organization = organizationRepository.findById(id).orElse(null);
            if (organization == null) {
                return "Error: Organization not found.";
            }
            if (organizationRepository.existsByOrgNameAndIdNot(dto.getOrgName(), id)) {
                return "Error: Organization name already exists.";
            }
            organization.setOrgName(dto.getOrgName());
            organization.setAddress(dto.getAddress());
            organization.setMobile(dto.getMobile());
            organization.setAlternateMobile(dto.getAlternateMobile());
            organization.setEmail(dto.getEmail());
            organization.setRegistrationNumber(dto.getRegistrationNumber());
            organization.setPanVatNumber(dto.getPanVatNumber());
            if (logo != null && !logo.isEmpty()) {
                String uploadDir = System.getProperty("user.dir") + "/src/main/resources/static/image/uploads/";
                String fileName = FileUploadUtil.saveFile(uploadDir, logo);
                organization.setLogo("/image/uploads/" + fileName);
            }
            organizationRepository.save(organization);
            return "success";
        } catch (DataIntegrityViolationException e) {
            return "Error: Duplicate entry detected.";
        } catch (Exception e) {
            return "Error updating organization: " + e.getMessage();
        }
    }
    public String updateInventoryMethod(Long id, String method) {
        int updatedRows = organizationRepository.updateInventoryMethod(id, method);
        if (updatedRows == 0) {
            return "Error: Organization not found or update failed.";
        }
        return "success";
    }

}