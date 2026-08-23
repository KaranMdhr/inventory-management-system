/*const data = [
    { date: '2025-07-01', company: 'Acme Corp', type: 'Maintainer', contact: 'John Doe', product: 'Inventory System', duration: '6 months' },
    { date: '2025-06-28', company: 'Beta Ltd', type: 'Support', contact: 'Jane Smith', product: 'CRM Tool', duration: '1 year' },
    { date: '2025-06-25', company: 'Gamma Inc', type: 'Maintainer', contact: 'Michael Lee', product: 'Accounting Software', duration: '3 months' },
    { date: '2025-06-20', company: 'Delta Pvt', type: 'Support', contact: 'Emily Davis', product: 'HR Portal', duration: '2 years' },

];*/

document.addEventListener("DOMContentLoaded", function () {
    const columnConfig = [
        {header: "Date", dataKey: "date", resizable: true, sortable: true},
        {header: "Company", dataKey: "company", resizable: true, sortable: true},
        {header: "Type", dataKey: "type", resizable: true, sortable: true},
        {header: "Contact", dataKey: "contact", resizable: true, sortable: true},
        {header: "Product", dataKey: "product", resizable: true, sortable: true},
        {header: "Duration", dataKey: "duration", resizable: true, sortable: true},
        {header: "Actions" }
    ];

    new TableManager({
        apiEndpoint: "/api/",
        idKey: "companyId",
        columnConfig: columnConfig,
        confirmMessage: "Are you sure you want to delete this company?",
        errorMessage: "Failed to delete company: ",
        actions: [
            {label: "Edit", type: "url", url: "/?id={id}"},
            {label: "View", type: "url", url: "/?id={id}"},
            {label: "Delete", type: "api", endpoint: "/api"}
        ]
    })
});

/*
let filteredData = [...data];

function populateCompanyDropdown() {
    const companySelect = document.getElementById('companyFilter');
    const companies = [...new Set(data.map(row => row.company))].sort();
    companies.forEach(company => {
        const option = document.createElement('option');
        option.value = company;
        option.textContent = company;
        companySelect.appendChild(option);
    });
}

function renderTable(dataToRender) {
    if (!window.DynamicTableRenderer) {
        console.error("DynamicTableRenderer is not loaded");
        return;
    }
    const totalRows = dataToRender.length;
    if (totalRows === 0) {
        window.DynamicTableRenderer.render([], columnConfig);
        document.getElementById.innerHTML = '';
        return;
    }
    window.DynamicTableRenderer.render(data, columnConfig);


}

function filterData() {
    const company = document.getElementById('companyFilter').value;
    const type = document.getElementById('typeFilter').value;
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    const search = document.getElementById('search').value.toLowerCase();

    filteredData = data.filter(row => {
        const matchesCompany = !company || row.company === company;
        const matchesType = !type || row.type === type;
        const matchesDateFrom = !dateFrom || row.date >= dateFrom;
        const matchesDateTo = !dateTo || row.date <= dateTo;
        const matchesSearch = !search || Object.values(row).some(val => val.toLowerCase().includes(search));
        return matchesCompany && matchesType && matchesDateFrom && matchesDateTo && matchesSearch;
    });

    renderTable(filteredData);
}

function resetFilter() {
    document.getElementById('companyFilter').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';
    document.getElementById('search').value = '';
    filteredData = [...data];
    renderTable(filteredData);
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    populateCompanyDropdown();
    renderTable(filteredData);
});
*/
