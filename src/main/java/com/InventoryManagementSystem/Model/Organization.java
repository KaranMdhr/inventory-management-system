package com.InventoryManagementSystem.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "Organization")
@Data
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "org_name", nullable = false,unique = true)
    private String orgName;

    @Column(name = "mobile", length = 20)
    private String mobile;

    @Column(name = "alternate_mobile", length = 20)
    private String alternateMobile;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "address", length = 100)
    private String address;

    @Column(name = "registration_number", length = 50)
    private String registrationNumber;

    @Column(name = "pan_vat_number", length = 50)
    private String panVatNumber;

    @Column(name = "logo", length = 255)
    private String logo;

    @Column(name = "display", nullable = false)
    private Boolean display = true;

    @Column(name = "inventory_method", length = 50)
    private String inventoryMethod;
}
