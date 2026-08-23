package com.InventoryManagementSystem.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.InventoryManagementSystem.Model.Calender;

public interface CalenderRepository extends JpaRepository<Calender, Long> {
    Optional<Calender> findByAdDateAndDisplayTrue(LocalDate adDate);
    List<Calender> findByBsDateBetweenAndDisplayTrue(String start, String end);
    List<Calender> findByAdDateBetweenAndDisplayTrue(LocalDate start, LocalDate end);
    List<Calender> findByBsDateStartingWithAndDisplayTrue(String bsYearPrefix);
    List<Calender> findByBsDateStartingWithAndMonthAndDisplayTrue(String bsYearPrefix, String month);
    Optional<Calender> findByBsDate(String bsDate);
}