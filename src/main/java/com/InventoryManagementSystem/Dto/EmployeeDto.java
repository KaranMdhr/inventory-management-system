package com.InventoryManagementSystem.Dto;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EmployeeDto {
    private Long employeeId;
    private String firstname;
    private String middleName;
    private String lastName;
    private String type;
    private String gender;
    private String email;
    private String mobile;
    private Long branchId;
    private Long departmentId;
    private String picture;
    private String password;
    private Long userRoleId;
    private Boolean display;
    private Boolean suspend;
    private LocalDateTime suspendPeriod;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String status;
    private Long permissionsId;
}
