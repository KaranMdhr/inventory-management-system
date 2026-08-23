function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

const stockDetails = {
    'furniture': [
        { stock: 'In', itemName: 'Metal Table', date: '2025-06-27', remarks: 'New delivery', quantity: 10, requestedBy: 'John Doe' },
        { stock: 'Out', itemName: 'Wooden Chair', date: '2025-06-28', remarks: 'Issued to office', quantity: 3, requestedBy: 'Jane Smith' },
        { stock: 'Out', itemName: 'Metal Table', date: '2025-06-29', remarks: 'Damaged item return', quantity: 2, requestedBy: 'John Doe' },
    ],
    'plate': [
        { stock: 'In', itemName: 'Steel Plate', date: '2025-06-28', remarks: 'New delivery', quantity: 15, requestedBy: 'Alice Green' },
        { stock: 'Out', itemName: 'Plastic Plate', date: '2025-06-28', remarks: 'Issued to canteen', quantity: 5, requestedBy: 'Bob Brown' },
    ],
    'Wash Cloth': [
        { stock: 'In', itemName: 'Blue Cloth', date: '2025-06-28', remarks: 'Delivery', quantity: 10, requestedBy: 'Sam White' },
        { stock: 'Out', itemName: 'White Cloth', date: '2025-06-29', remarks: 'Issued to cleaning', quantity: 6, requestedBy: 'Lily Pink' },
    ],
    'glass': [
        { stock: 'In', itemName: 'Drinking Glass', date: '2025-06-28', remarks: 'Restocking', quantity: 12, requestedBy: 'Mason Gray' },
        { stock: 'Out', itemName: 'Wine Glass', date: '2025-06-29', remarks: 'Broken return', quantity: 4, requestedBy: 'Olivia Black' },
    ]
};

const category = getQueryParam('category') || '';
document.getElementById('item-name').innerText = category;

let details = (stockDetails[category] || []).map((item, index) => ({
    ...item,
    formNumber: `FN ${String(index + 1).padStart(6, '0')}`
}));

const itemNameSelect = document.getElementById("itemNameSelect");
const searchInput = document.getElementById("searchInput");
const fromDateInput = document.getElementById("fromDate");
const toDateInput = document.getElementById("toDate");

// Populate itemName select dropdown
const uniqueItemNames = [...new Set(details.map(d => d.itemName))];
uniqueItemNames.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    itemNameSelect.appendChild(option);
});

let filteredData = [...details];

document.addEventListener("DOMContentLoaded", function () {
const columnConfig = [
    { header: "Stock", dataKey: "stock" },
    { header: "Item Name", dataKey: "itemName" },
    { header: "Form Number", dataKey: "formNumber" },
    { header: "Date", dataKey: "date" },
    { header: "Remarks", dataKey: "remarks" },
    { header: "Quantity", dataKey: "quantity" },
    { header: "Balance", dataKey: "balance" },
    { header: "Requested By", dataKey: "requestedBy" },
];

new TableManager({
    apiEndpoint: "/api",
    idKey: "Id",
    columnConfig: columnConfig,
    confirmMessage: "Are you sure you want to delete this ?",
    errorMessage: "Failed to delete : ",
    actions: [
        {label: "Edit", type: "url", url: "?id={id}"},
        {label: "View", type: "url", url: "?id={id}"},
        {label: "Delete", type: "api", endpoint: "/api"}
    ]
})

});

/*
function renderTable(data) {
    if (!window.DynamicTableRenderer) {
        console.error("DynamicTableRenderer is not loaded");
        return;
    }


    const totalRows = data.length;
    if (totalRows === 0) {
        window.DynamicTableRenderer.render([], columnConfig);
        return;
    }
    window.DynamicTableRenderer.render(data, columnConfig);
}


function filterTable() {
    const selectedItemName = itemNameSelect.value.toLowerCase();
    const searchValue = searchInput.value.toLowerCase();
    const fromDate = fromDateInput.value;
    const toDate = toDateInput.value;

    filteredData = details.filter(detail => {
        const matchesItemName = !selectedItemName || detail.itemName.toLowerCase() === selectedItemName;
        const matchesSearch = !searchValue ||
            detail.remarks.toLowerCase().includes(searchValue) ||
            detail.requestedBy.toLowerCase().includes(searchValue) ||
            detail.itemName.toLowerCase().includes(searchValue);
        const matchesFromDate = !fromDate || detail.date >= fromDate;
        const matchesToDate = !toDate || detail.date <= toDate;

        return matchesItemName && matchesSearch && matchesFromDate && matchesToDate;
    });

    currentPage = 1;
    renderTable(filteredData);
}

// Initial load
document.addEventListener("DOMContentLoaded", () => {
    renderTable(filteredData);

    itemNameSelect.addEventListener("change", filterTable);
    searchInput.addEventListener("input", filterTable);
    fromDateInput.addEventListener("change", filterTable);
    toDateInput.addEventListener("change", filterTable);
});
*/
