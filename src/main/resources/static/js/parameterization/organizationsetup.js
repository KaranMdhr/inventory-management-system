window.formConfig = {
    title: "Organization Setup",
    method: "POST",
    id: "companysetupform",
    image: true,
    updateAPI: "/organization/update-organization",
    fetchAPI: "/organization/get-organization", // Fixed
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
            placeholder: "e.g. 9860112233",
            group: 1
        },
        {
            type: "tel",
            label: "Alternate Mobile:",
            name: "alternateMobile",
            required: false,
            placeholder: "e.g. 9812345678",
            group: 2
        },
        {
            type: "email",
            label: "Email Address:",
            name: "email",
            required: true,
            placeholder: "e.g. info@company.com",
            group: 2
        },
        {
            type: "number",
            label: "Registration No:",
            name: "registrationNumber",
            required: false,
            placeholder: "Enter Registration Number",
            group: 2
        },
        {
            type: "number",
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
        {
            type: "submit",
            label: "Save",
            id: "btn-save",
            position: "bottom",
            class: "btn btn-primary",
            visibleWhen: "new"
        },
        {
            type: "submit",
            label: "Update",
            id: "btn-update",
            position: "bottom",
            class: "btn btn-warning",
            visibleWhen: "existing"
        },
        {
            type: "button",
            label: "Cancel",
            id: "btn-cancel",
            position: "bottom",
            class: "btn btn-secondary",
            visibleWhen: "always",
            action: () => { window.location.href = "/"; }
        }
    ]
};

const formState = {
    hasExistingData: false,
    existingId: null
};

async function submitForm(e) {
    e.preventDefault();
    const form = document.getElementById(formConfig.id);
    const formData = new FormData(form);
    if (formState.existingId) formData.append("id", formState.existingId);

    const endpoint = formState.hasExistingData ? formConfig.updateAPI : formConfig.submitAPI;
    const method = formState.hasExistingData ? "PUT" : "POST";

    try {
        let result;
        if (method === "POST") {
            result = await ApiService.post(endpoint, formData, "multipart/form-data");
        } else {
            result = await ApiService.put(endpoint, formData, "multipart/form-data");
        }

        if (typeof result === "string") {
            console.warn(`Received text/plain response: ${result}`);
            const potentialId = result.trim();
            if (/^[a-zA-Z0-9-]+$/.test(potentialId) && !formState.hasExistingData) {
                result = { id: potentialId };
                console.log(`Extracted ID from text response: ${potentialId}`);
            }
        }

        alert(`${formState.hasExistingData ? "Updated" : "Created"} successfully!`);

        if (result && result.id && !formState.hasExistingData) {
            formState.hasExistingData = true;
            formState.existingId = result.id;
            toggleButtons(formConfig, "existing");
        }
    } catch (err) {
        console.error("Submission error:", err);
        let userMessage = "Error submitting form:";
        if (err instanceof TypeError) {
            userMessage += "\nNetwork error - please check your connection or server availability.";
        } else if (err.message) {
            userMessage += `\n${err.message}`;
        } else {
            userMessage += "\nAn unexpected error occurred.";
        }
        alert(userMessage);
    }
}

function existingdata(formElement, data) {
    Object.entries(data).forEach(([key, value]) => {
        const input = formElement.querySelector(`[name="${key}"]`);
        if (input) {
            if (input.type === "checkbox") {
                input.checked = value;
            } else if (input.type === "radio") {
                const radio = formElement.querySelector(`[name="${key}"][value="${value}"]`);
                if (radio) radio.checked = true;
                else console.warn(`Radio button with value "${value}" not found for field: ${key}`);
            } else if (input.type !== "file") { // Skip file inputs
                input.value = value;
            }
        } else {
            console.warn(`Element not found for field: ${key}`);
        }
    });
    return data;
}

document.addEventListener("DOMContentLoaded", async () => {
    const form = document.getElementById(formConfig.id);
    const logoPreview = document.getElementById("logoPreview");

    if (typeof renderForm === "function") {
        renderForm(formConfig);
    }

    try {
        const data = await ApiService.get(formConfig.fetchAPI);
        if (typeof data === "string") {

        } else if (data && data.id) {
            formState.hasExistingData = true;
            formState.existingId = data.id;

            // Populate form fields
            existingdata(form, data);

            // Handle logo preview
            if (data.logo && logoPreview) {
                logoPreview.src = data.logo;
                logoPreview.style.display = "block";
            }
        }
    } catch (err) {
        console.error("Failed to fetch organization data:", err);
        alert(`Error fetching data: ${err.message || "An unexpected error occurred."}`);
    }

    toggleButtons(formConfig, formState.hasExistingData ? "existing" : "new");

    const saveButton = document.getElementById("btn-save");
    const updateButton = document.getElementById("btn-update");
    const cancelButton = document.getElementById("btn-cancel");

    if (saveButton) saveButton.addEventListener("click", submitForm);
    if (updateButton) updateButton.addEventListener("click", submitForm);
    if (cancelButton) cancelButton.addEventListener("click", () => window.location.href = "/");
});

function toggleButtons(config, mode) {
    config.buttons.forEach(btn => {
        const el = document.getElementById(btn.id);
        if (!el) return;

        const shouldShow =
            btn.visibleWhen === "always" ||
            (btn.visibleWhen === "new" && mode === "new") ||
            (btn.visibleWhen === "existing" && mode === "existing");

        el.style.display = shouldShow ? "inline-block" : "none";
    });
}