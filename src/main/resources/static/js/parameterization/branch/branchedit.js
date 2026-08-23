window.formConfig ={
    title: "Edit Branch Setup",
    id: "editbranch",
    updateAPI: "/api/branch/branch-update/{id}",
    fetchAPI: "/api/branch/branch/{id}",
    method: "PUT",
    redirectURL: "/branchdetails",
    fields: [
        {
            type: "text",
            label: "Branch Name:",
            name: "branchName",
            required: true,
            group: 1
        },
        {
            type: "text",
            label: "Branch Code",
            name: "branchCode",
            required: true,
            group: 1,
            readonly: true
        },
        {
            type: "email",
            label: "Email Address:",
            name: "branchEmail",
            required: true,
            group: 1,

        },
        {
            type: "text",
            label: "Country:",
            name: "country",
            required: true,
            group: 2,
            readonly: true

        },
        {
            type: "text",
            label: "Province:",
            name: "province",
            required: true,
            group: 2,
            readonly: true
        },
        {
            type: "text",
            label: "City:",
            name: "city",
            required: true,
            group: 2,
            readonly: true
        },
        {
            type: "text",
            label: "Address:",
            name: "address",
            required: true,
            group: 2,
            readonly: true
        },
        {
            type: "text",
            label: "Branch Manager:",
            name: "branchManager",
            required: true,
            group: 3
        },
        {
            type: "tel",
            label: "Mobile:",
            name: "branchPhone",
            required: true,
            pattern: "^\\d{6,15}(,\\s*\\d{6,15})*$",
            group: 3
        },
        {
            type: "tel",
            label: "Alternate Mobile:",
            name: "branchAlternatePhone",
            required: false,
            pattern: "^\\d{6,15}(,\\s*\\d{6,15})*$",
            group: 3
        },

        {
            type: "text",
            label: "Contact Person Name:",
            name: "contactPersonName",
            required: false,
            group: 4
        },
        {
            type: "tel",
            label: "Contact Person Mobile:",
            name: "contactPersonPhone",
            required: false,
            pattern: "^\\d{6,15}(,\\s*\\d{6,15})*$",
            group: 4
        },

    ],
    buttons: [
        { type: "submit", label: "Update", position: "bottom",
            id: "btn-update", class: "btn btn-sm btn-warning" },
        { type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary" }
    ],

}




