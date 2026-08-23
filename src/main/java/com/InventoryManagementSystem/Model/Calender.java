package com.InventoryManagementSystem.Model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "calender")
@Data
public class Calender {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "c_id",unique = true, nullable = false)
    private Long cId;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @Column(name = "display", nullable = false)
    private Boolean display = true;

    @Column(name = "ad_date")
    private LocalDate adDate;

    @Column(name = "bs_date", nullable = false, unique = true)
    private String bsDate;

    @Column(name = "day")
    private String day;

    @Column(name = "holiday")
    private Boolean holiday;

    @Column(name = "month")
    private String month;

    @Column(name = "year")
    private Integer year;

    @ManyToOne
    @JoinColumn(name = "nfy", referencedColumnName = "nfy_id")
    private NepaliFiscalYear nepaliFiscalYear;

    @ManyToOne
    @JoinColumn(name = "efy", referencedColumnName = "efy_id")
    private EnglishFiscalYear englishFiscalYear;
}