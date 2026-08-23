package com.InventoryManagementSystem.Dto;

import lombok.Data;

@Data
public class BranchTypeDto {
    private Long btid;
    private String branchCode;
    private String branchName;
    private Long countryId;
    private Long stateId;
    private Long cityId;
    private Long addressId;
}