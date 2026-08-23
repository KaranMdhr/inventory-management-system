function setupFieldValidation(field, formElement, validator, form) {
    if (field.type === "checkbox") {
        const fieldElement = formElement.querySelector(`[name="${field.name}"]`);
        if (!fieldElement) return;

        fieldElement.checked = form[field.name] || false;

        fieldElement.addEventListener('change', (e) => {
            form[field.name] = e.target.checked;
        });

    } else if (field.type === "checkbox-group") {
        const checkboxes = formElement.querySelectorAll(`input[name="${field.name}"]`);
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
            });
        });

    } else if (field.type === "radioGroup") {
        const radios = formElement.querySelectorAll(`input[name="${field.name}"]`);
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                form[field.name] = e.target.value;
            });
        });

    } else {
        const fieldElement = formElement.querySelector(`[name="${field.name}"]`);
        if (!fieldElement) return;

        fieldElement.value = form[field.name] || "";

        fieldElement.addEventListener('input', (e) => {
            form[field.name] = e.target.value;

            if (field.type === "select") {
                const selectedOption = e.target.selectedOptions[0];
                if (selectedOption?.dataset.short) {
                    form.code = selectedOption.dataset.short + (form.code?.slice(2) || "");
                    const codeInput = formElement.querySelector("#code");
                    if (codeInput) codeInput.value = form.code;
                }
            }

        });
    }
}

function generateButtonHTML(btn) {
    const redirectAttr = btn.redirect ? `data-redirect="${btn.redirect}"` : "";
    const onclickAttr = btn.onclick ? `onclick="${btn.onclick}"` : "";
    const dataAttrs = Object.entries(btn)
        .filter(([key]) => key.startsWith("data-"))
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ");
    return `<button type="${btn.type}" class="${btn.class || ''}" id="${btn.id || ''}" ${onclickAttr} ${redirectAttr} ${dataAttrs}>${btn.label}</button>`;
}

