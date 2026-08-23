window.formConfig = {
    title: "Edit Category",
    id: "editcategoryform",
    updateAPI: "/api/category/category-update/{id}",
    fetchAPI: "/api/category/category/{id}",
    method: "PUT",
    redirectURL: "/categorydetails",
    fields: [
        {
            type: "select",
            label: "Category Type",
            name: "categoryTypeId",
            group: 1,
            fetchAPI: "/api/category/categorytypes",
            optionLabelKey: "categoryname",
            optionValueKey: "ctid",
            valuePath: "categoryTypeId.ctid",
            isNumeric: true
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
        {
            type: "submit",
            label: "Update",
            id: "btn-update",
            position: "bottom",
            class: "btn btn-sm btn-warning",
        },
        {
            type: "button",
            label: "Cancel",
            id: "btn-cancel",
            position: "bottom",
            class: "btn btn-secondary",
        }
    ]
};
/*

function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => {
        return current && current[key] !== undefined ? current[key] : undefined;
    }, obj);
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const id = getQueryParam("id");

(async () => {
    // Validate ID
    if (!id) {
        console.error("No ID provided in query parameters");
        alert("Entity ID is missing.");
        return;
    }

    // Render form and ensure select options are loaded
    await renderFormDefault(formConfig); // Assumes this populates select options

    // Populate form with existing data
    try {
        const endpoint = formConfig.fetchAPI.replace("{id}", id);
        const data = await ApiService.get(endpoint);
        console.log("Fetched data:", data); // Debug: Log fetched data

        formConfig.fields.forEach(field => {
            const selector = field.type === "file"
                ? `#${formConfig.id} [name="${field.name}"]`
                : `#${formConfig.id} [name="${field.name}"]`;
            const el = document.querySelector(selector);
            if (!el) {
                console.warn(`Element not found for field: ${field.name}`);
                return;
            }

            const value = field.valuePath
                ? getNestedValue(data, field.valuePath)
                : data[field.name];

            if (value !== undefined) {
                if (field.type === "file") {
                    // Remove existing preview if any
                    const existingPreview = document.querySelector(`#${formConfig.id} #preview-${field.name}`);
                    if (existingPreview) existingPreview.remove();

                    // Create and insert image preview before file input
                    if (value) {
                        const img = document.createElement("img");
                        img.id = `preview-${field.name}`;
                        img.src = value;
                        img.alt = "Image Preview";
                        img.style.maxWidth = "200px";
                        img.style.marginBottom = "10px";
                        el.parentNode.insertBefore(img, el);
                        console.log(`Added image preview for ${field.name}: ${value}`);
                    }
                } else if (field.type === "select") {
                    // Ensure value matches option type
                    el.value = field.isNumeric ? String(value) : String(value);
                    const options = Array.from(el.options).map(opt => opt.value);
                    if (!options.includes(String(el.value))) {
                        console.warn(`Value ${el.value} not found in select options for ${field.name}`, options);
                    }
                } else {
                    el.value = value;
                }
            } else {
                console.warn(`Value not found for field: ${field.name}, path: ${field.valuePath || field.name}`);
            }
        });
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Failed to load entity details.");
    }

    const updateBtn = document.getElementById("btn-update");
    if (updateBtn) {
        updateBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            // Check if any fields are file inputs
            const hasFile = formConfig.fields.some(field => field.type === "file");
            const payload = hasFile ? new FormData() : {};

            // Validate and build payload
            for (const field of formConfig.fields) {
                const el = document.querySelector(`#${formConfig.id} [name="${field.name}"]`);
                if (field.required && (!el || !el.value)) {
                    alert(`Field ${field.label} is required`);
                    return;
                }
                if (el && el.value) {
                    if (field.type === "file") {
                        if (el.files && el.files[0]) {
                            payload.append(field.name, el.files[0]);
                        }
                    } else {
                        const value = field.isNumeric ? parseInt(el.value) : el.value;
                        hasFile ? payload.append(field.name, value) : (payload[field.name] = value);
                    }
                }
            }

            console.log("Submitting payload:", hasFile ? [...payload.entries()] : payload); // Debug: Log payload

            try {
                const endpoint = formConfig.submitAPI.replace("{id}", id);
                const contentType = hasFile ? "multipart/form-data" : "application/json";
                const response = await ApiService[formConfig.method.toLowerCase()](endpoint, payload, contentType);
                alert(response.message || response || "Update successful");
                window.location.href = formConfig.redirectURL || "/";
            } catch (err) {
                console.error("Update failed:", err);
                alert(err.message || "Failed to update entity.");
            }
        });
    } else {
        console.warn("Update button not found.");
    }
})();
*/
