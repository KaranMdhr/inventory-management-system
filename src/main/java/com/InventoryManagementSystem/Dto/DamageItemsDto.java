package com.InventoryManagementSystem.Dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class DamageItemsDto {
    private Long damageItemsId;
    private String itemCode;
    private Integer quantity;
    private String reason;
    private String reportedBy;
    private java.time.LocalDateTime reportedAt;
    private Boolean display;
    private Double rate;
    private Double total;
    private Long receiveItemsId;
}
