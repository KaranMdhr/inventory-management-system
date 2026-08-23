package com.InventoryManagementSystem.Model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "item")
@Data
public class Item {
    @Id
    @Column(name = "item_code", length = 20, unique = true, nullable = false)
    private String itemCode;

    @Column(name = "item_name", nullable = false, unique = true)
    private String itemName;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "category_id", nullable = false)
    private Category category;

    @ManyToOne
    @JoinColumn(name = "branch_id", referencedColumnName = "branch_id", nullable = false)
    private Branch branch;

    @Column(name = "location")
    private String location;

    @Column(name = "minimum_order_level")
    private Integer minimumOrderLevel;

    @Column(name = "reorder_level")
    private Integer reorderLevel;

    @Column(name = "maximum_order_level")
    private Integer maximumOrderLevel;

    @Column(name = "display", nullable = false)
    private Boolean display = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "item_type_code", referencedColumnName = "code", nullable = false)
    private CodeName itemTypeCode;
}
