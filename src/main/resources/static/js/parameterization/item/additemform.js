window.formConfig = {
    title: "Add New Item",
    method: "POST",
    id: "additemform",
    submitAPI: "/api/item/submit-item",
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
        { type: "button", label: "Add Row", position: "bottom", class: "btn btn-dark", onclick: "addFormRow( this)" },
        {type: "submit", label: "Save", position: "bottom", class: "btn btn-sm btn-warning"},
        {type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary"}
    ],

}

let formRowCount = 1;

function addFormRow(button) {
    const formElement = document.getElementById(window.formConfig.id);

    // Row container
    const formRow = document.createElement("div");
    formRow.classList.add("form-row");
    formRow.dataset.rowIndex = formRowCount;

    // Add fields in group 1
    window.formConfig.fields.forEach(field => {
        if (field.group === 1) { // Only process fields in group 1
            const fieldGroup = document.createElement("div");
            fieldGroup.classList.add("form-group");

            // Input / Select
            let inputElement;
            if (field.type === "select") {
                inputElement = document.createElement("select");
                inputElement.classList.add("form-control");

                // Placeholder option
                const placeholderOption = document.createElement("option");
                placeholderOption.value = "";
                placeholderOption.textContent = `Select ${field.label}`;
                placeholderOption.disabled = true;
                placeholderOption.selected = true;
                inputElement.appendChild(placeholderOption);

                // Fetch options if API is defined
                if (field.fetchAPI) {
                    fetch(field.fetchAPI)
                        .then(res => res.json())
                        .then(data => {
                            data.forEach(item => {
                                const option = document.createElement("option");
                                option.value = item[field.optionValueKey];
                                option.textContent = item[field.optionLabelKey];
                                inputElement.appendChild(option);
                            });
                        });
                }
            } else {
                inputElement = document.createElement("input");
                inputElement.type = field.type;
                inputElement.classList.add("form-control");
                inputElement.placeholder = field.placeholder || "";
                if (field.min !== undefined) inputElement.min = field.min;
            }

            inputElement.name = `${field.name}_${formRowCount}`;
            inputElement.required = !!field.required;
            fieldGroup.appendChild(inputElement);

            // Error div
            const errorDiv = document.createElement("div");
            errorDiv.classList.add("field-error");
            errorDiv.style.display = "none";
            fieldGroup.appendChild(errorDiv);

            formRow.appendChild(fieldGroup);
        }
    });

    // Add remove button in its own form-group (still part of group 1)
    const removeGroup = document.createElement("div");
    removeGroup.classList.add("form-group");
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "X";
    removeBtn.classList.add("btn", "btn-danger", "ml-2"); // Add margin for spacing
    removeBtn.onclick = () => formRow.remove();
    removeGroup.appendChild(removeBtn);
    formRow.appendChild(removeGroup); // Append after group 1 fields

    // Insert before action buttons
    const actionButtons = Array.from(formElement.querySelectorAll("button"))
        .find(btn => btn.textContent.includes("Add Row"))?.closest(".form-actions") || formElement.lastElementChild;

    formElement.insertBefore(formRow, actionButtons);
    formRowCount++;
}