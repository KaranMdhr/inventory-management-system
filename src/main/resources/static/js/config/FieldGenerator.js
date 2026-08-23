class FieldGenerator {
    // Generates HTML for a button based on its configuration
    generateButtonHTML(btn) {
        const redirectAttr = btn.redirect ? `data-redirect="${btn.redirect}"` : "";
        const onclickAttr = btn.onclick ? `onclick="${btn.onclick}"` : "";
        const dataAttrs = Object.entries(btn)
            .filter(([key]) => key.startsWith("data-"))
            .map(([key, value]) => `${key}="${value}"`)
            .join(" ");
        return `<button type="${btn.type}" class="${btn.class || ''}" ${btn.id ? `id="${btn.id}"` : ''} ${onclickAttr} ${redirectAttr} ${dataAttrs}>${btn.label}</button>`;
    }

    // Generates HTML for any given form field
    generateFieldHTML(field, form, viewOnly = false) {
        const requiredMark = field.required ? '<span class="required-star">*</span>' : '';
        const labelHTML = field.label
            ? `<label ${field.id ? `for="${field.id}"` : ''} class="form-label${field.required ? ' required-label' : ''}">${field.label}${requiredMark}</label>`
            : "";

        // GROUP FIELD
        if (field.type === "group" && Array.isArray(field.fields)) {
            const groupClass = field.class ? ` ${field.class}` : "";
            const groupFieldsClass = field.groupFieldsClass ? ` ${field.groupFieldsClass}` : "";
            const methodVisibleAttr = field.methodVisibleFor ? `data-method-visible="${field.methodVisibleFor.join(',')}"` : "";
            const idAttr = field.id ? `id="${field.id}"` : "";
            const displayStyle = field.display ? `style="display:${field.display}"` : "";
            let groupHTML = `<div class="form-group${groupClass} custom-labels" ${idAttr} ${methodVisibleAttr} ${displayStyle}>`;
            if (field.label) {
                groupHTML += `<label class="group-label">${field.label}</label>`;
            }
            groupHTML += `<div class="group-fields${groupFieldsClass}">`;
            this.groupFieldsByRow(field.fields).forEach(rowFields => {
                groupHTML += `<div class="form-row">${rowFields.map(subField => this.generateFieldHTML(subField, form, viewOnly)).join("")}</div>`;
            });
            groupHTML += `</div></div>`;
            return groupHTML;
        }

        // CHECKBOX GROUP FIELD
        if (field.type === "checkbox-group" && Array.isArray(field.options)) {
            const groupId = field.name ? `${field.name}Group` : '';
            let valueArray = field.name && Array.isArray(form[field.name]) ? form[field.name] : [];
            const idAttr = field.id ? `id="${field.id}"` : "";
            const methodVisibleAttr = field.methodVisibleFor ? `data-method-visible="${field.methodVisibleFor.join(',')}"` : "";
            const displayStyle = field.display ? `style="display:${field.display}"` : "";
            return `
                <div class="form-group checkbox-group-field" ${idAttr} ${methodVisibleAttr} ${displayStyle}>
                    ${labelHTML}
                    <div class="checkbox-group-options" ${groupId ? `id="${groupId}"` : ''}>
                        ${field.options.map(option =>
                `<label>
                                <input 
                                    type="checkbox" 
                                    ${field.name ? `name="${field.name}"` : ''}
                                    value="${option.value}"
                                    ${valueArray.includes(option.value) ? 'checked' : ''}
                                    ${viewOnly ? 'disabled' : ''}
                                > ${option.text}
                            </label>`
            ).join("")}
                    </div>
                    <div class="field-error" style="display:none;"></div>
                </div>
            `;
        }

        if (field.type === "tagInput") {
            const idAttr = field.id ? `id="${field.id}"` : "";
            const methodVisibleAttr = field.methodVisibleFor ? `data-method-visible="${field.methodVisibleFor.join(',')}"` : "";
            const displayStyle = field.display ? `style="display:${field.display}"` : "";
            return `
                <div class="form-group${field.class ? ' ' + field.class : ''}" ${idAttr} ${methodVisibleAttr} ${displayStyle}>
                    ${labelHTML}
                    <div class="tag-input-container" ${field.name ? `id="${field.name}"` : ''}>
                        <ul ${field.name ? `id="${field.name}List"` : ''}></ul>
                        <input type="text" ${field.name ? `id="${field.name}Input"` : ''} placeholder="${field.placeholder || ''}" 
                             ${field.name ? `list="${field.name}Datalist"` : ''} autocomplete="off" class="tag-input-field" ${viewOnly ? 'readonly' : ''}>
                        <div ${field.name ? `id="${field.name}Suggestions"` : ''} class="suggestion-list" style="display:none;"></div>
                    </div>
                    <input type="hidden" ${field.name ? `name="${field.name}" id="${field.name}"` : ''}>
                    <div class="field-error" style="display:none;"></div>
                </div>
            `;
        }

        let inputHTML = "";
        if (field.type === "number") {
            const nameAttr = field.name ? `name="${field.name}"` : "";
            const idAttr = field.id ? `id="${field.id}"` : "";
            const readonlyAttr = field.readonly ? "readonly" : "";
            const minAttr = field.min !== undefined ? `min="${field.min}"` : "";
            const maxAttr = field.max !== undefined ? `max="${field.max}"` : "";
            const styleAttr = field.style ? `style="${field.style}"` : "";
            const valueAttr = form[field.name] ? `value="${form[field.name]}"` : "";
            const placeholderAttr = field.placeholder ? `placeholder="${field.placeholder}"` : "";
            inputHTML = `<input type="number" ${nameAttr} ${idAttr} class="form-control" ${readonlyAttr} ${minAttr} ${maxAttr} ${styleAttr} ${valueAttr} ${placeholderAttr}>`;
        } else if (field.type === "select") {
            const nameAttr = field.name ? `name="${field.name}"` : "";
            const idAttr = field.id ? `id="${field.id}"` : "";
            inputHTML = `<select ${nameAttr} ${idAttr} class="form-control ${field.class || ""}" ${viewOnly ? 'disabled' : ''}>
                <option value="" disabled selected>Select ${field.label || ''}</option>
                ${(field.options || []).map(opt =>
                `<option value="${opt.value}" ${opt.short ? `data-short="${opt.short}"` : ''}>${opt.text}</option>`
            ).join("")}
            </select>`;
        } else if (field.type === "checkbox") {
            const nameAttr = field.name ? `name="${field.name}"` : "";
            const idAttr = field.id ? `id="${field.id}"` : "";
            const classAttr = field.class ? `class="${field.class}"` : "";
            const text = field.text ? `<span class="checkbox-text">${field.text}</span>` : "";

            inputHTML = `<div class="checkboxandlabel">
                ${labelHTML}
                <input type="checkbox" ${nameAttr} ${idAttr} ${classAttr} ${viewOnly ? 'disabled' : ''}>
                ${text}

                <div class="field-error" style="display:none;"></div>
            </div>`;
        } else if (field.type === "radioGroup") {
            inputHTML = `<div class="radio-group${field.class ? ' ' + field.class : ''}">
                ${field.options.map(option =>
                `<input type="radio" ${field.name ? `id="${field.name}_${option.value}"` : ''} ${field.name ? `name="${field.name}"` : ''} 
                        value="${option.value}" ${viewOnly ? 'disabled' : ''}>
                    <label ${field.name ? `for="${field.name}_${option.value}"` : ''}>${option.text}</label>`
            ).join("")}
            </div>`;
        } else if (field.type === "file") {
            const idAttr = field.id ? `id="${field.id}"` : "";
            const methodVisibleAttr = field.methodVisibleFor ? `data-method-visible="${field.methodVisibleFor.join(',')}"` : "";
            const displayStyle = field.display ? `style="display:${field.display}"` : "";
            const nameAttr = field.name ? `name="${field.name}"` : "";
            const inputIdAttr = field.name ? `id="${field.name}"` : "";
            const placeholderAttr = field.placeholder ? `placeholder="${field.placeholder}"` : "";
            return `
                <div class="form-group${field.class ? ' ' + field.class : ''}" ${idAttr} ${methodVisibleAttr} ${displayStyle}>
                    ${labelHTML}
                    <input 
                        type="file" 
                        ${nameAttr} 
                        ${inputIdAttr} 
                        class="form-control" 
                        ${placeholderAttr} 
                        accept="${field.accept || 'image/*'}"
                        ${viewOnly ? 'disabled' : ''}>
                    <img 
                        ${field.name ? `id="${field.name}Preview"` : ''} 
                        style="display:none;max-width:150px;margin-top:10px;" 
                        alt="Image Preview">
                    <div class="field-error" style="display:none;"></div>
                </div>
            `;
        } else if (field.type === "textarea") {
            const nameAttr = field.name ? `name="${field.name}"` : "";
            const idAttr = field.id ? `id="${field.id}"` : "";
            const placeholderAttr = field.placeholder ? `placeholder="${field.placeholder}"` : "";
            const readonlyAttr = viewOnly ? 'readonly' : field.readonly ? 'readonly' : '';
            const rowsAttr = field.rows ? `rows="${field.rows}"` : '';
            const value = form[field.name] || "";
            inputHTML = `<textarea ${idAttr} ${nameAttr} class="form-control ${field.class || ""}" ${placeholderAttr} ${readonlyAttr} ${rowsAttr}>${value}</textarea>`;
        } else {
            const nameAttr = field.name ? `name="${field.name}"` : "";
            const idAttr = field.id ? `id="${field.id}"` : "";
            const readonlyAttr = field.readonly ? "readonly" : "";
            const minAttr = field.min !== undefined ? `min="${field.min}"` : "";
            const maxAttr = field.max !== undefined ? `max="${field.max}"` : "";
            const styleAttr = field.style ? `style="${field.style}"` : "";
            const valueAttr = form[field.name] ? `value="${form[field.name]}"` : "";
            const placeholderAttr = field.placeholder ? `placeholder="${field.placeholder}"` : "";
            inputHTML = `<input type="${field.type || "text"}" ${nameAttr} ${idAttr} class="form-control ${field.class || ""}" ${readonlyAttr} ${minAttr} ${maxAttr} ${styleAttr} ${valueAttr} ${placeholderAttr}>`;
        }

        // Combine label, input, and error display for non-checkbox fields
        const idAttr = field.type !== 'checkbox' && field.id ? `id="${field.id}"` : "";
        const methodVisibleAttr = field.methodVisibleFor ? `data-method-visible="${field.methodVisibleFor.join(',')}"` : "";
        const displayStyle = field.display ? `style="display:${field.display}"` : "";
        return `<div class="form-group${field.class && field.type !== 'checkbox' ? ' ' + field.class : ''}" ${idAttr} ${methodVisibleAttr} ${displayStyle}>
            ${field.type === 'checkbox' ? inputHTML : `${labelHTML}${inputHTML}`}
            ${field.type !== 'checkbox' ? '<div class="field-error" style="display:none;"></div>' : ''}
        </div>`;
    }

    groupFieldsByRow(fields) {
        const grouped = {};
        fields.forEach(field => {
            const group = field.group || 0;
            if (!grouped[group]) grouped[group] = [];
            grouped[group].push(field);
        });
        return Object.values(grouped);
    }
}

window.FieldGenerator = FieldGenerator;