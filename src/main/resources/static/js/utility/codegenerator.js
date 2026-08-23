const formTitles = [
    "Category",
    "Company",
    "Branch",
    "Department",
    "Item"
];

const formsContainer = document.getElementById('formsContainer');
const templateForm = formsContainer.querySelector('form');
formsContainer.innerHTML = "";

// Fetch generate state and update UI
function fetchGenerateState(title, checkbox, manualFields, saveBtn) {
    fetch(`/api/generate?name=${encodeURIComponent(title)}`)
        .then(res => res.ok ? res.json() : Promise.reject())
        .then(data => {
            const isAuto = data && data.generate === true;
            checkbox.checked = isAuto;
            manualFields.classList.toggle('hidden', isAuto);
            saveBtn.style.display = isAuto ? 'none' : '';
        })
        .catch(() => {
            checkbox.checked = false;
            manualFields.classList.remove('hidden');
            saveBtn.style.display = '';
        });
}

// Handle auto-generate logic
function handleAutoGenerate(title, checkbox, manualFields, saveBtn) {
    manualFields.classList.add('hidden');
    checkbox.checked = true;
    saveBtn.style.display = 'none';
    fetch('/api/generate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: title, generate: true, display: true})
    })
        .then(() => {
            fetchGenerateState(title, checkbox, manualFields, saveBtn);
            alert(`${title} auto-generated!`);
        })
        .catch(() => {
            alert('Error auto-generating code.');
        });
}

// Handle manual entry logic
function handleManualEntry(title, manualFields, checkbox, saveBtn) {
    manualFields.classList.remove('hidden');
    checkbox.checked = false;
    saveBtn.style.display = '';
    fetch('/api/generate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name: title, generate: false, display: true})
    })
        .then(() => {
            fetchGenerateState(title, checkbox, manualFields, saveBtn);
        })
        .catch(() => {
            alert('Error switching to manual entry.');
        });
}

// Add/remove row functionality
function addRemoveFunctionality(row, fieldsContainer) {
    row.querySelector('.remove-row-btn').addEventListener('click', () => {
        fieldsContainer.removeChild(row);
    });
}

formTitles.forEach(title => {
    const form = templateForm.cloneNode(true);
    form.querySelector('h3').innerText = title;

    const checkbox = form.querySelector('input[type="checkbox"]');
    const manualFields = form.querySelector('.manualFields');
    const addRowBtn = form.querySelector('.add-row-btn');
    const fieldsContainer = form.querySelector('.fieldsContainer');
    const saveBtn = form.querySelector('.save-btn');

    manualFields.classList.remove('hidden');
    checkbox.checked = false;
    saveBtn.style.display = '';

    fetchGenerateState(title, checkbox, manualFields, saveBtn);

    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            handleAutoGenerate(title, checkbox, manualFields, saveBtn);
        } else {
            handleManualEntry(title, manualFields, checkbox, saveBtn);
        }
    });

    addRemoveFunctionality(form.querySelector('.inline-fields'), fieldsContainer);

    addRowBtn.addEventListener('click', () => {
        const newRow = document.createElement('div');
        newRow.classList.add('inline-fields');
        newRow.innerHTML = `
    <div class="form-group">
        <label>Code Name</label>
        <input type="text" name="code_name[]">
    </div>
    <div class="form-group">
        <label>Code</label>
        <input type="text" name="code[]">
    </div>
    <button type="button" class="remove-row-btn">Remove</button>
`;
        fieldsContainer.appendChild(newRow);
        addRemoveFunctionality(newRow, fieldsContainer);
    });

    // Updated Form submit handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (checkbox.checked) {
            handleAutoGenerate(title, checkbox, manualFields, saveBtn);
            form.reset();
            checkbox.checked = true;
            manualFields.classList.add('hidden');
            saveBtn.style.display = 'none';
        } else {
            const codeNames = [];
            form.querySelectorAll('.inline-fields').forEach(row => {
                const codeName = row.querySelector('input[name="code_name[]"]').value;
                const code = row.querySelector('input[name="code[]"]').value;
                if (codeName && code) {
                    codeNames.push({
                        codeName: codeName,
                        code: code,
                        type: title,
                        display: true
                    });
                }
            });

            // First update the generate setting
            fetch('/api/generate', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name: title, generate: false, display: true})
            })
                .then(() => {
                    // Save the code names using the new endpoint
                    if (codeNames.length > 0) {
                        // Use Promise.all to handle each codeName separately
                        const savePromises = codeNames.map(data =>
                            fetch('/api/code-name/manual', {
                                method: 'POST',
                                headers: {'Content-Type': 'application/json'},
                                body: JSON.stringify(data)
                            }).then(res => {
                                if (!res.ok) {
                                    return res.text().then(msg => { throw new Error(msg); });
                                }
                                return res.json();
                            })
                        );
                        return Promise.all(savePromises);
                    }
                    return Promise.resolve();
                })
                .then(() => {
                    fetchGenerateState(title, checkbox, manualFields, saveBtn);
                    alert('Codes saved!');
                    form.reset();
                    checkbox.checked = false;
                    manualFields.classList.remove('hidden');
                    saveBtn.style.display = '';
                })
                .catch(error => {
                    // Show backend error message clearly
                    alert(error.message || 'Error saving data. Please try again.');
                });
        }
    });

    formsContainer.appendChild(form);
});

// Restrict to letters and limit length to 2
document.addEventListener('DOMContentLoaded', function() {
    const codeInputs = document.querySelectorAll('input[name="code[]"]');

    codeInputs.forEach(input => {
        input.setAttribute('maxlength', 2); // Only 2 characters

        input.addEventListener('input', function(e) {
            // Remove non-letters
            this.value = this.value.replace(/[^a-zA-Z]/g, '');
            // Limit to 2 letters (if pasted more)
            if (this.value.length > 2) {
                this.value = this.value.slice(0, 2);
            }
        });
    });
});