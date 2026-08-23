package com.InventoryManagementSystem.Repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.InventoryManagementSystem.Model.Reminder;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {

}
