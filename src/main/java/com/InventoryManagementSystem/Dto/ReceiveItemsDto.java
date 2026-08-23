package com.InventoryManagementSystem.Dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReceiveItemsDto {
    private Long receiveItemsId;
    private String itemCode;
    private Integer quantity;
    private String unit;
    private Integer remaining;
    private Double rate;
    private Double total;
    private Boolean display;
    private String grnCode;
}
