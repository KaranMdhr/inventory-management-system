class TableGenerator {
    generateTableRowHTML(fields, index, actionCellClass = "action-buttons", actions = [], showRemove = true, tableId = "", columnClasses = []) {
        let rowHTML = `<tr>`;

        // Column 0: S.N.
        const snClass = columnClasses[0] || '';
        rowHTML += `<td class="${snClass}">${index}</td>`;

        // Other columns
        const fieldCells = fields.map((field, i) => {
            const className = columnClasses[i + 1] || ""; // skip S.N. which is index 0
            // Apply display style if specified in the field config
            const displayStyle = field.display === "none" ? 'style="display: none;"' : '';
            return `<td class="${className}" ${displayStyle}>${this.generateInputHTML(field)}</td>`;
        }).join("");

        rowHTML += fieldCells;
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
        rowHTML += `<td class="${actionCellClass}">${actionButtons}${removeBtnHTML}</td>`;
        rowHTML += `</tr>`;
        return rowHTML;
    }

    generateInputHTML(field) {
        // Apply display style if specified in the field config
        const displayStyle = field.display === "none" ? 'style="display: none;"' : '';
        switch (field.type) {
            case 'select':
                return `
                    <select name="${field.name}" 
                            class="${field.class || ""}" ${displayStyle}>
                        ${(field.options || []).map(option => `
                            <option value="${option.value}" 
                                    data-short="${option.short || ""}">
                                ${option.text}
                            </option>`).join("")}
                    </select>
                `;
            case 'radio':
                return (field.options || []).map(option => `
                    <label ${displayStyle}>
                        <input type="radio" name="${field.name}" value="${option.value}">
                        ${option.label}
                    </label>`).join('');
            case 'checkbox':
                return `
                    <input type="checkbox" 
                           name="${field.name}" 
                           class="${field.class || ""}" ${displayStyle}>
                `;
            case 'textarea':
                return `
                    <textarea name="${field.name}" 
                             placeholder="${field.placeholder || ''}" 
                             class="${field.class || ""}" ${displayStyle}
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
                           class="${field.class || ""}" ${displayStyle}
                           ${field.min !== undefined ? ` min="${field.min}"` : ""}
                           ${field.max !== undefined ? ` max="${field.max}"` : ""}
                    >
                `;
        }
    }

    addRowByButton(button, formConfig) {
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
        this.addRow(tableId, foundTable);
    }

    addRow(tableId, config, isFirstRow = false) {
        const table = document.getElementById(tableId);
        if (!table) {
            console.error("Table not found:", tableId);
            return;
        }

        const tbody = table.querySelector("tbody");
        const rowIndex = tbody.rows.length + 1;
        const rowHTML = this.generateTableRowHTML(
            config.fields,
            rowIndex,
            config.actionCellClass || "action-buttons",
            config.actions || [],
            true,
            tableId,
            config.class // Pass column classes from config
        );

        const temp = document.createElement("tbody");
        temp.innerHTML = rowHTML;
        const row = temp.firstElementChild;
        tbody.appendChild(row);

        // Sync the new row's damage-checkbox <td> and input visibility with the current state
        const newDamageCell = row.querySelector('.damage-checkbox');
        const newDamageInput = row.querySelector('.damage-checkbox input');
        if (newDamageCell) {
            const displayStyle = window.isDamageVisible ? 'table-cell' : 'none';
            newDamageCell.style.display = displayStyle;
        }
        if (newDamageInput) {
            const inputDisplayStyle = window.isDamageVisible ? '' : 'none'; // Use '' to respect default display
            newDamageInput.style.display = inputDisplayStyle;
        }

        this.updateSerialNumbers(tableId);

        const removeBtn = row.querySelector(".remove-row");
        if (removeBtn) {
            removeBtn.classList.remove("d-none");
            removeBtn.addEventListener("click", () => this.removeRow(row, tableId));
        }

        row.querySelectorAll("button[data-redirect]").forEach(btn => {
            btn.addEventListener("click", () => {
                const url = btn.dataset.redirect;
                if (url) window.location.href = url;
            });
        });
    }

    removeRow(row, tableId) {
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
            this.updateSerialNumbers(tableId);
        }
    }

    updateSerialNumbers(tableId) {
        const rows = document.querySelectorAll(`#${tableId} tbody tr`);
        rows.forEach((row, index) => {
            row.cells[0].textContent = index + 1;
        });
        if (rows.length === 1) {
            const lastRemove = rows[0].querySelector(".remove-row");
            if (lastRemove) lastRemove.classList.add("d-none");
        }
    }
}

window.TableGenerator = TableGenerator;