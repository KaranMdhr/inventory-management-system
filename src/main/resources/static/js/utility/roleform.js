window.formConfig={
    title: "Add New Role",
    method: "POST",
    submitAPI: "/api/save-roles",
    id: "rolefor",
    fields: [
        {
            type: "text",
            label: "Role",
            name: "roleName",
            required: true,
            placeholder: "Enter Role",
            group: 1
        },
    ],
    buttons: [
        { type: "submit", label: "Save", position: "bottom", class: "btn btn-sm btn-warning" },
        { type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary" }
    ],
}