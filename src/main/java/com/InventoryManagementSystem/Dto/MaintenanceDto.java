package com.InventoryManagementSystem.Dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class MaintenanceDto {
    private Long maintenanceId;
    private Long companyId;
    private Long itemId;
    private String name;
    private String email;
    private String mobile;
    private String alternateMobile;
    private String url;
    private String responsibilities;
    private LocalDateTime date;
    private String assignmentDuration;
    private String additional;
    private String contract;
    private Boolean display;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
