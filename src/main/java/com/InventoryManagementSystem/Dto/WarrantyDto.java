package com.InventoryManagementSystem.Dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class WarrantyDto {
    private Long warrantyId;
    private String type;
    private String provider;
    private LocalDate startDate;
    private LocalDate expiryDate;
    private String coverage;
    private Boolean display;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long receiveItemsId; // Foreign key to ReceiveItems
}
