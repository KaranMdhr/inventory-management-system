package com.InventoryManagementSystem.Dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ItemDetailsDto {
    private Long detailsId;
    private String itemCode;
    private Long categoryId;
    private String modelNo;
    private String manufacturer;
    private String location;
    private String condition;
    private String status;
    private String supplier;
    private Long departmentId;
    private String description;
    private String notes;
    private Boolean display;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long receiveItemsId;
}
