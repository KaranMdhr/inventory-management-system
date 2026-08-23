class FieldValidation {
    setupFieldValidation(field, formElement, form) {
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
                checkbox.addEventListener('change', () => {
                    const checked = formElement.querySelectorAll(`input[name="${field.name}"]:checked`);
                    if (checked.length > 0) {
                        checkboxes.forEach(c => c.classList.remove('required-field'));
                        const errorDiv = formElement.querySelector(`#${field.name}Group .field-error`);
                        if (errorDiv) {
                            errorDiv.textContent = "";
                            errorDiv.style.display = 'none';
                        }
                    }
                });
            });

        } else if (field.type === "radioGroup") {
            const radios = formElement.querySelectorAll(`input[name="${field.name}"]`);
            radios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    form[field.name] = e.target.value;
                    radios.forEach(r => r.classList.remove('required-field'));
                    const errorDiv = formElement.querySelector(`#${field.name}Group .field-error`);
                    if (errorDiv) {
                        errorDiv.textContent = "";
                        errorDiv.style.display = 'none';
                    }
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

                if (fieldElement.value.trim()) {
                    fieldElement.classList.remove('required-field');
                    const errorDiv = formElement.querySelector(`#${field.name}Group .field-error`);
                    if (errorDiv) errorDiv.style.display = 'none';
                }
            });

            if (["text", "email", "tel", "number", "textarea"].includes(field.type)) {
                fieldElement.addEventListener('change', () => {
                    if (fieldElement.value.trim()) {
                        fieldElement.classList.remove('required-field');
                        const errorDiv = formElement.querySelector(`#${field.name}Group .field-error`);
                        if (errorDiv) errorDiv.style.display = 'none';
                    }
                });
            }
        }
    }

    setupRequiredFieldListeners(formElement, formConfig, form, showNotification) {
        const allFields = [...(formConfig.fields || []), ...(formConfig.aftertableFields || [])];
        let hasError = false;

        allFields.forEach(field => {
            const input = formElement.querySelector(`[name="${field.name}"]`);
            const errorDiv = formElement.querySelector(`#${field.name}Group .field-error`);
            let isEmpty = false;
            let patternInvalid = false;

            if (field.required) {
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

            if (!isEmpty && !patternInvalid) {
                input.classList.remove('required-field');
                if (errorDiv) errorDiv.style.display = 'none';
            }
        });

        return hasError;
    }

    setupLiveRequiredFieldListeners(formElement, formConfig) {
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
}

window.FieldValidation = FieldValidation;