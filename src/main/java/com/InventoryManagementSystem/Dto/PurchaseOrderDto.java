package com.InventoryManagementSystem.Dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class PurchaseOrderDto {
    private String purchaseOrderCode;
    private String orderType;
    private String supplierId;
    private String purchaseMethod;
    private LocalDate orderDate;
    private String requisitionCode;
    private LocalDate deliveryDateAd;
    private String deliveryDateBs;
    private String remark;
    private String paymentTerm;
    private Boolean display;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status;
}
