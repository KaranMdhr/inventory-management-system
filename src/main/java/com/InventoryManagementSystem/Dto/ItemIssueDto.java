package com.InventoryManagementSystem.Dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ItemIssueDto {
    private Long issueCode;
    private Long issuedToId;
    private Long issuedById;
    private Boolean display;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
