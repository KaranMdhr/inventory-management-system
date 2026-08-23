class FormRenderer {
    async renderFormDefault(formConfig) {
        const container = document.getElementById("formContainer");
        if (!container || !formConfig) {
            container.innerHTML = "<p>Error: Form data missing.</p>";
            return Promise.reject(new Error("Form container or configuration missing"));
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
                    const data = await ApiService.get(field.fetchAPI);
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

        const fieldGenerator = new FieldGenerator();
        let formHTML = `<div class="form-container">
            <h2 style="text-align:center;">${formConfig.title}</h2>
            <form method="${formConfig.method}" enctype="multipart/form-data" id="${formConfig.id}">`;

        if (buttonsByPosition.top.length > 0) {
            formHTML += `<div class="top-buttons">${buttonsByPosition.top.map(btn => fieldGenerator.generateButtonHTML(btn)).join("")}</div>`;
        }

        const groupedFields = this.groupFieldsByRow(formConfig.fields);
        formHTML += groupedFields.map((rowFields, rowIndex) => {
            const group = rowFields[0]?.group || rowIndex + 1;
            let rowHTML = rowFields.map(field => fieldGenerator.generateFieldHTML(field, form)).join("");
            const groupButtons = buttonsByPosition.inline[group] || [];
            rowHTML += groupButtons.map(btn => fieldGenerator.generateButtonHTML(btn)).join("");
            return `<div class="form-row">${rowHTML}</div>`;
        }).join("");

        if (buttonsByPosition.table.length > 0) {
            formHTML += `<div class="table-buttons">${buttonsByPosition.table.map(btn => fieldGenerator.generateButtonHTML(btn)).join("")}</div>`;
        }

        const tableGenerator = new TableGenerator();
        if (formConfig.tables) {
            formConfig.tables.forEach(table => {
                const actionCellClass = table.actionCellClass || "action-buttons";
                formHTML += `
                    <div class="table-responsive">
                        <table id="${table.name}">
                            <thead>
                                <tr>
                                    ${table.headers.map((h, index) => {
                    let label = typeof h === "string" ? h : h.label;
                    let required = typeof h === "object" && h.required;
                    const headerClass = table.class && table.class[index] ? table.class[index] : '';
                    return `<th class="${headerClass}">${label}${required ? ' <span class="required-star">*</span>' : ''}</th>`;
                }).join('')}
                                </tr>
                            </thead>
                            <tbody>${tableGenerator.generateTableRowHTML(
                    table.fields,
                    1,
                    table.actionCellClass || "action-buttons",
                    table.actions || [],
                    true,
                    table.id,
                    table.class 
                )}</tbody>
                        </table>
                    </div>`;
            });
        }

        if (formConfig.aftertableFields) {
            formHTML += this.groupFieldsByRow(formConfig.aftertableFields).map(rowFields =>
                `<div class="form-row">${rowFields.map(field => fieldGenerator.generateFieldHTML(field, form)).join("")}</div>`
            ).join("");
        }

        if (buttonsByPosition.bottom.length > 0) {
            formHTML += `<div class="bottom-buttons">${buttonsByPosition.bottom.map(btn => fieldGenerator.generateButtonHTML(btn)).join("")}</div>`;
        }

        formHTML += `</form></div>`;
        container.innerHTML = formHTML;

        // After the form HTML is inserted into the DOM (right after you finish rendering the form):
        document.dispatchEvent(new CustomEvent('formRendered', {
            detail: { fields: formConfig?.fields || [] }
        }));

        const allFields = [...(formConfig.fields || []), ...(formConfig.aftertableFields || [])];
        const fieldValidation = new FieldValidation();
        const setupFieldsRecursively = (fields) => {
            fields.forEach(field => {
                if (field.type === "group" && Array.isArray(field.fields)) {
                    setupFieldsRecursively(field.fields);
                } else {
                    fieldValidation.setupFieldValidation(field, container, form);
                }
            });
        };
        setupFieldsRecursively(allFields);

        fieldValidation.setupLiveRequiredFieldListeners(document.getElementById(formConfig.id), formConfig);

        const formElement = document.getElementById(formConfig.id);

        formElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                // If it’s a TagInput, its handler already added the tag. Just prevent submit.
                e.preventDefault();
            }
        });

        (() => {
            let lastEnter = false;

            const focusables = () =>
                Array.from(formElement.querySelectorAll(
                    'input:not([type="hidden"]):not([disabled]), select:not([disabled]), textarea:not([disabled])'
                )).filter(el => el.offsetParent !== null);

            formElement.addEventListener('keydown', (e) => {
                if (e.key !== 'Enter') return;
                if (e.target.tagName === 'TEXTAREA') return; // allow newline in textarea

                // Prevent implicit submit
                e.preventDefault();
                lastEnter = true;

                // If it's TagInput, TagInput will add the tag; do not move focus
                if (e.target.classList.contains('tag-input-field')) return;

                // Otherwise move to next focusable field
                const fields = focusables();
                const idx = fields.indexOf(document.activeElement);
                for (let i = idx + 1; i < fields.length; i++) {
                    fields[i].focus();
                    break;
                }
            });

            // Guard: if a submit slips through right after Enter, cancel it
            formElement.addEventListener('submit', (e) => {
                if (lastEnter) {
                    e.preventDefault();
                    lastEnter = false;
                }
            });
        })();

        const formHandler = new FormHandler();
        formElement.onsubmit = (e) => formHandler.handleSubmit(e, formElement, formConfig, form, showNotification);

        return Promise.resolve();
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

// Temporary test (place anywhere, no filepath)
// Adds <li> to #categoryList on Enter in #categoryInput
document.addEventListener('DOMContentLoaded', () => {
    const i = document.getElementById('categoryInput');
    const ul = document.getElementById('categoryList');
    if (!i || !ul) return;
    i.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
            e.preventDefault(); e.stopPropagation();
            const v = i.value.trim(); if (!v) return;
            const li = document.createElement('li'); li.textContent = v;
            ul.appendChild(li); i.value = '';
        }
    });
});

window.FormRenderer = FormRenderer;