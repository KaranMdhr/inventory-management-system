package com.InventoryManagementSystem.Dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AdditionalCostsDto {
    private Long addCostId;
    private String incoterm;
    private Double labourCharge;
    private Double transportCharge;
    private Double miscellaneous;
    private Double total;
    private Boolean display;
    private String grnCode;
}
