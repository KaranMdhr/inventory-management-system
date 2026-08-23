window.formConfig = {
    id: "userregistrationform",
    title: "User Registration",
    method: "POST",
    image: true,
    submitAPI: "/api/employees/save",
    fields: [
        {
            type: "text",
            label: "First Name",
            name: "firstName",
            required: true,
            pattern: "none",
            group: 1,
        },
        {
            type: "text",
            label: "Middle Name",
            name: "middleName",
            group: 1
        },
        {
            type: "text",
            label: "Last Name",
            name: "lastName",
            required: true,
            pattern: "none",
            group: 1
        },
        {
            type: "select",
            label: "Employee Type",
            name: "employeeType",
            required: true,
            group: 2,
            pattern: "none",
            options: [
                { value: "", text: "Select Type" },
                { value: "permanent", text: "Permanent" },
                { value: "temporary", text: "Temporary" },
                { value: "intern", text: "Intern" },
                { value: "outsource", text: "Outsource" }
            ]
        },
        {
            type: "radioGroup",
            label: "Gender",
            name: "gender",
            required: true,
            group: 2,
            pattern: "none",
            options: [
                { value: "male", text: "Male" },
                { value: "female", text: "Female" },
                { value: "other", text: "Other" }
            ]
        },
        {
            type: "email",
            label: "Email",
            name: "email",
            required: true,
            placeholder: "e.g. info@company.com",
            group: 3
        },
        {
            type: "tel",
            label: "Phone Number",
            name: "phoneNumber",
            required: true,
            placeholder: "e.g. 9860112233",
            group: 3,
            pattern: "^\\d{10}$", // Only 10 digits
            patternError: "Phone number must be exactly 10 digits"
        },
        {
            type: "select",
            label: "Branch",
            name: "branch",
            required: true,
            group: 4,
            options: [],
            fetchAPI: "/api/branches/branch-list",
            optionLabelKey: "branchName",
            optionValueKey: "branchId",
        },
        {
            type: "select",
            label: "Department",
            name: "department",
            required: true,
            options: [],
            group: 4,
            fetchAPI: "/api/departments/department-list",
            optionLabelKey: "departmentName",
            optionValueKey: "departmentId",
        },
        {
            type: "select",
            label: "Role",
            name: "role",
            required: true,
            pattern: "none",
            group: 5,
            options: [],
            fetchAPI: "/api/roles/role-list",
            optionLabelKey: "roleName",
            optionValueKey: "roleId"
        },
        {
            type: "checkbox-group",
            label: "Permissions",
            name: "permissions",
            required: true,
            pattern: "none",
            group: 6,
            options: [
                { value: "view", text: "Submit Item Request" },
                { value: "create", text: "Approve Item Requests" },
                { value: "edit", text: "Create Purchase Orders" },
                { value: "delete", text: "Manage Users" },
                { value: "approve", text: "Manage Staff Members" },
                { value: "all", text: "All" }
            ]

        },
        {
            type: "file",
            label: "Profile Picture",
            name: "image",
            accept: "image/*",
            group: 7
        }
    ],
    buttons: [
        { type: "submit", label: "Save", position: "bottom", class: "btn btn-sm btn-warning" },
        { type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary" }
    ]
}