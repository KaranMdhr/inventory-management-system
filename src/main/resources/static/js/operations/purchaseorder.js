window.formConfig = {
    title: "Purchase Order Form",
    method: "POST",
    fields: [
        {
            type: "select",
            label: "Order Type",
            name: "orderType",
            options: [
                {value: "", text: "Select", disabled: true, hidden: true},
                {value: "cash", text: "Cash"},
                {value: "credit", text: "Credit"},
                {value: "bank_transfer", text: "Bank Transfer"},
                {value: "cheque", text: "Cheque"}
            ],

            group: 1,
            class: "ordertype"
        },
        {
            type: "select",
            label: "Supplier",
            name: "supplier",
            options: [
                {value: "", text: "Select", disabled: true, hidden: true}
            ],

            group: 1,
            class: "supplier"
        },
        {
            type: "text",
            label: "Payment Terms",
            name: "paymentTerms",

            group: 1
        },
        {
            type: "radioGroup",
            label: "Purchase Method",
            name: "purchaseMethod",
            options: [
                {value: "tender", text: "Tender"},
                {value: "quotation", text: "Quotation"},
                {value: "directPurchase", text: "Direct Purchase"}
            ],

            group: 1,
            className: "custom-radio-group"
        },
        {
            type: "date",
            label: "Order Date",
            name: "orderDate",
            group: 1
        },
        {
            type: "tagInput",
            label: "Requisition Code",
            name: "requisitionNumbers",
            placeholder: "Enter or select...",
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
                        {value: "keyboard", text: "keyboard"},
                        {value: "mouse", text: "mouse"},
                        {value: "monitor", text: "monitor"},
                    ],

                },
                {
                    type: "number",
                    name: "rate",
                    placeholder: "Rate",
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
                },
                {
                    type: "number",
                    name: "total",
                    placeholder: "Total",
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
            group: 3
        },
        {
            type: "date",
            label: "Delivery Date - BS",
            name: "deliveryDateBS",
            group: 3
        },
        {
            type: "textarea",
            label: "Remarks",
            name: "remarks",
            group: 4
        }
    ],
    buttons: [
        {
            type: "button",
            label: "Add Row",
            position: "table",
            class: "btn btn-dark",
            onclick: "addRowByButton(this)",
            "data-table-id": "purchaseItems"
        },
        {type: "submit", label: "Save", position: "bottom", class: "btn btn-sm btn-warning"},
        {type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary"}
    ],

}


document.addEventListener('DOMContentLoaded', function () {
    const table = document.querySelector('table');

    table.addEventListener('input', function (e) {
        const row = e.target.closest('tr');
        if (!row) return;

        const rateInput = row.querySelector('input[name="rate[]"]');
        const quantityInput = row.querySelector('input[name="quantity[]"]');
        const totalInput = row.querySelector('input[name="total[]"]');

        if (rateInput && quantityInput && totalInput) {
            const rate = parseFloat(rateInput.value) || 0;
            const quantity = parseFloat(quantityInput.value) || 0;
            const total = rate * quantity;
            totalInput.value = total.toFixed(2);
        }
    });
});

