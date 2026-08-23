package com.InventoryManagementSystem.Model;

import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "company")
@Data
public class Company {
    @Id
    @Column(name = "company_code", length = 20, unique = true, nullable = false)
    private String companyCode;

    @Column(name = "company_name", nullable = false, unique = true)
    private String companyName;

    @Column(name = "address")
    private String address;

    @Column(name = "mobile", length = 20)
    private String mobile;

    @Column(name = "alternate_mobile", length = 20)
    private String alternateMobile;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "contact_person_name")
    private String contactPersonName;

    @Column(name = "contact_person_mobile", length = 20)
    private String contactPersonMobile;

    @Column(name = "display", nullable = false)
    private Boolean display = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany
    @JoinTable(
        name = "company_category",
        joinColumns = @JoinColumn(name = "company_code", referencedColumnName = "company_code"),
        inverseJoinColumns = @JoinColumn(name = "category_id", referencedColumnName = "category_id")
    )
    private Set<Category> categories;

    @ManyToMany
    @JoinTable(
        name = "company_item",
        joinColumns = @JoinColumn(name = "company_code", referencedColumnName = "company_code"),
        inverseJoinColumns = @JoinColumn(name = "item_code", referencedColumnName = "item_code")
    )
    private Set<Item> items;

    @ManyToOne
    @JoinColumn(name = "company_type_code", referencedColumnName = "code", nullable = false)
    private CodeName companyTypeCode;

    @Column(name = "company_type", nullable = false, length = 50)
    private String companyType;
}