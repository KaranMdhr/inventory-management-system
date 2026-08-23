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
@Table(name = "purchase_order")
@Data
public class PurchaseOrder {
    @Id
    @Column(name = "purchase_order_code", length = 30, unique = true, nullable = false)
    private String purchaseOrderCode;

    @Column(name = "order_type", nullable = false)
    private String orderType;

    @ManyToOne
    @JoinColumn(name = "supplier_id", referencedColumnName = "company_code", nullable = false)
    private Company supplier;

    @Column(name = "purchase_method")
    private String purchaseMethod;

    @Column(name = "order_date")
    private LocalDate orderDate;

    @ManyToOne
    @JoinColumn(name = "requisition_code", referencedColumnName = "requisition_no", nullable = false)
    private Requisition requisition;

    @Column(name = "delivery_date_ad")
    private LocalDate deliveryDateAd;

    @Column(name = "delivery_date_bs")
    private String deliveryDateBs;

    @Column(name = "remark")
    private String remark;

    @Column(name = "display", nullable = false)
    private Boolean display = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "status")
    private String status;

    @Column(name = "payment_term")
    private String paymentTerm;
}
