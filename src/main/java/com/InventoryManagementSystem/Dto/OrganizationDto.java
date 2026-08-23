package com.InventoryManagementSystem.Dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class OrganizationDto {
    private Long id;
    private String orgName;
    private String mobile;
    private String alternateMobile;
    private String email;
    private String address;
    private String registrationNumber;
    private String panVatNumber;
    private String logo;
    private Boolean display;
    private String inventoryMethod;
}