let formConfigs = {
    Companysetup: {
        title: "Organization Setup",
        method: "POST",
        id: "companysetupform",
        image: true,
        submitAPI: "/organization/submit-organization",
        fields: [
            {
                type: "text",
                label: "Company Name:",
                name: "orgName",
                required: true,
                placeholder: "Enter Name",
                group: 1
            },
            {
                type: "text",
                label: "Address:",
                name: "address",
                required: true,
                placeholder: "Enter Address",
                group: 1
            },
            {
                type: "tel",
                label: "Mobile:",
                name: "mobile",
                required: true,
                pattern: "^\\d{6,15}$",
                placeholder: "e.g. 9860112233",
                group: 1
            },
            {
                type: "tel",
                label: "Alternate Mobile:",
                name: "alternateMobile",
                required: false,
                pattern: "^\\d{6,15}$",
                placeholder: "e.g. 9812345678",
                group: 2
            },
            {
                type: "email",
                label: "Email Address:",
                name: "email",
                required: true,
                placeholder: "e.g. info@company.com",
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                group: 2
            },
            {
                type: "text",
                label: "Registration Number:",
                name: "registrationNumber",
                required: false,
                placeholder: "Enter Registration Number",
                group: 2
            },
            {
                type: "text",
                label: "PAN/VAT Number:",
                name: "panVatNumber",
                required: false,
                placeholder: "Enter PAN/VAT Number",
                group: 2
            },
            {
                type: "file",
                label: "Company Logo:",
                name: "logo",
                required: false,
                placeholder: "Upload Company Logo",
                group: 3
            }
        ],
        buttons: [
            { type: "submit", label: "Save", position: "bottom", class: "btn btn-sm btn-warning" },
            { type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary" }
        ],
    },
    itemhierarchyform: {
        title: "Category Hierarchy",
        method: "POST",
        submitAPI: "/categorytype/save",
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
            { type: "submit", label: "Save", position: "bottom", class: "btn btn-sm btn-warning" },
            { type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary" }
        ],
    },
    Categoryform: {
        title: "Add Item Category",
        method: "POST",
        id: "itemcategoryform",
        submitAPI: "/category/category-save",
        fields: [
            {
                type: "select",
                label: "Category Type",
                name: "categoryTypeId",
                group: 1,
                fetchAPI: "/category/categorytypes",
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
            { type: "submit", label: "Save", position: "bottom", class: "btn btn-sm btn-warning" },
            { type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary" }
        ]
    },
    Companyform: {
        title: "Company Setup",
        method: "POST",
        submitAPI: "/",
        fields: [
            {
                type: "select",
                label: "Company Type",
                name: "companyType",
                required: true,
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
                required: true,
                placeholder: "Enter Address",
                group: 1
            },
            {
                type: "tel",
                label: "Mobile",
                name: "mobile",
                required: true,
                pattern: "^\\d{6,15}$",
                placeholder: "e.g. 9860112233",
                group: 1
            },
            {
                type: "tel",
                label: "Alternate Mobile",
                name: "alternateMobile",
                required: false,
                pattern: "^\\d{6,15}$",
                placeholder: "e.g. 9812345678",
                group: 2
            },
            {
                type: "email",
                label: "Email Address",
                name: "email",
                required: true,
                placeholder: "e.g. info@company.com",
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                group: 2
            },
            {
                type: "text",
                label: "Contact Person Name",
                name: "contactPersonName",
                required: true,
                placeholder: "Contact Person Name",
                group: 2
            },
            {
                type: "tel",
                label: "Contact Person Mobile",
                name: "contactPersonMobile",
                required: true,
                pattern: "^\\d{6,15}$",
                placeholder: "e.g. 9860112233",
                group: 2
            },
            {
                type: "tagInput",
                label: "Category",
                name: "category",
                placeholder: "Enter Category...",
                group: 3
            },
            {
                type: "tagInput",
                label: "Item",
                name: "item",
                placeholder: "Enter item...",
                group: 3
            }
        ],
        buttons: [
            { type: "submit", label: "Save", position: "bottom", class: "btn btn-sm btn-warning" },
            { type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary" }
        ]
    },
    Departmentsetup: {
        title: "Department Setup",
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
    },
    Branchsetup: {
        title: "Branch Setup",
        method: "POST",
        submitAPI: "/",
        fields: [
            {
                type: "text",
                label: "Branch Name:",
                name: "branchName",
                required: true,
                placeholder: "Enter Name",
                group: 1
            },
            {
                type: "text",
                label: "Branch Address:",
                name: "address",
                required: true,
                placeholder: "Enter Address",
                group: 1
            },
            {
                type: "text",
                label: "Branch Manager:",
                name: "branchManager",
                required: true,
                placeholder: "Enter Branch Manager",
                group: 1
            },
            {
                type: "tel",
                label: "Mobile:",
                name: "mobile",
                required: true,
                pattern: "^\\d{6,15}(,\\s*\\d{6,15})*$",
                placeholder: "e.g. 9860112233",
                group: 2

            },
            {
                type: "tel",
                label: "Alternate Mobile:",
                name: "alternateMobile",
                required: true,
                pattern: "^\\d{6,15}(,\\s*\\d{6,15})*$",
                placeholder: "e.g. 9860112233",
                group: 2

            },
            {
                type: "email",
                label: "Email Address:",
                name: "email",
                required: true,
                placeholder: "e.g. abc.gmail.com",
                group: 2

            },
            {
                type: "text",
                label: "Contact Person Name:",
                name: "contactPersonName",
                required: true,
                placeholder: "Contact Person Name",
                group: 3

            },
            {
                type: "tel",
                label: "Contact Person Mobile:",
                name: "contactPersonMobile",
                required: true,
                pattern: "^\\d{6,15}(,\\s*\\d{6,15})*$",
                placeholder: "e.g. 9860112233",
                group: 3
            },

            {
                type: "checkbox",
                label: "Status",
                name: "isActive",
                required: true,
                text: "Active",
                group: 4

            },

        ],
        buttons: [
            { type: "submit", label: "Save", position: "bottom", class: "btn btn-sm btn-warning" },
            { type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary" }
        ],

    },
    AddItemForm: {
        title: "Add New Item",
        fields: [
            {
                type: "text",
                label: "Category",
                name: "category",
                required: true,
                placeholder: "Enter Category",
                group: 1
            },
            {
                type: "text",
                label: "Item Name",
                name: "itemName",
                required: true,
                placeholder: "Enter Item Name",
                group: 1
            },
            {
                type: "number",
                label: "Minimum Order Level",
                name: "lowStock",
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
            { type: "submit", label: "Save", position: "bottom", class: "btn btn-sm btn-warning" },
            { type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary" }
        ],
    },
    RequisitionSlipForm: {
        title: "Requisition Slip",
        method: "POST",
        submitAPI: "/",
        fields: [
            {
                type: "text",
                label: "Requisition No.",
                name: "requisitionNo",
                placeholder: "Auto-generated",
                readonly: true,
                group: 1
            },
            {
                type: "date",
                label: "Date",
                name: "date",
                required: true,
                group: 1
            },
            {
                type: "select",
                label: "Requested By",
                name: "requestedBy",
                options: [
                    { value: "", text: "Select User" },
                    { value: "John", text: "John" },
                    { value: "Jane", text: "Jane" }
                ],
                required: true,
                group: 1
            },
            {
                type: "select",
                label: "Department",
                name: "department",
                options: [
                    { value: "", text: "Select Dept" },
                    { value: "HR", text: "HR" },
                    { value: "IT", text: "IT" }
                ],
                required: true,
                group: 1
            }
        ],
        tables: [
            {
                name: "requisitionItems",
                id: "requisitionItems",
                label: "Requisition Items",
                headers: ["S.N.", "Item Name", "Qty", "Unit", "Remarks", "Action"],
                fields: [
                    { type: "text", name: "itemName", placeholder: "Item Name", required: true },
                    { type: "number", name: "qty", placeholder: "Qty", required: true },
                    { type: "text", name: "unit", placeholder: "Unit", required: true },
                    { type: "text", name: "remarks", placeholder: "Remarks" }
                ]
            }
        ],
        buttons: [
            { type: "button", label: "Add Row", position: "table", class: "btn btn-dark", onclick: "addRowByButton(this)", "data-table-id": "requisitionItems" },
            { type: "submit", label: "Save", position: "bottom", class: "btn btn-sm btn-warning" },
            { type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary" }
        ],
    },
    purchaseorderform: {
        title: "Purchase Order Form",
        fields: [
            {
                type: "select",
                label: "Order Type",
                name: "orderType",
                options: [
                    { value: "", text: "Select", disabled: true, hidden: true },
                    { value: "cash", text: "Cash" },
                    { value: "credit", text: "Credit" },
                    { value: "bank_transfer", text: "Bank Transfer" },
                    { value: "cheque", text: "Cheque" }
                ],
                required: true,
                group: 1,
                class: "ordertype"
            },
            {
                type: "select",
                label: "Supplier",
                name: "supplier",
                options: [
                    { value: "", text: "Select", disabled: true, hidden: true }
                ],
                required: true,
                group: 1,
                class: "supplier"
            },
            {
                type: "text",
                label: "Payment Terms",
                name: "paymentTerms",
                required: true,
                group: 1
            },
            {
                type: "radioGroup",
                label: "Purchase Method",
                name: "purchaseMethod",
                options: [
                    { value: "tender", text: "Tender" },
                    { value: "quotation", text: "Quotation" },
                    { value: "directPurchase", text: "Direct Purchase" }
                ],
                required: true,
                group: 1,
                className: "custom-radio-group"
            },
            {
                type: "date",
                label: "Order Date",
                name: "orderDate",
                required: true,
                group: 1
            },
            {
                type: "tagInput",
                label: "Requisition Code",
                name: "requisitionNumbers",
                placeholder: "Enter or select...",
                required: false,
                group: 1
            },
        ],
        tables: [
            {
                name: "purchaseItems",
                id: "purchaseItems",
                label: "Items Purchased",
                headers: ["S.No", "Item Purchased", "Rate", "Unit", "Quantity", "Total", "Action"],
                class: ["snitem", "itemPurchased", "rate", "unit", "quantity", "total", "action"],
                fields: [
                    {
                        type: "select",
                        name: "itemPurchased",
                        placeholder: "Select",
                        options: [
                            { value: "keyboard", text: "keyboard" },
                            { value: "mouse", text: "mouse" },
                            { value: "monitor", text: "monitor" },
                        ],
                        required: true

                    },
                    {
                        type: "number",
                        name: "rate",
                        placeholder: "Rate",
                        required: true,
                    },
                    {
                        type: "text",
                        name: "unit",
                        placeholder: "Unit"
                    },
                    {
                        type: "number",
                        name: "quantity",
                        placeholder: "Quantity",
                        required: true
                    },
                    {
                        type: "number",
                        name: "total",
                        placeholder: "Total",
                        required: true,
                        readonly: true
                    }
                ]
            }
        ],
        aftertableFields: [
            {
                type: "date",
                label: "Delivery Date - AD",
                name: "deliveryDateAD",
                required: true,
                group: 3
            },
            {
                type: "date",
                label: "Delivery Date - BS",
                name: "deliveryDateBS",
                required: true,
                group: 3
            },
            {
                type: "textarea",
                label: "Remarks",
                name: "remarks",
                required: false,
                group: 4
            }
        ],
        buttons: [
            { type: "button", label: "Add Row", position: "table", class: "btn btn-dark", onclick: "addRowByButton(this)", "data-table-id": "purchaseItems" },
            { type: "submit", label: "Save", position: "bottom", class: "btn btn-sm btn-warning" },
            { type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary" }
        ],

    },
    maintenanceAssignmentSetup: {
        title: "Maintenance & Support Assignment Form",
        method: "POST",
        fields: [
            {
                type: "text",
                label: "Company Name",
                name: "companyName",
                required: true,
                placeholder: "e.g., Acme Corp",
                group: 1
            },
            {
                section: "Primary Contact",
                type: "text",
                label: "Name",
                name: "contactName",
                required: true,
                group: 2
            },
            {
                type: "email",
                label: "Email",
                name: "contactEmail",
                required: true,
                group: 3
            },
            {
                type: "tel",
                label: "Mobile Number",
                name: "contactPhone",
                placeholder: "9800000000",
                pattern: "[0-9]{10}",
                required: true,
                group: 4
            },
            {
                type: "tel",
                label: "Alternate Mobile",
                name: "alternatemobile",
                placeholder: "Alternate number",
                pattern: "[0-9]{10}",
                group: 5
            },
            {
                type: "url",
                label: "Key URL",
                name: "keyUrl",
                required: true,
                placeholder: "Code repo or ticket portal link",
                group: 6,
                class: "url-class"
            },
            {
                type: "text",
                label: "Product Name",
                name: "productName",
                placeholder: "Enter system or product name",
                required: true,
                group: 7
            },
            {
                type: "textarea",
                label: "Responsibilities / Scope of Work",
                name: "scope",
                placeholder: "Describe tasks and expectations",
                required: true,
                group: 8
            },
            {
                type: "date",
                label: "Date",
                name: "effectiveDate",
                required: true,
                group: 9
            },
            {
                type: "textarea",
                label: "Additional Note",
                name: "additionalNote",
                class: "note-textarea",
                placeholder: "Any additional comments",
                group: 10
            },
            {
                type: "group",
                label: "Assignment Duration",
                class: "custom-group-class",
                groupFieldsClass: "row-flex",
                group: 11,
                fields: [
                    {
                        type: "number",
                        label: "Duration",
                        name: "durationNumber",
                        min: 1,
                        placeholder: "e.g., 6",
                        required: true
                    },
                    {
                        type: "select",
                        label: "Unit",
                        name: "durationUnit",
                        required: true,
                        options: [
                            { value: "", text: "Unit", disabled: true },
                            { value: "days", text: "Days" },
                            { value: "months", text: "Months" },
                            { value: "years", text: "Years" }
                        ]
                    }
                ]
            },
            {
                type: "textarea",
                label: "Additional Notes",
                name: "notes",
                placeholder: "Optional",
                group: 12
            },
            {
                type: "file",
                label: "Upload Contract/SLA (optional)",
                name: "contractUpload",
                accept: ".pdf,.doc,.docx",
                optional: true,
                group: 13
            }
        ],
        buttons: [
            { type: "submit", label: "Save", position: "bottom", class: "btn btn-sm btn-warning" },
            { type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary" }
        ]
    },
    inventoryMethodSetup: {
        title: "Inventory Valuation Method",
        fields: [
            {
                type: "radioGroup",
                label: "",
                name: "inventoryMethod",
                required: true,
                options: [
                    { value: "LIFO", text: "LIFO" },
                    { value: "FIFO", text: "FIFO" },
                    { value: "Average", text: "Average" }
                ]
            }
        ]
    },
    employeeFormSetup: {
        title: "Employee",
        method: "POST",
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
                type: "select",
                label: "Gender",
                name: "gender",
                required: true,
                group: 2,
                options: [
                    { value: "", text: "Select Gender" },
                    { value: "male", text: "Male" },
                    { value: "female", text: "Female" }
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
                fetchOptionsFrom: "/branches/list"
            },
            {
                type: "select",
                label: "Department",
                name: "department",
                required: true,
                options: [],
                group: 4,
                fetchOptionsFrom: "/departments/list"
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
    },
    userregistrationForm: {
        title: "User Registration",
        method: "POST",
        enctype: "multipart/form-data",
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
                type: "select",
                label: "Gender",
                name: "gender",
                required: true,
                group: 2,
                options: [
                    { value: "", text: "Select Gender" },
                    { value: "male", text: "Male" },
                    { value: "female", text: "Female" }
                ]
            },
            {
                type: "email",
                label: "Email",
                name: "email",
                required: true,
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                placeholder: "e.g. info@company.com",
                group: 3
            },
            {
                type: "tel",
                label: "Phone Number",
                name: "phoneNumber",
                required: true,
                pattern: "^\\d{6,15}(,\\s*\\d{6,15})*$",
                placeholder: "e.g. 9860112233",
                group: 3
            },
            {
                type: "select",
                label: "Branch",
                name: "branch",
                required: true,
                options: [],  // Branch options to be fetched dynamically
                fetchOptionsFrom: "/branches/list",
                group: 4
            },
            {
                type: "select",
                label: "Department",
                name: "department",
                required: true,
                options: [],  // Department options to be fetched dynamically
                fetchOptionsFrom: "/departments/list",
                group: 4
            },
            {
                type: "select",
                label: "Role",
                name: "role",
                required: true,
                group: 5,
                options: [
                    { value: "", text: "-- Select Role --" },
                    { value: "Admin", text: "Admin" },
                    { value: "Manager", text: "Manager" },
                    { value: "Staff", text: "Staff" }
                ]
            },

            {
                type: "checkbox-group",
                label: "Permissions",
                name: "permissions",
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
    },
    itemIssueSetup: {
        title: "Item Issue Form",
        method: "POST",
        fields: [
            {
                type: "tag-input",
                label: "Requisition Codes",
                name: "requestNumbers",
                inputId: "tagInput",
                containerId: "tagInputContainer",
                datalistId: "requisitionList",
                required: true,
                placeholder: "Enter Requisition Code",
                dynamicTags: true
            },
            {
                type: "table",
                label: "Issued Items",
                id: "itemsTable",
                containerId: "itemsTableContainer",
                displayCondition: "tagsAdded",
                columns: [
                    { header: "Item", name: "item" },
                    { header: "Unit", name: "unit" },
                    { header: "Quantity", name: "quantity" },
                    { header: "Rate", name: "rate" },
                    { header: "Amount", name: "amount" }
                ]
            },
            {
                type: "date",
                label: "Issue Date",
                name: "issueDate",
                required: true
            },
            {
                type: "text",
                label: "Issued To",
                name: "issuedTo",
                required: true
            }
        ],

    },
    itemCategorySetup: {
        title: "Add Item Category",
        method: "POST",
        fields: [
            {
                type: "select",
                label: "Category Type",
                name: "categoryTypeId",
                required: true,
                options: [],
                fetchOptionsFrom: "/category/categorytypes",
                optionValueField: "ctid",
                optionTextField: "categoryname",
                optionDataAttributes: {
                    "data-code": "categorycode"
                }
            },
            {
                type: "text",
                label: "Category Name",
                name: "categoryName",
                required: true
            }
        ]
    },
    Supplierform: {
        title: "Company Information",
        fields: [
            {
                type: "select",
                label: "Company Code",
                name: "supplierType",
                options: [
                    { value: "", text: "Select Type" },
                    { value: "SU", text: "Supplier", short: "SU" },
                    { value: "MA", text: "Maintenance", short: "MA" },
                    { value: "SP", text: "Support", short: "SP" },
                    { value: "OR", text: "Others", short: "OR" }
                ],
                required: true
            },
            {
                type: "text",
                label: "Company Name",
                name: "companyName",
                required: true,
                placeholder: "Enter Name"
            },
            {
                type: "text",
                label: "Address",
                name: "address",
                required: true,
                placeholder: "Enter Address"
            },
            {
                type: "tel",
                label: "Phone Number",
                name: "phoneNumber",
                required: true,
                pattern: "^\\d{6,15}(,\\s*\\d{6,15})*$",
                placeholder: "e.g. 9860112233"
            },
            {
                type: "email",
                label: "Email Address",
                name: "email",
                required: true,
                pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$",
                placeholder: "e.g. info@company.com"
            },
            {
                type: "text",
                label: "Contact Person Name",
                name: "contactPersonName",
                required: true,
                placeholder: "Contact Person Name"
            },
            {
                type: "tel",
                label: "Contact Person Phone",
                name: "contactPersonPhoneNumber",
                required: true,
                pattern: "^\\d{6,15}(,\\s*\\d{6,15})*$",
                placeholder: "e.g. 9860112233"
            }
        ]
    },

};