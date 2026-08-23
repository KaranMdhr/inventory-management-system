package com.InventoryManagementSystem.Service;

import com.InventoryManagementSystem.Dto.CategoryDto;
import com.InventoryManagementSystem.Dto.ItemDto;
import com.InventoryManagementSystem.Model.*;
import com.InventoryManagementSystem.Repository.*;
import com.InventoryManagementSystem.Util.CodeGeneratorUtil;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

import static com.InventoryManagementSystem.Util.CodeGeneratorUtil.generateNextCode;

@Service
public class ItemService {
    @Autowired
    private ItemRepository itemRepository;

    @Autowired
    private CategoryTypeRepository categoryTypeRepository;

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private CodeNameRepository codeNameRepository;

    @Autowired
    private GenerateRepository generateRepository;

    public void saveItem(ItemDto dto) {
        if (itemRepository.existsByItemName(dto.getItemName())) {
            throw new IllegalArgumentException("Item name already exists.");
        }
        String itemName = dto.getItemName();
        boolean isItemExists = codeNameRepository.existsByCodeName(itemName, "Item");

        Generate generate = generateRepository.findByNameIgnoreCase("Item");
        if (generate == null || !Boolean.TRUE.equals(generate.getGenerate())) {
            throw new IllegalStateException("Auto-generate must be enabled to save Category and SubCategory.");
        }
        String itemTypeCode = CodeGeneratorUtil.generateUniqueCode(itemName, generate, codeNameRepository, "Item");
        System.out.println("sout of itemCode: " + itemTypeCode);
        // String itemTypeCode = CodeGeneratorUtil.generateUniqueCode(itemName,
        // generate, codeNameRepository, "Item");

        StringBuilder message = new StringBuilder();

        CodeName itemCodeName = null;
        if (!isItemExists) {
            itemCodeName = new CodeName();
            itemCodeName.setCodeName(itemName.toUpperCase());
            itemCodeName.setCode(itemTypeCode.toUpperCase());
            itemCodeName.setType("ITEM");
            itemCodeName.setDisplay(true);
            codeNameRepository.save(itemCodeName);
            message.append("Category saved. ");
        } else {
            itemCodeName = codeNameRepository
                    .findByCodeNameIgnoreCaseAndTypeIgnoreCase(itemName, "ITEM")
                    .stream().findFirst().orElse(null);
            message.append("Category already exists. ");
        }

        Branch branch = new Branch();
        branch.setBranchId(1L);

        Item item = new Item();
        item.setItemName(dto.getItemName());
        item.setDisplay(true);
        item.setLocation(dto.getLocation());
        item.setMaximumOrderLevel(dto.getMaximumOrderLevel());
        item.setMinimumOrderLevel(dto.getMinimumOrderLevel());
        item.setReorderLevel(dto.getReorderLevel());
        String baseCode = itemTypeCode;
        System.out.println("getItemCode: " + baseCode);
        List<Item> items = itemRepository.findByItemCodeStartingWith(baseCode);
        String nextItemCode = generateNextCode(baseCode, items, Item::getItemCode);
        item.setBranch(branch);
        Category category = categoryRepository.findById(dto.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        item.setCategory(category);
        item.setItemCode(nextItemCode);
        item.setItemTypeCode(itemCodeName);
        item.setCreatedAt(LocalDateTime.now());
        item.setUpdatedAt(LocalDateTime.now());
        System.out.println("this is item: " + item);
        itemRepository.save(item);

    }

    public ItemDto getItemById(String id) {
        Item item = itemRepository.findByIdAndDisplay(id);
        return toDto(item);
    }
//    public ItemDto updateItemById(String id){
//        if(getItemById=null){
//
//        }
//
//    }


    public ItemDto toDto(Item item) {
        ItemDto dto = new ItemDto();
        dto.setItemCode(item.getItemCode());
        dto.setItemName(item.getItemName());
        dto.setCategoryId(item.getCategory().getCategoryId());
        dto.setCategoryName(item.getCategory().getCategoryName());
        dto.setBranchId(item.getBranch().getBranchId());
        dto.setLocation(item.getLocation());
        dto.setMinimumOrderLevel(item.getMinimumOrderLevel());
        dto.setReorderLevel(item.getReorderLevel());
        dto.setMaximumOrderLevel(item.getMaximumOrderLevel());
        dto.setDisplay(item.getDisplay());
        dto.setCreatedAt(item.getCreatedAt());
        dto.setUpdatedAt(item.getUpdatedAt());
        if (item.getItemTypeCode() != null) {
            dto.setItemTypeCodeId(item.getItemTypeCode().getCodeId());
        }
        return dto;
    }

    public List<ItemDto> getItemDtos() {
        return itemRepository.findAllByDisplay().stream().map(this::toDto).toList();
    }

}
