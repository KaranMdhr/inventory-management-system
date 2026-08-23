package com.InventoryManagementSystem.Service;

import com.InventoryManagementSystem.Model.CategoryType;
import com.InventoryManagementSystem.Model.Generate;
import com.InventoryManagementSystem.Repository.CategoryTypeRepository;
import com.InventoryManagementSystem.Repository.GenerateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.InventoryManagementSystem.Model.CodeName;
import com.InventoryManagementSystem.Repository.CodeNameRepository;
import com.InventoryManagementSystem.Util.CodeGeneratorUtil;


@Service
public class CategoryTypeService {

    @Autowired
    private GenerateRepository generateRepository;

    @Autowired
    private CodeNameRepository codeNameRepository;

    @Autowired
    private CategoryTypeRepository categoryTypeRepository;

    public String saveCategoryAndSubCategory(String category, String subCategory) {
        boolean isCategoryExists = codeNameRepository.existsByCodeName(category, "Category");
        boolean isSubCategoryExists = codeNameRepository.existsByCodeNamesub(subCategory, "SubCategory");

        Generate generate = generateRepository.findByNameIgnoreCase("Category");
        if (generate == null || !Boolean.TRUE.equals(generate.getGenerate())) {
            throw new IllegalStateException("Auto-generate must be enabled to save Category and SubCategory.");
        }

        String categoryCode = CodeGeneratorUtil.generateUniqueCode(category, generate, codeNameRepository, "Category");
        System.out.println("categoryCode from service called: " + categoryCode);
        String subCategoryCode = CodeGeneratorUtil.generateUniqueCode(subCategory, generate, codeNameRepository, "SubCategory");

        StringBuilder message = new StringBuilder();

        CodeName categoryCodeName = null;
        if (!isCategoryExists) {
            categoryCodeName = new CodeName();
            categoryCodeName.setCodeName(category.toUpperCase());
            categoryCodeName.setCode(categoryCode.toUpperCase());
            categoryCodeName.setType("CATEGORY");
            categoryCodeName.setDisplay(true);
            codeNameRepository.save(categoryCodeName);
            message.append("Category saved. ");
        } else {
            categoryCodeName = codeNameRepository
                    .findByCodeNameIgnoreCaseAndTypeIgnoreCase(category, "CATEGORY")
                    .stream().findFirst().orElse(null);
            message.append("Category already exists. ");
        }

        CodeName subCategoryCodeName = null;
        if (!isSubCategoryExists) {
            subCategoryCodeName = new CodeName();
            subCategoryCodeName.setCodeName(subCategory.toUpperCase());
            subCategoryCodeName.setCode(subCategoryCode.toUpperCase());
            subCategoryCodeName.setType("SUBCATEGORY");
            subCategoryCodeName.setDisplay(true);
            codeNameRepository.save(subCategoryCodeName);
            message.append("SubCategory saved.");
        } else {
            subCategoryCodeName = codeNameRepository
                    .findByCodeNameIgnoreCaseAndTypeIgnoreCase(subCategory, "SUBCATEGORY")
                    .stream().findFirst().orElse(null);
            message.append("SubCategory already exists.");
        }

        // Save CategoryType if at least one was saved
        if (!isCategoryExists || !isSubCategoryExists) {
            CategoryType categoryType = new CategoryType();
            categoryType.setCategory(categoryCodeName);
            categoryType.setSubCategory(subCategoryCodeName);
            categoryType.setCategorycode((categoryCode + subCategoryCode).toUpperCase());
            categoryType.setCategoryname((category + " " + subCategory).toUpperCase());
            categoryTypeRepository.save(categoryType);
        }

        return message.toString().trim();
    }


}