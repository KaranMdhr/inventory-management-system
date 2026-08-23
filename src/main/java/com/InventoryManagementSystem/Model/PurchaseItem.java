package com.InventoryManagementSystem.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "purchase_item")
@Data
public class PurchaseItem {
    @Id
    @Column(name = "item_code", length = 20, unique = true, nullable = false)
    private String itemCode;

    @Column(name = "rate", nullable = false)
    private Double rate;

    @Column(name = "unit", nullable = false)
    private String unit;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "purchase_order_code", referencedColumnName = "purchase_order_code", nullable = false)
    private PurchaseOrder purchaseOrderCode;

    @Column(name = "display", nullable = false)
    private Boolean display = true;

    @Column(name = "status")
    private String status;
}
