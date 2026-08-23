package com.InventoryManagementSystem.Dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BranchDto {
    private Long branchId;
    private String branchCode;
    private String branchName;
    private String branchAddress;
    private String branchManager;
    private String branchPhone;
    private String branchAlternatePhone;
    private String branchEmail;
    private String contactPersonName;
    private String contactPersonPhone;
    private String branchTypeCode;
    private Boolean display;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}