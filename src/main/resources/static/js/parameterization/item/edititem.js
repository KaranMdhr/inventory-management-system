window.formConfig = {
    title: "Add New Item",
    method: "POST",
    updateAPI: "/api/item/submit-item",
    fields: [
        {
            type: "select",
            label: "Category",
            name: "categoryId",
            fetchAPI: "/api/category/category-list",
            required: true,
            placeholder: "Enter Category",
            group: 1,
            optionLabelKey: "categoryName",
            optionValueKey: "categoryId",        },
        {
            type: "text",
            label: "Item Name",
            name: "itemName",
            required: true,
            placeholder: "Enter Item Name",
            group: 1
        },
        {
            type: "text",
            label: "Location",
            name: "location",
            required: true,
            placeholder: "Enter Location",
            group: 1
        },
        {
            type: "number",
            label: "Minimum Order Level",
            name: "minimumOrderLevel",
            required: true,
            placeholder: "Enter Minimum Order Level",
            min: 0,
            group: 1
        },
        {
            type: "number",
            label: "Reorder Level",
            name: "reorderLevel",
            required: true,
            placeholder: "Enter Reorder Level",
            min: 0,
            group: 1
        },
    ],
    buttons: [
        {type: "submit", label: "Save", position: "bottom", class: "btn btn-sm btn-warning"},
        {type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary"}
    ],

}