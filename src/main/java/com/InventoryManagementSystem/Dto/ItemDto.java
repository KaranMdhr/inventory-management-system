package com.InventoryManagementSystem.Dto;

import java.time.LocalDateTime;

import com.InventoryManagementSystem.Model.Category;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ItemDto {
    private String itemCode;
    private String itemName;
    private Long categoryId;
    private String categoryName;
    private Long branchId;
    private String location;
    private Integer minimumOrderLevel;
    private Integer reorderLevel;
    private Integer maximumOrderLevel;
    private Boolean display;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long itemTypeCodeId;
}
