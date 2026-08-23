package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.InventoryManagementSystem.Model.GoodsReceivingNote;

public interface GoodsReceivingNoteRepository extends JpaRepository<GoodsReceivingNote, String> {
}
