window.formConfig = {
    title: "Add Category",
    id: "itemcategoryform",
    submitAPI: "/api/category/category-save",
    method: "POST",
    redirectURL: "/categorydetails",
    fields: [
        {
            type: "select",
            label: "Category Type",
            name: "categoryTypeId",
            group: 1,
            fetchAPI: "/api/category/categorytypes",
            optionLabelKey: "categoryname",
            optionValueKey: "ctid",
        },
        {
            type: "text",
            label: "Category Name",
            name: "categoryName",
            required: true,
            group: 2
        }
    ],
    buttons: [
        {
            type: "submit",
            label: "Save",
            id: "btn-save",
            position: "bottom",
            class: "btn btn-sm btn-warning",

        },

        {
            type: "button",
            label: "Cancel",
            id: "btn-cancel",
            position: "bottom",
            class: "btn btn-secondary",
            action: () => {
                console.log("Cancel button clicked, redirecting to home.");
                window.location.href = "/";
            }
        }
    ]
};
