package com.InventoryManagementSystem.Dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RequestItemDto {
    private Long requestId;
    private String itemCode;
    private String requisitionNo;
    private Integer qty;
    private String unit;
    private String remarks;
    private Boolean display;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
