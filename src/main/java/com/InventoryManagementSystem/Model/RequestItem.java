package com.InventoryManagementSystem.Model;

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
@Table(name = "request_item")
@Data
public class RequestItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "request_id", unique = true, nullable = false)
    private Long requestId;

    @ManyToOne
    @JoinColumn(name = "item_code", referencedColumnName = "item_code", nullable = false)
    private Item item;

    @ManyToOne
    @JoinColumn(name = "requisition_no", referencedColumnName = "requisition_no", nullable = false)
    private Requisition requisition;

    @Column(name = "qty", nullable = false)
    private Integer qty;

    @Column(name = "unit", nullable = false)
    private String unit;

    @Column(name = "remarks")
    private String remarks;

    @Column(name = "display", nullable = false)
    private Boolean display= true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
