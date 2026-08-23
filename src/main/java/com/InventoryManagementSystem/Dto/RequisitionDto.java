package com.InventoryManagementSystem.Dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RequisitionDto {
    private String requisitionNo;
    private LocalDate date;
    private String requestedBy;
    private Long departmentId;
    private Long branchId;
    private List<Long> requestItemIds;
    private LocalDateTime createdAt;
    private String status;
    private LocalDateTime updatedAt;
    private Boolean display;
}
