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
@Table(name = "damage_items")
@Data
public class DamageItems {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "damage_items_id", unique = true, nullable = false)
    private Long damageItemsId;

    @ManyToOne
    @JoinColumn(name = "item_code", referencedColumnName = "item_code", nullable = false)
    private Item item;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "reason")
    private String reason;

    @Column(name = "reported_by")
    private String reportedBy;

    @Column(name = "reported_at")
    private java.time.LocalDateTime reportedAt;

    @Column(name = "display", nullable = false)
    private Boolean display;

    @Column(name = "rate")
    private Double rate;

    @Column(name = "total")
    private Double total;

    @ManyToOne
    @JoinColumn(name = "receive_items_id", referencedColumnName = "receive_items_id")
    private ReceiveItems receiveItems;
}
