package com.InventoryManagementSystem.Dto;

import lombok.Data;

@Data
public class CategoryTypeDto {
    private Long ctid;
    private String categorycode;
    private String categoryname;
    private Long categoryId;
    private Long subCategoryId;
}