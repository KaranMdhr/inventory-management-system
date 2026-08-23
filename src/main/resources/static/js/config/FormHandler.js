class FormHandler {
    async handleSubmit(e, formElement, formConfig, form, showNotification) {
        e.preventDefault();
        const fieldValidation = new FieldValidation();
        const hasError = fieldValidation.setupRequiredFieldListeners(formElement, formConfig, form, showNotification);
        if (hasError) return;

        const formData = new FormData(formElement);
        const data = {};

        const allFields = [...(formConfig.fields || []), ...(formConfig.aftertableFields || [])];
        allFields.forEach(field => this.processField(field, formElement, formData, data));

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

        if (formConfig.image) {
            await this.insertdata(formElement, formConfig, showNotification);
            return;
        }

        try {
            const method = formConfig.method.toLowerCase();
            const result = await ApiService[method](formConfig.submitAPI, data);

            if (typeof showNotification === 'function') {
                showNotification({
                    type: "success",
                    message: result.message || "Saved successfully!",
                    duration: 3000
                });
            } else {
                alert(result.message || "Saved successfully!");
            }

            if (formConfig.redirectURL) {
                setTimeout(() => {
                    window.location.replace(formConfig.redirectURL);
                }, 600); // 600ms to allow notification to show briefly
            } else {
                setTimeout(() => {
                    window.location.reload();
                }, 600);
            }


            if (formConfig.resetAfterSubmit) {
                formElement.reset();
                Object.keys(data).forEach(key => delete form[key]);
            }
        } catch (err) {
            console.error("Error submitting form:", err);
            if (typeof showNotification === 'function') {
                showNotification({
                    type: "error",
                    message: `Save failed: ${err.message || "Unknown error"}`,
                    duration: 5000
                });
            } else {
                alert(`Save failed: ${err.message || "Unknown error"}`);
            }
        }
    }

    processField(field, formElement, formData, data) {
        if (field.type === "group" && Array.isArray(field.fields)) {
            field.fields.forEach(subField => this.processField(subField, formElement, formData, data));
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

    setupImagePreview(formElement, fieldName, imgPreviewId) {
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

    async insertdata(formElement, formConfig, showNotification) {
        const formData = new FormData(formElement);
        try {
            const result = await ApiService.post(formConfig.submitAPI, formData, "multipart/form-data");
            if (typeof showNotification === 'function') {
                showNotification({
                    type: "success",
                    message: result.message || "Saved successfully!",
                    duration: 3000
                });
            } else {
                alert("✅ Saved successfully!");
            }
        } catch (err) {
            console.error("❌ Error submitting form:", err);
            if (typeof showNotification === 'function') {
                showNotification({
                    type: "error",
                    message: `Save failed: ${err.message || "Unknown error"}`,
                    duration: 5000
                });
            } else {
                alert(`❌ Save failed: ${err.message || "Unknown error"}`);
            }
        }
    }
}

window.FormHandler = FormHandler;
