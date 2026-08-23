window.formConfig = {
    title: "Requisition Slip",
    method: "POST",
    submitAPI: "/",
    fields: [
        {
            type: "text",
            label: "Requisition No.",
            name: "requisitionNo",
            required: true,
            pattern: "^[A-Z]{3}-\\d{4}$", // Example: ABC-1234
            patternError: "Format must be AAA-1234",
            group: 1
        },
        {
            type: "date",
            label: "Date",
            name: "date",
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

            group: 1
        }
    ],
    tables: [
        {
            name: "requisitionItems",
            id: "requisitionItems",
            label: "Requisition Items",
            headers: [
                { label: "S.N." },
                { label: "Item Name", required: true },
                { label: "Qty", required: true },
                { label: "Unit", required: true },
                { label: "Remarks" },
                { label: "Action" }
            ],
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
}
