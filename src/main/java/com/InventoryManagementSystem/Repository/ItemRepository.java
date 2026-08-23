package com.InventoryManagementSystem.Repository;

import com.InventoryManagementSystem.Model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

import com.InventoryManagementSystem.Model.Item;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface ItemRepository extends JpaRepository<Item, String> {
    List<Item> findByItemCodeStartingWith(String baseCode);

    boolean existsByItemName(String categoryName);

    @Query("SELECT i FROM Item i WHERE i.display=true ")
    List<Item> findAllByDisplay();

    @Query("SELECT i FROM Item i WHERE i.itemCode= :id AND i.display = true ")
    Item findByIdAndDisplay(@Param("id") String id);


}
