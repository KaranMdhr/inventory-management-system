window.formConfig={
        title: "Employee",
        method: "POST",
        id: "companystaffform",
        image: true,
        submitAPI: "/api/employees/save",
        fields: [
            {
                type: "text",
                label: "First Name",
                name: "firstName",
                required: true,
                group: 1
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
                group: 1
            },
            {
                type: "select",
                label: "Employee Type",
                name: "employeeType",
                required: true,
                group: 2,
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
                group: 3,
                placeholder: "e.g. info@company.com",
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
            },
            {
                type: "tel",
                label: "Phone Number",
                name: "phoneNumber",
                required: true,
                group: 3,
                placeholder: "e.g. 9860112233",
                pattern: "^\\d{6,15}(,\\s*\\d{6,15})*$"
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
                type: "file",
                label: "Profile Picture",
                name: "image",
                group: 5,
                accept: "image/*"
            }
        ],
        buttons: [
            { type: "submit", label: "Save", position: "bottom", class: "btn btn-sm btn-warning" },
            { type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary" }
        ]
    }