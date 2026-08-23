package com.InventoryManagementSystem.Dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EnglishFiscalYearDto {
    private Long efyId;
    private LocalDateTime createDate;
    private LocalDateTime updatedDate;
    private Boolean display;
    private LocalDate fiscalAdStart;
    private LocalDate fiscalAdEnd;
    private String fiscalBsStart;
    private String fiscalBsEnd;
    private String fiscalYearFrom;
    private String fiscalYearTill;
}