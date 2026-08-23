package com.InventoryManagementSystem.Dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class PermissionsDto {
    private Long permissionId;
    private Boolean request;
    private Boolean approve;
    private Boolean purchase;
    private Boolean users;
    private Boolean staff;
    private Boolean display;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
