package com.InventoryManagementSystem.Model;

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
@Table(name = "item_issue")
@Data
public class ItemIssue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "issue_code")
    private Long issueCode;

    @ManyToOne
    @JoinColumn(name = "issued_to", referencedColumnName = "employee_id", nullable = false)
    private Employee issuedTo;

    @ManyToOne
    @JoinColumn(name = "issued_by", referencedColumnName = "employee_id", nullable = false)
    private Employee issuedBy;

    @Column(name = "display")
    private Boolean display;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
