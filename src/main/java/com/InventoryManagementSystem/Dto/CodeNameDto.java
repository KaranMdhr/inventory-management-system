package com.InventoryManagementSystem.Dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CodeNameDto {
    private Long codeId;
    private String codeName;
    private String code;
    private String type;
    private Boolean display;
}
