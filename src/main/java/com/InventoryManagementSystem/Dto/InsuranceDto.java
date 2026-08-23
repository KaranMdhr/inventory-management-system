package com.InventoryManagementSystem.Dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class InsuranceDto {
    private Long insuranceId;
    private String companyName;
    private String policyNumber;
    private Long categoryId;
    private String type;
    private Double sumInsured;
    private Double declaredValue;
    private Double premiumAmount;
    private Double deductible;
    private Double claimLimit;
    private LocalDate startDate;
    private LocalDate expiryDate;
    private LocalDate claimDate;
    private String paymentFrequency;
    private String noClaimBonus;
    private String addOns;
    private String name;
    private String phone;
    private String email;
    private String document;
    private Boolean display;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status;
    private Long receiveItemsId;
}
