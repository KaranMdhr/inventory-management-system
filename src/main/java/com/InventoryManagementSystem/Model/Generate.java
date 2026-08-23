package com.InventoryManagementSystem.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "generate")
@Data
public class Generate {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "generate_id", unique = true, nullable = false)
    private Long generateId;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    @Column(name = "generate", nullable = false)
    private Boolean generate;

    @Column(name = "display", nullable = false)
    private Boolean display = true;
}
