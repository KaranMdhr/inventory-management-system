window.formConfig={
        title: "Item Issue Form",
        method: "POST",
        fields: [
            {
                type: "tag-input",
                label: "Requisition Codes",
                name: "requestNumbers",
                inputId: "tagInput",
                containerId: "tagInputContainer",
                datalistId: "requisitionList",
                placeholder: "Enter Requisition Code",
                dynamicTags: true
            },
            {
                type: "table",
                label: "Issued Items",
                id: "itemsTable",
                containerId: "itemsTableContainer",
                displayCondition: "tagsAdded",
                columns: [
                    { header: "Item", name: "item" },
                    { header: "Unit", name: "unit" },
                    { header: "Quantity", name: "quantity" },
                    { header: "Rate", name: "rate" },
                    { header: "Amount", name: "amount" }
                ]
            },
            {
                type: "date",
                label: "Issue Date",
                name: "issueDate",

            },
            {
                type: "text",
                label: "Issued To",
                name: "issuedTo",

            }
        ],
    buttons: [
        { type: "submit", label: "Submit Issue", position: "bottom", class: "btn btn-sm btn-warning" },
        { type: "button", label: "Print Gatepass", position: "bottom", class: "btn btn-secondary", onclick: "confirmAndPrint()",}
    ],

    }


const requestData = {
    101: [
        { item: 'Keyboard', unit: 'Piece', quantity: 2, rate: 500 },
        { item: 'Mouse', unit: 'Piece', quantity: 3, rate: 300 }
    ],
    102: [
        { item: 'Monitor', unit: 'Piece', quantity: 1, rate: 12000 },
        { item: 'USB Cable', unit: 'Meter', quantity: 5, rate: 50 }
    ],
    103: [
        { item: 'Laptop', unit: 'Piece', quantity: 1, rate: 70000 },
        { item: 'Charger', unit: 'Piece', quantity: 1, rate: 1500 },
        { item: 'Laptop Bag', unit: 'Piece', quantity: 1, rate: 1000 }
    ]
};

const tagInput = document.getElementById('tagInput');
const requisitionList = document.getElementById('requisitionList');
const tagsList = document.getElementById('tagsList');
const hiddenInput = document.getElementById('requestNumbers');
const itemsTableContainer = document.getElementById('itemsTableContainer');
const itemsTableBody = document.querySelector('#itemsTable tbody');

let selectedCodes = [];

// Populate datalist
Object.keys(requestData).forEach(code => {
    const option = document.createElement('option');
    option.value = code;
    requisitionList.appendChild(option);
});

tagInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const code = tagInput.value.trim();
        if (code && requestData[code] && !selectedCodes.includes(code)) {
            selectedCodes.push(code);
            addTag(code);
            updateTable();
            updateHiddenInput();
        }
        tagInput.value = '';
    }
});

function addTag(code) {
    const li = document.createElement('li');
    li.textContent = code;

    const removeBtn = document.createElement('span');
    removeBtn.textContent = '×';
    removeBtn.onclick = () => {
        selectedCodes = selectedCodes.filter(c => c !== code);
        li.remove();
        updateTable();
        updateHiddenInput();
    };

    li.appendChild(removeBtn);
    tagsList.appendChild(li);
}

function updateTable() {
    itemsTableBody.innerHTML = '';
    if (selectedCodes.length === 0) {
        itemsTableContainer.style.display = 'none';
        return;
    }

    selectedCodes.forEach(code => {
        requestData[code].forEach(({ item, unit, quantity, rate }) => {
            const amount = quantity * rate;
            const row = document.createElement('tr');
            row.innerHTML = `
                    <td>${item}</td>
                    <td>${unit}</td>
                    <td>${quantity}</td>
                    <td>${rate.toFixed(2)}</td>
                    <td>${amount.toFixed(2)}</td>
                `;
            itemsTableBody.appendChild(row);
        });
    });

    itemsTableContainer.style.display = 'block';
}

function updateHiddenInput() {
    hiddenInput.value = selectedCodes.join(',');
}

function confirmAndPrint() {
    if (confirm("Do you want to print the Gatepass?")) {
        window.print();
    }
}