package com.InventoryManagementSystem.Dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GoodsReceivingNoteDto {
    private String grnCode;
    private String supplierId;
    private String purchaseOrderCode;
    private LocalDate dateReceived;
    private String notes;
    private Boolean display;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
