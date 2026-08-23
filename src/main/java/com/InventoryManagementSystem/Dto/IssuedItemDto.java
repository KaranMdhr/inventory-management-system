package com.InventoryManagementSystem.Dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class IssuedItemDto {
    private Long issuedId;
    private String itemCode;
    private String unit;
    private Integer quantity;
    private Double rate;
    private Double amount;
    private Integer remaining;
    private Long issueCode;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
