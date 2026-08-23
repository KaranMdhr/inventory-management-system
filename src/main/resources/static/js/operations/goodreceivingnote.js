window.formConfig = {
    title: "Good Receiving Note (GRN)",
    id: "goodsReceivingNoteForm",
    method: "POST",
    fetchAPI: "/grs/fetch/grs/{id}",
    submitAPI: "/",
    updateAPI: "/",
    // resetAfterSubmit: true,
    // redirect: "/grs/success",
    fields: [
        {
            type: "text",
            label: "GRN Code",
            name: "grnCode",
            placeholder: "Auto-generated",
            readonly: true,
            group: 1,
        },
        {
            type: "select",
            label: "Company",
            name: "company",
            options: [
                {value: "", text: "Select Company"}
            ],
            group: 1
        },
        {
            type: "date",
            label: "GRN Date",
            name: "grnDate",
            group: 1
        },
        {
            type: "text",
            label: "Purchase Order Code",
            name: "purchaseOrderCode",
            group: 1
        }

    ],

    buttons: [
        {
            type: "button",
            label: "Damage",
            position: "table",
            class: "btn btn-dark",
            id: "damageBtn"
        },
        {
            type: "button",
            label: "Add Row",
            position: "table",
            class: "btn btn-dark",
            onclick: "addRowByButton(this)",
            "data-table-id": "goodReceivingNote"
        },
        {
            type: "submit",
            label: "Save",
            id: "saveBtn",
            position: "bottom",
            class: "btn btn-primary",
        },
        {
            type: "button",
            label: "Cancel",
            position: "bottom",
            class: "btn btn-secondary",
            redirect: "/home"
        },
        {
            type: "button",
            label: "Submit Damage",
            position: "bottom",
            class: "btn btn-warning",
            id: "submitDamageBtn",
            redirect: "/damagedetails"
        }
    ],

    tables: [
        {
            id: "goodReceivingNote",
            name: "goodReceivingNote",
            label: "Good Receiving Note",
            headers: ["S.N.", "Select", "Item Name", "Quantity", "Unit", "Remaining", "Rate","Total", "Action"],
            class: ["", "damage-checkbox", "", "", "", "", "", "", ""],
            fields: [
                {type: "checkbox", name: "damage", id: "damage", class: "damage-checkbox",display: "none" },
                {type: "text", name: "itemName", placeholder: "Item Name" },
                {type: "number", name: "qty", placeholder: "Qty"},
                {type: "number", name: "unit", placeholder: "Unit"},
                {type: "number", name: "remaining", placeholder: "Remaining"},
                {type: "number", name: "rate", placeholder: "Rate"},
                {type: "number", name: "total", placeholder: "Total"},
            ],
            actions: [
                {type: "button", label: "Details", class: "btn btn-sm btn-dark", redirect: "/details"}
            ],
            actionCellClass: "actionbuttons"
        }
    ],
    aftertableFields: [
        {
            type: "checkbox",
            label: "Additional Costs",
            name: "hasAdditionalCosts",
            id: "hasAdditionalCosts",
            class: "additional-costs-checkbox",
            group: 1
        },
        {
            type: "group",
            name: "additionalCostsGroup",
            id: "additionalCostsGroup",
            class: "additional-costs-group",
            visibleWhen: "hasAdditionalCosts",
            group: 2,
            fields: [
                {
                    type: "select",
                    label: "Incoterm",
                    name: "incoterm",
                    options: [
                        {value: "FOB", text: "FOB"},
                        {value: "CFR", text: "CFR / C&F"},
                        {value: "CIF", text: "CIF"}
                    ],
                    required: true,
                    group: 2
                },
                {
                    type: "number",
                    label: "Labour Charge (Rs)",
                    name: "labourcharge",
                    group: 2,
                },
                {
                    type: "number",
                    label: "Transport Charge (Rs)",
                    name: "transportcharge",
                    group: 2,
                },
                {
                    type: "number",
                    label: "Miscellaneous (Rs)",
                    name: "miscellaneous",
                    group: 2,
                },
                {
                    type: "number",
                    label: "Total Invoice Amount (Rs)",
                    name: "totalinvoiceamount",
                    group: 2,
                },

            ]
        },
        {
            type: "textarea",
            label: "Additional Notes",
            name: "additionalNotes",
            required: false,
            group: 3

        }
    ]

}

