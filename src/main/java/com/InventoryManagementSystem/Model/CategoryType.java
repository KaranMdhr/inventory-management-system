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
@Table(name = "category_type")
@Data
public class CategoryType{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ctid;

    @Column(name = "category_code", nullable = false, unique = true, length = 20)
    private String categorycode;

    @Column(name = "category_name", nullable = false, length = 50)
    private String categoryname;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "code_id", nullable = false)
    private CodeName category;

    @ManyToOne
    @JoinColumn(name = "sub_id", referencedColumnName = "code_id", nullable = false)
    private CodeName subCategory;

}
