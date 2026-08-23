package com.InventoryManagementSystem.Model;

import java.time.LocalDate;
import java.time.LocalDateTime;

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
@Table(name = "insurance")
@Data
public class Insurance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "insurance_id", unique = true, nullable = false)
    private Long insuranceId;

    @Column(name = "company_name", nullable = false)
    private String companyName;

    @Column(name = "policy_number", nullable = false, unique = true)
    private String policyNumber;

    @ManyToOne
    @JoinColumn(name = "category_id", referencedColumnName = "category_id", nullable = false)
    private Category itemCategory;

    @Column(name = "type")
    private String type;

    @Column(name = "sum_insured")
    private Double sumInsured;

    @Column(name = "declared_value")
    private Double declaredValue;

    @Column(name = "premium_amount")
    private Double premiumAmount;

    @Column(name = "deductible")
    private Double deductible;

    @Column(name = "claim_limit")
    private Double claimLimit;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(name = "claim_date")
    private LocalDate claimDate;

    @Column(name = "payment_frequency")
    private String paymentFrequency;

    @Column(name = "no_claim_bonus")
    private String noClaimBonus;

    @Column(name = "add_ons")
    private String addOns;

    @Column(name = "name")
    private String name;

    @Column(name = "phone")
    private String phone;

    @Column(name = "email")
    private String email;

    @Column(name = "document")
    private String document;

    @Column(name = "display", nullable = false)
    private Boolean display = true;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "status")
    private String status;

    @ManyToOne
    @JoinColumn(name = "receive_items_id", referencedColumnName = "receive_items_id", nullable = false)
    private ReceiveItems receiveItems;
}
