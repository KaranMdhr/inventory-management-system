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
@Table(name = "receive_items")
@Data
public class ReceiveItems {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "receive_items_id", unique = true, nullable = false)
    private Long receiveItemsId;

    @ManyToOne
    @JoinColumn(name = "item_code", referencedColumnName = "item_code", nullable = false)
    private Item item;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "unit", nullable = false)
    private String unit;

    @Column(name = "remaining")
    private Integer remaining;

    @Column(name = "rate")
    private Double rate;

    @Column(name = "total")
    private Double total;

    @Column(name = "display", nullable = false)
    private Boolean display = true;

    @ManyToOne
    @JoinColumn(name = "grn_code", referencedColumnName = "grn_code", nullable = false)
    private GoodsReceivingNote goodsReceivingNote;
}
