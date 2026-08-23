package com.InventoryManagementSystem.Model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "goods_receiving_note")
@Data
public class GoodsReceivingNote {
    @Id
    @Column(name = "grn_code", length = 30, unique = true, nullable = false)
    private String grnCode;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "company_code", nullable = false)
    private Company supplier;

    @ManyToOne
    @JoinColumn(name = "purchase_order_code", referencedColumnName = "purchase_order_code", nullable = false)
    private PurchaseOrder purchaseOrderCode;

    @Column(name = "date_received")
    private LocalDate dateReceived;

    @Column(name = "notes")
    private String notes;

    @Column(name = "display", nullable = false)
    private Boolean display = true;

    @Column(name = "status")
    private String status;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
