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
@Table(name = "branch_type")
@Data
public class BranchType {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long btid;

    @Column(name = "branch_code", nullable = false, unique = true, length = 20)
    private String branchCode;

    @Column(name = "branch_name", nullable = false, length = 50)
    private String branchName;

    @ManyToOne
    @JoinColumn(name = "country_id", referencedColumnName = "code_id", nullable = true)
    private CodeName country;

    @ManyToOne
    @JoinColumn(name = "state_id", referencedColumnName = "code_id", nullable = true)
    private CodeName state;

    @ManyToOne
    @JoinColumn(name = "city_id", referencedColumnName = "code_id", nullable = true)
    private CodeName city;

    @ManyToOne
    @JoinColumn(name = "address_id", referencedColumnName = "code_id", nullable = true)
    private CodeName address;
}
