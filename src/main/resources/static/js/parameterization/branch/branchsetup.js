window.formConfig = {
    title: "Branch Setup",
    method: "POST",
    submitAPI: "/api/branch/setup",
    image: true,
    redirectURL: "/branchdetails",
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
            type: "select",
            label: "Branch Code",
            name: "branchTypeCode",
            required: true,
            group: 1,
            fetchAPI: "/api/branch/types",
            optionLabelKey: "codeName",
            optionValueKey: "code"
        },
        {
            type: "email",
            label: "Email Address:",
            name: "branchEmail",
            required: true,
            placeholder: "e.g. abc@gmail.com",
            group: 1
        },
        {
            type: "text",
            label: "Country:",
            name: "country",
            required: true,
            placeholder: "Enter Country",
            group: 2
        },
        {
            type: "text",
            label: "Province:",
            name: "province",
            required: true,
            placeholder: "Enter Province",
            group: 2
        },
        {
            type: "text",
            label: "City:",
            name: "city",
            required: true,
            placeholder: "Enter City",
            group: 2
        },
        {
            type: "text",
            label: "Address:",
            name: "address",
            required: true,
            placeholder: "Enter Address",
            group: 2
        },
        {
            type: "text",
            label: "Branch Manager:",
            name: "branchManager",
            required: true,
            placeholder: "Enter Branch Manager",
            group: 3
        },
        {
            type: "tel",
            label: "Mobile:",
            name: "branchPhone",
            required: true,
            pattern: "^\\d{6,15}(,\\s*\\d{6,15})*$",
            placeholder: "e.g. 9860112233",
            group: 3
        },
        {
            type: "tel",
            label: "Alternate Mobile:",
            name: "branchAlternatePhone",
            required: false,
            pattern: "^\\d{6,15}(,\\s*\\d{6,15})*$",
            placeholder: "e.g. 9860112233",
            group: 3
        },
        {
            type: "text",
            label: "Contact Person Name:",
            name: "contactPersonName",
            required: false,
            placeholder: "Contact Person Name",
            group: 4
        },
        {
            type: "tel",
            label: "Contact Person Mobile:",
            name: "contactPersonPhone",
            required: false,
            pattern: "^\\d{6,15}(,\\s*\\d{6,15})*$",
            placeholder: "e.g. 9860112233",
            group: 4
        },
        {
            type: "checkbox",
            label: "Status",
            name: "display",
            required: false,
            text: "Active",
            group: 5
        }
    ],
    buttons: [
        { type: "submit", label: "Save", position: "bottom", class: "btn btn-sm btn-warning" },
        { type: "button", label: "Cancel", position: "bottom", redirect: "/", class: "btn btn-secondary" }
    ]
};

// Save the original Branch Type field config from window.formConfig
const originalBranchTypeField = window.formConfig.fields.find(f => f.name === "branchTypeCode");

// Utility to find the Branch Type field config
function getBranchTypeFieldIndex() {
    return window.formConfig.fields.findIndex(f => f.name === "branchTypeCode");
}

// Fetch generate config and update form fields, then render form after 1s delay
fetch('/api/branch/generate/branch-generate')
    .then(res => {
        if (!res.ok) return null;
        return res.json();
    })
    .then(generate => {
        const idx = getBranchTypeFieldIndex();
        if (generate && generate.generate === true && idx !== -1) {
            window.formConfig.fields.splice(idx, 1);
        }
        // Only render the form after fetch and field logic, with 1s delay
        setTimeout(() => {
            if (typeof renderForm === "function") {
                renderForm(window.formConfig);
            }
        }, 1000);
    })
    .catch(() => {
        // On error, ensure Branch Type field is present
        const idx = getBranchTypeFieldIndex();
        if (idx === -1 && originalBranchTypeField) {
            window.formConfig.fields.splice(1, 0, originalBranchTypeField);
        }
        if (typeof renderForm === "function") {
            renderForm(window.formConfig);
        }
    });

// --- Form submission logic ---
function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);

    if (getBranchTypeFieldIndex() !== -1) {
        const branchTypeCode = formData.get("branchTypeCode");
        formData.delete("branchTypeCode");
        formData.append("branchCode", branchTypeCode);
    }

    fetch(window.formConfig.submitAPI, {
        method: window.formConfig.method,
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            // Handle success (redirect, show message, etc.)
            if (window.formConfig.redirectURL) {
                window.location.href = window.formConfig.redirectURL;
            }
        })
        .catch(error => {
            // Handle error (show error message, etc.)
            alert("Error saving branch: " + error);
        });
}

// Attach the handler to your form (replace '#branchForm' with your form's ID)
document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("branchForm");
    if (form) {
        form.addEventListener("submit", handleFormSubmit);
    }
});