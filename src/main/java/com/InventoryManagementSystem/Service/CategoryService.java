package com.InventoryManagementSystem.Service;

import com.InventoryManagementSystem.Dto.CategoryDto;
import com.InventoryManagementSystem.Model.Category;
import com.InventoryManagementSystem.Model.CategoryType;
import com.InventoryManagementSystem.Repository.CategoryRepository;
import com.InventoryManagementSystem.Repository.CategoryTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import static com.InventoryManagementSystem.Util.CodeGeneratorUtil.generateNextCode;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryTypeRepository categoryTypeRepository;

    public void saveCategory(CategoryDto dto) {
        if (categoryRepository.existsByCategoryName(dto.getCategoryName())) {
            throw new IllegalArgumentException("Category name already exists.");
        }

        Category category = new Category();
        category.setCategoryName(dto.getCategoryName());
        category.setDisplay(true);

        CategoryType type = categoryTypeRepository.findById(dto.getCategoryTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Category type not found."));
        category.setCategoryTypeId(type);

        String baseCode = type.getCategorycode();
        List<Category> categories = categoryRepository.findByCategoryCodeStartingWith(baseCode);
        String nextCategoryCode = generateNextCode(baseCode, categories, Category::getCategoryCode);
        category.setCategoryCode(nextCategoryCode);

        categoryRepository.save(category);
    }

    public void updateCategory(Long id, CategoryDto dto) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found."));

        if (!category.getCategoryName().equals(dto.getCategoryName()) &&
                categoryRepository.existsByCategoryName(dto.getCategoryName())) {
            throw new IllegalArgumentException("Category name already exists.");
        }

        category.setCategoryName(dto.getCategoryName());

        CategoryType type = categoryTypeRepository.findById(dto.getCategoryTypeId())
                .orElseThrow(() -> new IllegalArgumentException("Category type not found."));
        // If type changes, update and regenerate code
        if (!category.getCategoryTypeId().getCtid().equals(dto.getCategoryTypeId())) {
            String baseCode = type.getCategorycode();
            List<Category> categories = categoryRepository.findByCategoryCodeStartingWith(baseCode);
            String nextCategoryCode = generateNextCode(baseCode, categories, Category::getCategoryCode);
            category.setCategoryCode(nextCategoryCode);
            category.setCategoryTypeId(type);
        } else {
            category.setCategoryTypeId(type);
        }

        categoryRepository.save(category);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAllActive();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));
    }

    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + id));

        category.setDisplay(false);
        categoryRepository.save(category);
    }

    public List<CategoryDto> suggestCategoriesByName(String q) {
        List<Category> categories = categoryRepository.findByCategoryNameContainingIgnoreCase(q);
        return categories.stream()
                .map(cat -> {
                    CategoryDto dto = new CategoryDto();
                    dto.setCategoryName(cat.getCategoryName());
                    return dto;
                })
                .toList();
    }





}