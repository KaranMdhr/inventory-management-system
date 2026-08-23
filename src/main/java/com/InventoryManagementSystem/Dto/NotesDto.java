package com.InventoryManagementSystem.Dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class NotesDto {
    private Long noteId;
    private Long userId;
    private String notes;
    private String image;
    private Boolean display;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String title;
}
