class Main {
    init(formConfig = null, retryCount = 3, retryDelay = 100) {
        const tryInit = (attempt = 1) => {
            const formContainer = document.getElementById('formContainer');
            if (!formContainer) {
                if (attempt <= retryCount) {
                    console.warn(`Form container not found, retrying (${attempt}/${retryCount})...`);
                    setTimeout(() => tryInit(attempt + 1), retryDelay);
                } else {
                    console.error('Form container with id "formContainer" not found after retries.');
                }
                return;
            }

            // Try to get formConfig from parameter, window, or data attribute
            let config = formConfig || window.formConfig || null;
            if (!config && formContainer.dataset.formConfig) {
                try {
                    config = JSON.parse(formContainer.dataset.formConfig);
                } catch (err) {
                    console.error('Error parsing formConfig from data-form-config:', err, formContainer.dataset.formConfig);
                }
            }

            if (!config) {
                console.error('No formConfig provided. Ensure formConfig is passed via parameter, window.formConfig, or data-form-config attribute.');
                formContainer.innerHTML = '<p>Error: Form configuration missing. Please contact support.</p>';
                return;
            }

            const formRenderer = new FormRenderer();
            formRenderer.renderFormDefault(config).then(() => {
                if (config?.id) {
                    const formElement = document.getElementById(config.id);
                    if (formElement) {
                        const formHandler = new FormHandler();
                        formHandler.setupImagePreview(formElement, 'logo', 'logoPreview');
                    } else {
                        console.warn(`Form element with id "${config.id}" not found.`);
                    }
                }
            }).catch(err => {
                console.error('Error rendering form:', err);
                formContainer.innerHTML = '<p>Error: Failed to render form. Please try again later.</p>';
            });

            document.addEventListener('click', (e) => {
                const button = e.target.closest('button[data-redirect]');
                if (button) {
                    const target = button.dataset.redirect;
                    if (target) window.location.href = target;
                }
                if (e.target.closest('button[data-table-id]')) {
                    const tableGenerator = new TableGenerator();
                    tableGenerator.addRowByButton(e.target.closest('button'), config);
                }
            });
        };

        document.addEventListener('DOMContentLoaded', () => tryInit());
    }
}
// Declare globally only once
window.damageVisible = window.damageVisible || false;

window.Main = Main;

// Automatically initialize Main
const main = new Main();
main.init();