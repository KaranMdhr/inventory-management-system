package com.InventoryManagementSystem.Dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GenerateDto {
    private Long generateId;
    private String name;
    private Boolean generate;
    private Boolean display;
}
