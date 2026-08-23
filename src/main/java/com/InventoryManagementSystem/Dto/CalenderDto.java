package com.InventoryManagementSystem.Dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CalenderDto {
    private Long cId;
    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;
    private Boolean display;
    private LocalDate adDate;
    private LocalDate adEndDate;
    private String bsDate;
    private String day;
    private Boolean holiday;
    private String month;
    private Integer year;
    private Long nepaliFiscalYearId;
    private Long englishFiscalYearId;
    private String nepaliFiscalYearFrom;
    private String nepaliFiscalYearTill;
    private String englishFiscalYearFrom;
    private String englishFiscalYearTill;
}