async function renderFormDefault() {
    const container = document.getElementById("formContainer");
    if (!container || !formConfig) {
        container.innerHTML = "<p>Error: Form data missing.</p>";
        return;
    }

    const form = {};
    const buttonsByPosition = {
        top: [],
        table: [],
        bottom: [],
        inline: {}
    };

    (formConfig.buttons || []).forEach(btn => {
        if (btn.position) {
            buttonsByPosition[btn.position].push(btn);
        } else if (btn.positionGroup) {
            if (!buttonsByPosition.inline[btn.positionGroup]) {
                buttonsByPosition.inline[btn.positionGroup] = [];
            }
            buttonsByPosition.inline[btn.positionGroup].push(btn);
        } else {
            buttonsByPosition.bottom.push(btn);
        }
    });

    await Promise.all((formConfig.fields || []).map(async (field) => {
        if (field.type === "select" && field.fetchAPI) {
            try {
                const res = await fetch(field.fetchAPI);
                if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
                const data = await res.json();
                field.options = data.map(item => ({
                    value: item[field.optionValueKey || "value"],
                    text: item[field.optionLabelKey || "text"],
                    short: item[field.optionShortKey || "short"] || ""
                }));
            } catch (err) {
                console.error(`❌ Error fetching options for "${field.name}":`, err);
                field.options = [{ value: "", text: "⚠ Failed to load options" }];
            }
        }
    }));

    let formHTML = `<div class="form-container">
        <h2 style="text-align:center;">${formConfig.title}</h2>
        <form method="${formConfig.method}" enctype="multipart/form-data" id="${formConfig.id}">`;

    if (buttonsByPosition.top.length > 0) {
        formHTML += `<div class="top-buttons">${buttonsByPosition.top.map(generateButtonHTML).join("")}</div>`;
    }

    const groupedFields = groupFieldsByRow(formConfig.fields);
    formHTML += groupedFields.map((rowFields, rowIndex) => {
        const group = rowFields[0]?.group || rowIndex + 1;
        let rowHTML = rowFields.map(field => generateFieldHTML(field, form)).join("");
        const groupButtons = buttonsByPosition.inline[group] || [];
        rowHTML += groupButtons.map(generateButtonHTML).join("");
        return `<div class="form-row">${rowHTML}</div>`;
    }).join("");

    if (buttonsByPosition.table.length > 0) {
        formHTML += `<div class="table-buttons">${buttonsByPosition.table.map(generateButtonHTML).join("")}</div>`;
    }

    if (formConfig.tables) {
        formConfig.tables.forEach(table => {
            const actionCellClass = table.actionCellClass || "action-buttons";
            formHTML += `
                <div class="table-responsive">
                    <table id="${table.name}">
                        <thead>
                            <tr>
                                ${table.headers.map((h, index) => {
                // Support both string and object header
                let label = typeof h === "string" ? h : h.label;
                let required = typeof h === "object" && h.required;
                const headerClass = table.class && table.class[index] ? table.class[index] : '';
                return `<th class="${headerClass}">${label}${required ? ' <span class="required-star">*</span>' : ''}</th>`;
            }).join('')}
                            </tr>
                        </thead>
                        <tbody>${generateTableRowHTML(table.fields, 1, actionCellClass, table.actions || [], true)}</tbody>
                    </table>
                </div>`;
        });
    }

    if (formConfig.aftertableFields) {
        formHTML += groupFieldsByRow(formConfig.aftertableFields).map(rowFields =>
            `<div class="form-row">${rowFields.map(field => generateFieldHTML(field, form)).join("")}</div>`
        ).join("");
    }

    if (buttonsByPosition.bottom.length > 0) {
        formHTML += `<div class="bottom-buttons">${buttonsByPosition.bottom.map(generateButtonHTML).join("")}</div>`;
    }

    formHTML += `</form></div>`;
    container.innerHTML = formHTML;

    const allFields = [...(formConfig.fields || []), ...(formConfig.aftertableFields || [])];

    const setupFieldsRecursively = (fields) => {
        fields.forEach(field => {
            if (field.type === "group" && Array.isArray(field.fields)) {
                setupFieldsRecursively(field.fields);
            } else {
                setupFieldValidation(field, container, null, form);
            }
        });
    };

    setupFieldsRecursively(allFields);

    const formElement = document.getElementById(formConfig.id);
    formElement.onsubmit = async (e) => {
        e.preventDefault();

        let hasError = false;

        // After form is rendered and allFields/table fields are available
        function setupRequiredFieldListeners() {

            const allFields = [...(formConfig.fields || []), ...(formConfig.aftertableFields || [])];
            allFields.forEach(field => {
                const input = formElement.querySelector(`[name="${field.name}"]`);
                const errorDiv = formElement.querySelector(`#${field.name}Group .field-error`);
                let isEmpty = false;
                let patternInvalid = false;
                if (field.required) {
                    const errorDiv = formElement.querySelector(`#${field.name}Group .field-error`);
                    if (field.type === "radioGroup") {
                        const radios = formElement.querySelectorAll(`input[name="${field.name}"]`);
                        const checked = formElement.querySelector(`input[name="${field.name}"]:checked`);
                        if (!checked) {
                            radios.forEach(r => r.classList.add('required-field'));
                            if (errorDiv) {
                                errorDiv.textContent = "This field is required";
                                errorDiv.style.display = 'block';
                            }
                            if (!hasError) {
                                showNotification({
                                    type: "warning",
                                    message: `"${field.label}" is required.`,
                                    duration: 3000
                                });
                                radios[0].focus();
                            }
                            hasError = true;
                        } else {
                            radios.forEach(r => r.classList.remove('required-field'));
                            if (errorDiv) errorDiv.style.display = 'none';
                        }
                    } else if (field.type === "checkbox-group") {
                        const checked = formElement.querySelectorAll(`input[name="${field.name}"]:checked`);
                        const checkboxes = formElement.querySelectorAll(`input[name="${field.name}"]`);
                        if (checked.length === 0) {
                            checkboxes.forEach(cb => cb.classList.add('required-field'));
                            if (errorDiv) {
                                errorDiv.textContent = "This field is required";
                                errorDiv.style.display = 'block';
                            }
                            if (!hasError) {
                                showNotification({
                                    type: "warning",
                                    message: `"${field.label}" is required.`,
                                    duration: 3000
                                });
                                if (checkboxes[0]) checkboxes[0].focus();
                            }
                            hasError = true;
                        } else {
                            checkboxes.forEach(cb => cb.classList.remove('required-field'));
                            if (errorDiv) errorDiv.style.display = 'none';
                        }
                    } else {
                        isEmpty = !input.value.trim();
                        if (isEmpty) {
                            input.classList.add('required-field');
                            if (errorDiv) {
                                errorDiv.textContent = "This field is required";
                                errorDiv.style.display = 'block';
                            }
                            if (!hasError) {
                                showNotification({
                                    type: "warning",
                                    message: `"${field.label || field.placeholder || field.name}" is required.`,
                                    duration: 3000
                                });
                                input.focus();
                            }
                            hasError = true;
                        }
                    }
                }

                // Pattern validation
                if (field.pattern && field.pattern !== "none" && input.value.trim()) {
                    const regex = new RegExp(field.pattern);
                    if (!regex.test(input.value.trim())) {
                        patternInvalid = true;
                        input.classList.add('required-field');
                        if (errorDiv) {
                            errorDiv.textContent = field.patternError || "Invalid format";
                            errorDiv.style.display = 'block';
                        }
                        if (!hasError) {
                            showNotification({
                                type: "warning",
                                message: field.patternError || `Invalid format for "${field.label}"`,
                                duration: 3000
                            });
                            input.focus();
                        }
                        hasError = true;
                    }
                }

                // Remove error if valid
                if (!isEmpty && !patternInvalid) {
                    input.classList.remove('required-field');
                    if (errorDiv) errorDiv.style.display = 'none';
                }
            });


            function setupLiveRequiredFieldListeners() {

                const allFields = [...(formConfig.fields || []), ...(formConfig.aftertableFields || [])];
                allFields.forEach(field => {
                    if (field.required && field.type === "radioGroup") {
                        const radios = formElement.querySelectorAll(`input[name="${field.name}"]`);
                        radios.forEach(radio => {
                            radio.addEventListener('change', () => {
                                radios.forEach(r => r.classList.remove('required-field'));
                                const errorDiv = formElement.querySelector(`#${field.name}Group .field-error`);
                                if (errorDiv) errorDiv.style.display = 'none';
                            });
                        });
                    }
                });

                if (formConfig.tables) {
                    formConfig.tables.forEach(table => {
                        const tableElement = document.getElementById(table.name);
                        if (tableElement) {
                            const rows = tableElement.querySelectorAll('tbody tr');
                            rows.forEach(row => {
                                table.fields.forEach((field, fieldIdx) => {
                                    if (field.required) {
                                        const cell = row.cells[fieldIdx + 1];
                                        if (cell) {
                                            const input = cell.querySelector('input, select, textarea');
                                            const errorDiv = cell.querySelector('.field-error');
                                            if (input) {
                                                input.addEventListener('input', () => {
                                                    if (input.value.trim()) {
                                                        input.classList.remove('required-field');
                                                        if (errorDiv) errorDiv.style.display = 'none';
                                                    }
                                                });
                                                input.addEventListener('change', () => {
                                                    if (input.value.trim()) {
                                                        input.classList.remove('required-field');
                                                        if (errorDiv) errorDiv.style.display = 'none';
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            });
                        }
                    });
                }
            }

            // Call this after rendering the form and table rows
            setupLiveRequiredFieldListeners();
        }
        setupRequiredFieldListeners();
        if (hasError) return; // Prevent submit if any required field is empty

        const formData = new FormData(formElement);
        const data = {};

        function processField(field) {
            if (field.type === "group" && Array.isArray(field.fields)) {
                field.fields.forEach(processField);
                return;
            }

            if (field.type === "checkbox") {
                const checkboxElement = formElement.querySelector(`[name="${field.name}"]`);
                data[field.name] = checkboxElement?.checked || false;
            } else if (field.type === "checkbox-group") {
                const checkedBoxes = formElement.querySelectorAll(`input[name="${field.name}"]:checked`);
                data[field.name] = Array.from(checkedBoxes).map(cb => cb.value);
            } else if (field.type === "radioGroup") {
                const checkedRadio = formElement.querySelector(`input[name="${field.name}"]:checked`);
                data[field.name] = checkedRadio ? checkedRadio.value : '';
            } else {
                data[field.name] = formData.get(field.name);
            }
        }

        allFields.forEach(processField);

        if (formConfig.tables) {
            formConfig.tables.forEach(table => {
                const tableElement = document.getElementById(table.name);
                if (tableElement) {
                    const tableData = [];
                    const rows = tableElement.querySelectorAll('tbody tr');
                    rows.forEach(row => {
                        const rowData = {};
                        table.fields.forEach((field, index) => {
                            const cell = row.cells[index + 1];
                            const input = cell.querySelector('input, select, textarea');
                            if (input) {
                                rowData[field.name] = input.type === 'checkbox' ? input.checked : input.value;
                            }
                        });
                        if (Object.values(rowData).some(val => val !== '' && val !== false && val !== null && val !== undefined)) {
                            tableData.push(rowData);
                        }
                    });
                    data[table.name] = tableData;
                }
            });
        }

        // Handle image upload vs regular form submission
        if (formConfig.image) {
            await insertdata(formElement, formConfig);
            return;
        }

        try {
            const response = await fetch(formConfig.submitAPI, {
                method: formConfig.method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            let result;
            const isJson = response.headers.get("content-type")?.includes("application/json");
            if (isJson) {
                result = await response.json();
            } else {
                result = await response.text();
            }

            if (response.ok) {
                if (typeof showNotification === 'function') {
                    showNotification({
                        type: "success",
                        message: result || "Saved successfully!",
                        duration: 3000
                    });
                } else {
                    alert(result || "Saved successfully!");
                }

                if (formConfig.resetAfterSubmit) {
                    formElement.reset();
                    Object.keys(data).forEach(key => delete form[key]);
                }
            } else {
                console.log('Submission data:', data);
                console.log('Response:', response);
                console.log('Result:', result);
                const errorMessage = result?.message || result || "Unknown error";
                if (typeof showNotification === 'function') {
                    showNotification({
                        type: "error",
                        message: `Save failed: ${errorMessage}`,
                        duration: 5000
                    });
                } else {
                    alert(`Save failed: ${errorMessage}`);
                }
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            if (typeof showNotification === 'function') {
                showNotification({
                    type: "error",
                    message: "An error occurred while saving. Please try again.",
                    duration: 5000
                });
            } else {
                alert("An error occurred while saving. Please try again.");
            }
        }
    };

    allFields.forEach(field => {
        const errorDiv = formElement.querySelector(`#${field.name}Group .field-error`);

        // For text, select, textarea, etc.
        const input = formElement.querySelector(`[name="${field.name}"]`);
        if (["text", "email", "tel", "number", "select", "textarea"].includes(field.type) && input) {
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.classList.remove('required-field');
                    if (errorDiv) errorDiv.style.display = 'none';
                }
            });
            input.addEventListener('change', () => {
                if (input.value.trim()) {
                    input.classList.remove('required-field');
                    if (errorDiv) errorDiv.style.display = 'none';
                }
            });
        }

        // For checkbox-group
        if (field.type === "checkbox-group") {
            const checkboxes = formElement.querySelectorAll(`input[name="${field.name}"]`);
            checkboxes.forEach(cb => {
                cb.addEventListener('change', () => {
                    const checked = formElement.querySelectorAll(`input[name="${field.name}"]:checked`);
                    if (checked.length > 0) {
                        checkboxes.forEach(c => c.classList.remove('required-field'));
                        if (errorDiv) {
                            errorDiv.textContent = "";
                            errorDiv.style.display = 'none';
                        }
                    }
                });
            });
        }

        // For radioGroup
        if (field.type === "radioGroup") {
            const radios = formElement.querySelectorAll(`input[name="${field.name}"]`);
            radios.forEach(radio => {
                radio.addEventListener('change', () => {
                    radios.forEach(r => r.classList.remove('required-field'));
                    if (errorDiv) {
                        errorDiv.textContent = "";
                        errorDiv.style.display = 'none';
                    }
                });
            });
        }
    });
}

function generateFieldHTML(field, form, viewOnly = false) {
    const requiredMark = field.required ? '<span class="required-star">*</span>' : '';
    const labelHTML = field.label
        ? `<label for="${field.name}" class="form-label${field.required ? ' required-label' : ''}">${field.label}${requiredMark}</label>`
        : "";

    if (field.type === "group" && Array.isArray(field.fields)) {
        const groupClass = field.class ? ` ${field.class}` : "";
        const groupFieldsClass = field.groupFieldsClass ? ` ${field.groupFieldsClass}` : "";
        let groupHTML = `<div class="form-group${groupClass} custom-labels" ${field.methodVisibleFor ? `data-method-visible="${field.methodVisibleFor.join(',')}"` : ""}>`;
        if (field.label) {
            groupHTML += `<label class="group-label">${field.label}</label>`;
        }
        groupHTML += `<div class="group-fields${groupFieldsClass}">`;
        groupFieldsByRow(field.fields).forEach(rowFields => {
            groupHTML += `<div class="form-row">${rowFields.map(subField => generateFieldHTML(subField, form, viewOnly)).join("")}</div>`;
        });
        groupHTML += `</div></div>`;
        return groupHTML;
    }

    if (field.type === "checkbox-group" && Array.isArray(field.options)) {
        const groupId = `${field.name}Group`;
        let valueArray = Array.isArray(form[field.name]) ? form[field.name] : [];
        return `
            <div class="form-group checkbox-group-field" id="${field.name}Group" ${field.methodVisibleFor ? `data-method-visible="${field.methodVisibleFor.join(',')}"` : ""}>
                ${labelHTML}
                <div class="checkbox-group-options" id="${groupId}">
                    ${field.options.map(option => `
                        <label>
                            <input 
                                type="checkbox" 
                                name="${field.name}" 
                                value="${option.value}"
                                ${valueArray.includes(option.value) ? 'checked' : ''}
                                ${viewOnly ? 'disabled' : ''}
                            > ${option.text}
                        </label>
                    `).join("")}
                </div>
                <div class="field-error" style="display:none;"></div>
            </div>
        `;
    }

    if (field.type === "tagInput") {
        return `
        <div class="form-group${field.class ? ' ' + field.class : ''}" ${field.methodVisibleFor ? `data-method-visible="${field.methodVisibleFor.join(',')}"` : ""}>
            ${labelHTML}
            <div class="tag-input-container" id="${field.name}Container">
                <ul id="${field.name}List" class="tag-list"></ul>
                <input type="text" id="${field.name}Input" 
                    placeholder="${field.placeholder || ''}" 
                    list="${field.name}Datalist" 
                    autocomplete="off" 
                    class="tag-input-field" 
                    ${viewOnly ? 'readonly' : ''}>
                <div id="${field.name}Suggestions" class="suggestion-list" style="display:none;"></div>
                <datalist id="${field.name}Datalist"></datalist>
            </div>
            <input type="hidden" name="${field.name}" id="${field.name}">
        </div>
    `;
    }


    let inputHTML = "";
    if (field.type === "number") {
        inputHTML = `<input type="number" name="${field.name}" id="${field.name}"
            class="form-control" 
            ${field.readonly ? "readonly" : ""}
            ${field.min !== undefined ? ` min="${field.min}"` : ""}
            ${field.max !== undefined ? ` max="${field.max}"` : ""}
            ${field.style ? ` style="${field.style}"` : ""}
            value="${form[field.name] || ""}" 
            placeholder="${field.placeholder || ""}"/>`;
    } else if (field.type === "select") {
        inputHTML = `<select name="${field.name}" id="${field.name}" 
            class="form-control ${field.class || ""}"
            ${viewOnly ? ' disabled' : ''}>
            <option value="" disabled selected>Select ${field.label}</option>
            ${(field.options || []).map(opt =>
            `<option value="${opt.value}" data-short="${opt.short || ""}">${opt.text}</option>`
        ).join("")}
        </select>`;
    } else if (field.type === "checkbox") {
        inputHTML = `<div style="display:flex;align-items:center;gap:5px;">
            <input type="checkbox" name="${field.name}" id="${field.name}" 
                class="form-check-input"
                ${viewOnly ? ' disabled' : ''}>
            <span>${field.text || ""}</span>
        </div>`;
    } else if (field.type === "radioGroup") {
        inputHTML = `<div class="radio-group${field.class ? ' ' + field.class : ''}">
            ${field.options.map(option => `
                <input type="radio" id="${field.name}_${option.value}" name="${field.name}" 
                    value="${option.value}" ${viewOnly ? ' disabled' : ''}>
                <label for="${field.name}_${option.value}">${option.text}</label>
            `).join("")}
        </div>`;
    } else if (field.type === "file") {
        return `
            <div class="form-group${field.class ? ' ' + field.class : ''}" ${field.methodVisibleFor ? `data-method-visible="${field.methodVisibleFor.join(',')}"` : ""}>
                ${labelHTML}
                <input 
                    type="file" 
                    name="${field.name}" 
                    id="${field.name}Input" 
                    class="form-control" 
                    placeholder="${field.placeholder || ''}" 
                    accept="${field.accept || 'image/*'}"
                    ${viewOnly ? 'disabled' : ''}>
                <img 
                    id="${field.name}Preview" 
                    style="display:none;max-width:150px;margin-top:10px;" 
                    alt="Image Preview">
            </div>
        `;
    } else if (field.type === "textarea") {
        inputHTML = `<textarea id="${field.name}" name="${field.name}" 
            class="form-control ${field.class || ""}" 
            placeholder="${field.placeholder || ""}" 
            ${viewOnly ? ' readonly' : ''}
            ${field.rows ? ` rows="${field.rows}"` : ''}>${form[field.name] || ""}</textarea>`;
    } else {
        inputHTML = `<input type="${field.type || "text"}" name="${field.name}" id="${field.name}"
        class="form-control ${field.class || ""}" 
        ${field.readonly ? "readonly" : ""}
        ${field.min !== undefined ? ` min="${field.min}"` : ""}
        ${field.max !== undefined ? ` max="${field.max}"` : ""}
        value="${form[field.name] || ""}" 
        placeholder="${field.placeholder || ""}"/>`;
    }

    return `<div class="form-group${field.class ? ' ' + field.class : ''}" id="${field.name}Group" ${field.methodVisibleFor ? `data-method-visible="${field.methodVisibleFor.join(',')}"` : ""}>
    <label class="form-label${field.required ? ' required-label' : ''}">
        ${field.label || ""}
        ${field.required ? '<span class="required-star">*</span>' : ''}
    </label>
    ${inputHTML}
    <div class="field-error" style="display:none;"></div>
</div>`;
}

function generateTableRowHTML(fields, index, actionCellClass = "action-buttons", actions = [], showRemove = true) {
    const fieldCells = fields.map(field => `<td>${generateInputHTML(field)}</td>`).join("");
    const actionButtons = actions.map(action =>
        `<button type="button"
                 class="${action.class || 'btn btn-sm btn-secondary'}"
                 ${action.redirect ? `data-redirect="${action.redirect}"` : ""}
                 ${action.onclick ? `onclick="${action.onclick}"` : ""}>
             ${action.label}
         </button>`
    ).join("");
    const removeBtnHTML = `<button type="button"
                                 class="btn btn-sm btn-danger remove-row ms-1"
                                 style="${showRemove ? '' : 'display:none;'}">
                             Remove
                         </button>`;
    return `
        <tr>
            <td>${index}</td>
            ${fieldCells}
            <td class="${actionCellClass}">
                ${actionButtons}${removeBtnHTML}
            </td>
        </tr>`;
}

function generateInputHTML(field) {
    switch (field.type) {
        case 'select':
            return `
                <select name="${field.name}" 
                        class="${field.class || ""}">
                    ${(field.options || []).map(option => `
                        <option value="${option.value}" 
                                data-short="${option.short || ""}">
                            ${option.text}
                        </option>`).join("")}
                </select>
            `;
        case 'radio':
            return (field.options || []).map(option => `
                <label>
                    <input type="radio" name="${field.name}" value="${option.value}">
                    ${option.label}
                </label>`).join('');
        case 'checkbox':
            return `
                <input type="checkbox" 
                       name="${field.name}" 
                       class="${field.class || ""}">
            `;
        case 'textarea':
            return `
                <textarea name="${field.name}" 
                         placeholder="${field.placeholder || ''}" 
                         class="${field.class || ""}"
                         ${field.rows ? `rows="${field.rows}"` : ''}></textarea>
            `;
        case 'number':
        case 'text':
        case 'tel':
        case 'email':
        case 'url':
        default:
            return `
                <input type="${field.type || 'text'}" 
                       name="${field.name}" 
                       placeholder="${field.placeholder || ''}" 
                       class="${field.class || ""}"
                       ${field.min !== undefined ? ` min="${field.min}"` : ""}
                       ${field.max !== undefined ? ` max="${field.max}"` : ""}
                >
            `;
    }
}

function addRowByButton(button) {
    const tableId = button?.dataset?.tableId;
    if (!tableId) {
        console.error("❌ Missing table ID in data-table-id attribute.");
        return;
    }

    let foundTable = null;
    if (formConfig && Array.isArray(formConfig.tables)) {
        foundTable = formConfig.tables.find(table => table.name === tableId);
    }
    if (!foundTable) {
        for (const key in formConfig) {
            const configSection = formConfig[key];
            if (configSection && Array.isArray(configSection.tables)) {
                foundTable = configSection.tables.find(table => table.name === tableId);
                if (foundTable) break;
            }
        }
    }
    if (!foundTable) {
        console.error(`❌ Missing table config for table ID: ${tableId}`);
        console.log("Available tables:", (formConfig.tables || []).map(t => t.name));
        return;
    }
    addRow(tableId, foundTable);
}

function addRow(tableId, config, isFirstRow = false) {
    const table = document.getElementById(tableId);
    if (!table) {
        console.error("Table not found:", tableId);
        return;
    }

    const tbody = table.querySelector("tbody");
    const rowIndex = tbody.rows.length + 1;
    const rowHTML = generateTableRowHTML(
        config.fields,
        rowIndex,
        config.actionCellClass || "action-buttons",
        config.actions || [],
        true
    );

    const temp = document.createElement("tbody");
    temp.innerHTML = rowHTML;
    const row = temp.firstElementChild;
    tbody.appendChild(row);

    updateSerialNumbers(tableId);

    const removeBtn = row.querySelector(".remove-row");
    if (removeBtn) {
        removeBtn.classList.remove("d-none");
        removeBtn.addEventListener("click", () => removeRow(row, tableId));
    }

    row.querySelectorAll("button[data-redirect]").forEach(btn => {
        btn.addEventListener("click", () => {
            const url = btn.dataset.redirect;
            if (url) window.location.href = url;
        });
    });
}

function removeRow(row, tableId) {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector("tbody");
    const allRows = Array.from(tbody.querySelectorAll("tr"));
    const isFirstRow = allRows.indexOf(row) === 0;

    if (isFirstRow) {
        console.log("🧹 Clearing first row inputs...");
        row.querySelectorAll("input, select, textarea").forEach(el => {
            if (el.tagName === "SELECT") {
                el.selectedIndex = 0;
            } else if (el.type === "checkbox" || el.type === "radio") {
                el.checked = false;
            } else {
                el.value = "";
            }
        });
    } else {
        console.log("🗑️ Removing row...");
        row.remove();
        updateSerialNumbers(tableId);
    }
}

function updateSerialNumbers(tableId) {
    const rows = document.querySelectorAll(`#${tableId} tbody tr`);
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1;
    });
    if (rows.length === 1) {
        const lastRemove = rows[0].querySelector(".remove-row");
        if (lastRemove) lastRemove.classList.add("d-none");
    }
}

async function insertdata(formElement, formConfig) {
    const formData = new FormData(formElement);
    try {
        const response = await fetch(formConfig.submitAPI, {
            method: formConfig.method,
            body: formData
        });

        let result;
        const isJson = response.headers.get("content-type")?.includes("application/json");
        if (isJson) {
            result = await response.json();
        } else {
            result = await response.text();
        }

        if (response.ok) {
            if (typeof showNotification === 'function') {
                showNotification({
                    type: "success",
                    message: result || "Saved successfully!",
                    duration: 3000
                });
            } else {
                alert("✅ Saved successfully!");
            }
        } else {
            console.log(formData, response, result);
            if (typeof showNotification === 'function') {
                showNotification({
                    type: "error",
                    message: `Save failed: ${result?.message || result || "Unknown error"}`,
                    duration: 5000
                });
            } else {
                alert("❌ Save failed: " + (result?.message || result || "Unknown error"));
            }
        }
    } catch (err) {
        console.error("❌ Error submitting form:", err);
        if (typeof showNotification === 'function') {
            showNotification({
                type: "error",
                message: "An error occurred while saving.",
                duration: 5000
            });
        } else {
            alert("❌ An error occurred while saving.");
        }
    }
}

function groupFieldsByRow(fields) {
    const grouped = {};
    fields.forEach(field => {
        const group = field.group || 0;
        if (!grouped[group]) grouped[group] = [];
        grouped[group].push(field);
    });
    return Object.values(grouped);
}

function setupImagePreview(formElement, fieldName, imgPreviewId) {
    const fileInput = formElement.querySelector(`[name="${fieldName}"]`);
    const imgPreview = document.getElementById(imgPreviewId);

    if (!fileInput || !imgPreview) return;

    fileInput.addEventListener('change', function () {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                imgPreview.src = e.target.result;
                imgPreview.style.display = 'block';
            }
            reader.readAsDataURL(file);
        } else {
            imgPreview.src = '';
            imgPreview.style.display = 'none';
        }
    });
}

document.addEventListener('DOMContentLoaded', function () {
    renderFormDefault();
    document.addEventListener("click", function (e) {
        const button = e.target.closest("button[data-redirect]");
        if (button) {
            const target = button.dataset.redirect;
            if (target) window.location.href = target;
        }
    });

    // Setup existing data loading and image preview if form exists
    if (typeof formConfig !== "undefined" && formConfig?.id) {
        const formElement = document.getElementById(formConfig.id);
        if (formElement) {
            if (typeof existingdata === 'function') {
                existingdata(formElement).then(() => {
                    const imgPreview = document.getElementById("logoPreview");
                    if (typeof existingData !== "undefined" && existingData?.logoUrl && imgPreview) {
                        imgPreview.src = existingData.logoUrl;
                        imgPreview.style.display = 'block';
                    }
                }).catch(err => {
                    console.error("Error loading existing data:", err);
                });
            }
            setupImagePreview(formElement, "logo", "logoPreview");
        }
    }
});