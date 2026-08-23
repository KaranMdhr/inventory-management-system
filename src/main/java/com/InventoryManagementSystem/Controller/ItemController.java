package com.InventoryManagementSystem.Controller;

import com.InventoryManagementSystem.Dto.ItemDto;
import com.InventoryManagementSystem.Service.ItemService;
import com.InventoryManagementSystem.Util.AESEncryption;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/item")
public class ItemController {

    @Autowired
    private ItemService itemService;

    @Autowired
    AESEncryption aesEncryption;

    @GetMapping("/get-items")
    public ResponseEntity<?> getItems() {
        List<ItemDto> items = itemService.getItemDtos();
        return ResponseEntity.ok(items);
    }

    @GetMapping("get-item")
    public ResponseEntity<?> getItemById(@RequestBody ItemDto dto, HttpSession session) {
        System.out.println("this is itemID: " + dto);
        String encryptedItemCode = dto.getItemCode();
        String itemCode = aesEncryption.decrypt(encryptedItemCode);
        session.setAttribute("itemCode", itemCode);
        ItemDto item = itemService.getItemById(itemCode);
        return ResponseEntity.ok(item);
    }


    @PostMapping("/submit-item")
    public ResponseEntity<?> saveItem(@RequestBody ItemDto dto) {
        System.out.println("this is from controller: " + dto);
        itemService.saveItem(dto);
        return ResponseEntity.ok("Saved successfully!");

    }

//    @PutMapping("update-itembyid")
//    public ResponseEntity<?> updateByitemCode(@RequestBody ItemDto dto, HttpSession session) {
//        System.out.println("this is itemID: " + dto);
//        String encryptedItemCode = dto.getItemCode();
//        String itemCode = aesEncryption.decrypt(encryptedItemCode);
//        session.setAttribute("itemCode", itemCode);
//        ItemDto item = itemService.updateItemById(itemCode);
//    }
}


