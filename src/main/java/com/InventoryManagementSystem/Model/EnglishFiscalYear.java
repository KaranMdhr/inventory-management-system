package com.InventoryManagementSystem.Model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "englishfiscalyear")
@Data
public class EnglishFiscalYear {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "efy_id", unique = true, nullable = false)
    private Long efyId;

    @Column(name = "create_date")
    private LocalDateTime createDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @Column(name = "display", nullable = false)
    private Boolean display = true;

    @Column(name = "fiscal_ad_start")
    private LocalDate fiscalAdStart;

    @Column(name = "fiscal_ad_end")
    private LocalDate fiscalAdEnd;

    @Column(name = "fiscal_bs_start")
    private String fiscalBsStart;

    @Column(name = "fiscal_bs_end")
    private String fiscalBsEnd;

    @Column(name = "fiscal_year_from")
    private String fiscalYearFrom;

    @Column(name = "fiscal_year_till")
    private String fiscalYearTill;
}