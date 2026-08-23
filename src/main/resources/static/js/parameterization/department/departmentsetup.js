window.formConfig ={
    title: "Department Setup",
    method: "POST",
    submitAPI: "/api/department/setup",
        fields: [
        {
            type: "text",
            label: "Department Name:",
            name: "departmentName",
            required: true,
            placeholder: "Enter Name",
            group: 1
        },
        {
            type: "checkbox",
            label: "Status",
            name: "isActive",
            required: true,
            text: "Active",
            group: 2
        },
    ],
        buttons: [
        { type: "submit", label: "Save", position: "bottom", class: "btn btn-sm btn-warning" },
        { type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary" }
    ],
}