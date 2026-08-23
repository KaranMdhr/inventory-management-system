package com.InventoryManagementSystem.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "code_name")
@Data
public class CodeName {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "code_id", unique = true, nullable = false)
    private Long codeId;

    @Column(name = "code_name", nullable = false, unique = true)
    private String codeName;

    @Column(name = "code", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "display", nullable = false)
    private Boolean display = true;
}
