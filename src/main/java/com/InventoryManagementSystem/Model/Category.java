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
@Table(name = "category")
@Data
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "category_id", unique = true, nullable = false)
    private Long categoryId;

    @ManyToOne
    @JoinColumn(name = "category_type_id", referencedColumnName = "ctid", nullable = false)
    private CategoryType categoryTypeId;

    @Column(name = "category_code", length = 10, nullable = false, unique = true)
    private String categoryCode;

    @Column(name = "category_name", nullable = false, unique = true)
    private String categoryName;

    @Column(name = "display", nullable = false)
    private Boolean display = true;

    public void setCategoryTypeCode(String categoryTypeCode) {
    }
}