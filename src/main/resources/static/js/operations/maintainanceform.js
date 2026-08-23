window.formConfig={
        title: "Maintenance & Support Assignment Form",
        method: "POST",
        fields: [
            {
                type: "text",
                label: "Company Name",
                name: "companyName",
                placeholder: "e.g., Acme Corp",
                group: 1
            },
            {
                section: "Primary Contact",
                type: "text",
                label: "Name",
                name: "contactName",
                group: 2
            },
            {
                type: "email",
                label: "Email",
                name: "contactEmail",
                group: 3
            },
            {
                type: "tel",
                label: "Mobile Number",
                name: "contactPhone",
                placeholder: "9800000000",
                pattern: "[0-9]{10}",
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
                placeholder: "Code repo or ticket portal link",
                group: 6,
                class: "url-class"
            },
            {
                type: "text",
                label: "Product Name",
                name: "productName",
                placeholder: "Enter system or product name",
                group: 7
            },
            {
                type: "textarea",
                label: "Responsibilities / Scope of Work",
                name: "scope",
                placeholder: "Describe tasks and expectations",
                group: 8
            },
            {
                type: "date",
                label: "Date",
                name: "effectiveDate",
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
                    },
                    {
                        type: "select",
                        label: "Unit",
                        name: "durationUnit",
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
}