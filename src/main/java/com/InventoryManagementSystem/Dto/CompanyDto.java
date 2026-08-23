package com.InventoryManagementSystem.Dto;

import java.time.LocalDateTime;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data

@JsonInclude(JsonInclude.Include.NON_NULL)
public class CompanyDto {
    private String companyCode;
    private String companyName;
    private String address;
    private String mobile;
    private String alternateMobile;
    private String email;
    private String contactPersonName;
    private String contactPersonMobile;
    private Boolean display;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Set<Long> categoryIds;
    private Set<Long> itemIds;
    private String companyTypeCode;
    private String companyType;
}
