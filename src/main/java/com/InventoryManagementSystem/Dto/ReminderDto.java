package com.InventoryManagementSystem.Dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Data;

@Data
public class ReminderDto {
    private Long reminderId;
    private String name;
    private Long userId;
    private LocalDate date;
    private LocalTime time;
    private String description;
}
