document.addEventListener("DOMContentLoaded", async () => {
    // Retrieve form configuration from the window scope
    const formConfig = window.formConfig;

    // If form configuration is missing, log error and show notification
    if (!formConfig) {
        console.error("Form configuration is missing.");
        showNotification?.({ type: "error", message: "Form configuration is missing.", duration: 4000 });
        return;
    }

    // Instantiate the form renderer
    const formRenderer = new FormRenderer();

    // Attempt to render the form using the configuration
    try {
        await formRenderer.renderFormDefault(formConfig);

    } catch (error) {
        console.error("Error rendering form:", error);
        showNotification?.({ type: "error", message: "Failed to render form.", duration: 4000 });
        return;
    }

    // Helper function to safely get nested values from an object using dot notation paths
    function getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : undefined;
        }, obj);
    }

    // Helper function to get a query parameter value from the URL
    function getQueryParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    // Extract the entity ID from the query parameters
    const id = getQueryParam("id");
    if (!id) {
        console.error("No ID provided in query parameters");
        showNotification?.({ type: "error", message: "Entity ID is missing.", duration: 4000 });
        return;
    }

    // Fetch data for the specified entity and populate form fields
    try {
        const endpoint = formConfig.fetchAPI.replace("{id}", id);
        const data = await ApiService.get(endpoint);

        // Parse address if it exists
        const addressComponents = data.branchAddress ?
            parseBranchAddress(data.branchAddress) :
            { country: '', province: '', city: '', streetAddress: '' };

        formConfig.fields.forEach(field => {
            const selector = `#${formConfig.id} [name="${field.name}"]`;
            const el = document.querySelector(selector);
            if (!el) {
                console.warn(`Element not found for field: ${field.name}`);
                return;
            }

            // Handle address fields
            if (field.name === "country") {
                el.value = addressComponents.country;
                return;
            }
            if (field.name === "province") {
                el.value = addressComponents.province;
                return;
            }
            if (field.name === "city") {
                el.value = addressComponents.city;
                return;
            }
            if (field.name === "address") {
                el.value = addressComponents.streetAddress;
                return;
            }

            // Handle all other fields
            const value = field.valuePath ? getNestedValue(data, field.valuePath) : data[field.name];
            if (value === undefined || value === null) {
                console.warn(`Value not found for field: ${field.name}`);
                return;
            }

            if (field.type === "file") {
                const existingPreview = document.querySelector(`#${formConfig.id} #preview-${field.name}`);
                if (existingPreview) existingPreview.remove();

                if (value) {
                    const img = document.createElement("img");
                    img.id = `preview-${field.name}`;
                    img.src = value;
                    img.alt = "Image Preview";
                    img.style.maxWidth = "200px";
                    img.style.marginBottom = "10px";
                    el.parentNode.insertBefore(img, el);
                }
            }
            else if (field.type === "select") {
                el.value = field.isNumeric ? String(value) : String(value);
                const options = Array.from(el.options).map(opt => opt.value);
                if (!options.includes(String(el.value))) {
                    console.warn(`Value ${el.value} not found in select options for ${field.name}`);
                }
            }
            else {
                el.value = value;
            }
        });

    } catch (err) {
        console.error("Fetch error:", err);
        showNotification?.({ type: "error", message: "Failed to load entity details.", duration: 5000 });
    }

    // Add event listener to the update button for form submission
    const updateBtn = document.getElementById("btn-update");
    if (updateBtn) {
        updateBtn.addEventListener("click", async (e) => {
            e.preventDefault();

            // Detect if any field is a file input (requires FormData)
            const hasFile = formConfig.fields.some(field => field.type === "file");
            const payload = hasFile ? new FormData() : {};

            // Collect and validate input values from the form
            for (const field of formConfig.fields) {
                const el = document.querySelector(`#${formConfig.id} [name="${field.name}"]`);
                if (field.required && (!el || !el.value)) {
                    showNotification?.({ type: "warning", message: `Field "${field.label}" is required.`, duration: 4000 });
                    return;
                }

                if (el && el.value) {
                    if (field.type === "file") {
                        // If file is selected, append to FormData
                        if (el.files && el.files[0]) {
                            payload.append(field.name, el.files[0]);
                        }
                    } else {
                        // Handle normal and numeric inputs
                        const value = field.isNumeric ? parseInt(el.value) : el.value;
                        hasFile ? payload.append(field.name, value) : (payload[field.name] = value);
                    }
                }
            }

            // Display submission payload in the console for debugging
            console.log("Submitting payload:", hasFile ? [...payload.entries()] : payload);

            try {
                // Construct the update API endpoint
                const endpoint = formConfig.updateAPI.replace("{id}", id);
                // Determine appropriate content type for the request
                const contentType = hasFile ? "multipart/form-data" : "application/json";
                // Submit the form via ApiService (method determined by formConfig.method)
                const response = await ApiService[formConfig.method.toLowerCase()](endpoint, payload, contentType);

                showNotification?.({ type: "success", message: response.message || "Update successful", duration: 3000 });

                setTimeout(() => {
                    // Redirect if a redirect URL is specified in the config
                    if (formConfig.redirectURL) {
                        window.location.href = formConfig.redirectURL;
                    }
                }, 3000); // Adjust the delay as needed (3000 ms = 3 seconds)

            }catch (err) {
                console.error("Update failed:", err);
                showNotification?.({ type: "error", message: err.message || "Failed to update entity.", duration: 5000 });
            }
        });
    }
});