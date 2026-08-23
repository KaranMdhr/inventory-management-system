package com.InventoryManagementSystem.Model;

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
@Table(name = "additional_costs")
@Data
public class AdditionalCosts {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "add_cost_id", unique = true, nullable = false)
    private Long addCostId;

    @Column(name = "incoterm")
    private String incoterm;

    @Column(name = "labour_charge")
    private Double labourCharge;

    @Column(name = "transport_charge")
    private Double transportCharge;

    @Column(name = "miscellaneous")
    private Double miscellaneous;

    @Column(name = "total")
    private Double total;

    @Column(name = "display", nullable = false)
    private Boolean display;

    @ManyToOne
    @JoinColumn(name = "grn_code", referencedColumnName = "grn_code", nullable = false)
    private GoodsReceivingNote goodsReceivingNote;
}
