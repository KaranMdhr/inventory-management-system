package com.InventoryManagementSystem.Dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PurchaseItemDto {
    private String itemCode;
    private Double rate;
    private String unit;
    private Integer quantity;
    private String purchaseOrderCode;
    private Boolean display;
    private String status;
}
