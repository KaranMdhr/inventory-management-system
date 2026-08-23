window.formConfig = {
    title: "Category Hierarchy",
    method: "POST",
    submitAPI: "/api/categorytype/save",
    redirectURL: "/categorydetails",
    fields: [
        {
            type: "datalist",
            label: "Category",
            name: "category",
            required: true,
            placeholder: "Enter or select category",
            datalistId: "categorySuggestions",
            options: []
        },
        {
            type: "text",
            label: "Sub-Category",
            name: "categoryType",
            required: true,
            placeholder: "Enter category type"
        }
    ],
    buttons: [
        {type: "submit", label: "Save", position: "bottom", class: "btn btn-sm btn-warning"},
        {type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary"}
    ],
}