document.addEventListener("DOMContentLoaded", function () {
    // Step 1: Handle additionalCostsGroup visibility
    function setupAdditionalCosts() {
        const checkbox = document.getElementById('hasAdditionalCosts');
        const groupElement = document.getElementById('additionalCostsGroup');

        if (!checkbox) {
            console.warn("❌ Checkbox with ID 'hasAdditionalCosts' not found in the DOM.");
            return false;
        }
        if (!(checkbox instanceof HTMLInputElement) || checkbox.type !== 'checkbox') {
            console.warn("❌ Element with ID 'hasAdditionalCosts' is not a checkbox:", checkbox.outerHTML);
            return false;
        }
        if (!groupElement) {
            console.warn("❌ Element with ID 'additionalCostsGroup' not found in the DOM.");
            return false;
        }

        // Initial visibility check
        updateGroupVisibility();

        // Remove existing listeners to prevent duplicates
        checkbox.removeEventListener('change', updateGroupVisibility);
        checkbox.addEventListener('change', function (event) {
            const isChecked = event.target.checked;
            console.log(`Checkbox changed. Checked: ${isChecked}`);
            updateGroupVisibility();
        });

        function updateGroupVisibility() {
            const isChecked = checkbox.checked;
            console.log(`Updating visibility. Checkbox checked: ${isChecked}`);
            if (isChecked) {
                groupElement.classList.add('visible');
                console.log("Added 'visible' class to additionalCostsGroup");
            } else {
                groupElement.classList.remove('visible');
                console.log("Removed 'visible' class from additionalCostsGroup");
            }
            console.log(`Current classes on additionalCostsGroup: ${groupElement.className}`);
            console.log(`Computed visibility: ${window.getComputedStyle(groupElement).visibility}`);
            console.log(`Computed max-height: ${window.getComputedStyle(groupElement).maxHeight}`);
            console.log(`Computed opacity: ${window.getComputedStyle(groupElement).opacity}`);
        }

        console.log("✅ Successfully set up additionalCostsGroup visibility logic.");
        return true;
    }

    // Try setting up immediately
    if (!setupAdditionalCosts()) {
        console.log("Observing DOM for #hasAdditionalCosts and #additionalCostsGroup...");
        const observer = new MutationObserver(function () {
            if (setupAdditionalCosts()) {
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Step 2: Handle damage-checkbox visibility
    document.querySelectorAll('.damage-checkbox, .damage-checkbox input').forEach(function (el) {
        el.style.display = 'none';
    });
    const selectHeader = document.querySelector('#goodReceivingNote thead tr th:nth-child(2)');
    if (selectHeader) {
        selectHeader.style.display = 'none';
    } else {
        console.warn("❌ Select header (#goodReceivingNote thead tr th:nth-child(2)) not found.");
    }

    window.isDamageVisible = false;
    const damageBtn = document.getElementById('damageBtn');
    if (damageBtn) {
        damageBtn.addEventListener('click', function () {
            window.isDamageVisible = !window.isDamageVisible;
            const displayStyle = window.isDamageVisible ? 'table-cell' : 'none';
            const inputDisplayStyle = window.isDamageVisible ? '' : 'none';
            if (selectHeader) {
                selectHeader.style.display = displayStyle;
            }
            document.querySelectorAll('.damage-checkbox').forEach(function (el) {
                el.style.display = displayStyle;
            });
            document.querySelectorAll('.damage-checkbox input').forEach(function (el) {
                el.style.display = inputDisplayStyle;
            });
            console.log(`Damage button clicked. isDamageVisible: ${window.isDamageVisible}`);
        });
    } else {
        console.warn("❌ Damage button with ID 'damageBtn' not found.");
    }
});













