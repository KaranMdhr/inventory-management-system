window.formConfig = {
    title: "Company Setup",
    method: "POST",
    submitAPI: "/api/company/save",
    fields: [
        {
            type: "select",
            label: "Company Type",
            name: "companyType",
            // required: true,
            group: 1,
            fetchAPI: "/company/company-types",
            optionLabelKey: "codeName",
            optionValueKey: "code",

        },
        {
            type: "text",
            label: "Company Name",
            name: "companyName",
            required: true,
            placeholder: "Enter Name",
            group: 1
        },
        {
            type: "text",
            label: "Address",
            name: "address",
            // required: true,
            placeholder: "Enter Address",
            group: 1
        },
        {
            type: "tel",
            label: "Mobile",
            name: "mobile",
            // required: true,
            pattern: "^\\d{6,15}$",
            placeholder: "e.g. 9860112233",
            group: 1
        },
        {
            type: "tel",
            label: "Alternate Mobile",
            name: "alternateMobile",
            // required: false,
            pattern: "^\\d{6,15}$",
            placeholder: "e.g. 9812345678",
            group: 2
        },
        {
            type: "email",
            label: "Email Address",
            name: "email",
            // required: true,
            placeholder: "e.g. info@company.com",
            pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
            group: 2
        },
        {
            type: "text",
            label: "Contact Person Name",
            name: "contactPersonName",
            // required: true,
            placeholder: "Contact Person Name",
            group: 2
        },
        {
            type: "tel",
            label: "Contact Person Mobile",
            name: "contactPersonMobile",
            // required: true,
            pattern: "^\\d{6,15}$",
            placeholder: "e.g. 9860112233",
            group: 2
        },
        {
            type: "tagInput",
            label: "Category",
            name: "category",
            placeholder: "Enter Category...",
            group: 3,
            suggestAPI: "/api/category/category-suggest", // can be offline; TagInput will fall back to dummy
            suggestKey: "categoryName"
        },
        {
            type: "tagInput",
            label: "Item",
            name: "item",
            placeholder: "Enter item...",
            group: 3,
            suggestAPI: "/api/item/suggestions",
            suggestKey: "itemName"
        }
    ],
    buttons: [
        { type: "submit", label: "Save", position: "bottom", class: "btn btn-sm btn-warning" },
        { type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary" }
    ]
}

// No extra init needed here; TagInput listens to 'formRendered'.

