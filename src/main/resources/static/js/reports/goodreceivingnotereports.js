/*const grnData = [
    { date: "2025-06-25", grn: "0001", supplier: "ABC Suppliers", remarks: "All items checked", status: "Approved" },
    { date: "2025-06-24", grn: "0002", supplier: "XYZ Traders", remarks: "Awaiting inspection", status: "Pending" },
    { date: "2025-06-23", grn: "0003", supplier: "OfficeMart", remarks: "Damaged items", status: "Rejected" },
    { date: "2025-06-22", grn: "0004", supplier: "ABC Suppliers", remarks: "Delivered on time", status: "Approved" },
    { date: "2025-06-21", grn: "0005", supplier: "XYZ Traders", remarks: "Partial delivery", status: "Pending" },
    { date: "2025-06-20", grn: "0006", supplier: "Pokhara Suppliers", remarks: "All good", status: "Approved" },
    { date: "2025-06-19", grn: "0007", supplier: "Lumbini Wholesale", remarks: "More items to come", status: "Pending" },
    { date: "2025-06-18", grn: "0008", supplier: "Biratnagar Suppliers", remarks: "Safe delivery", status: "Approved" },
    { date: "2025-06-17", grn: "0009", supplier: "Janakpur Products", remarks: "Damaged item", status: "Rejected" },
    { date: "2025-06-16", grn: "0010", supplier: "Butwal Goods", remarks: "All good", status: "Approved" },
    { date: "2025-06-15", grn: "0011", supplier: "Dharan Mart", remarks: "Awaiting inspection", status: "Pending" },
    { date: "2025-06-14", grn: "0012", supplier: "Bhaktapur Suppliers", remarks: "All items fine", status: "Approved" },
    { date: "2025-06-13", grn: "0013", supplier: "Nepalgunj Traders", remarks: "Expired items", status: "Rejected" },
    { date: "2025-06-12", grn: "0014", supplier: "Hetauda Goods", remarks: "All good", status: "Approved" },
    { date: "2025-06-11", grn: "0015", supplier: "Dhangadhi Inc", remarks: "More items to come", status: "Pending" },
    { date: "2025-06-10", grn: "0016", supplier: "Birgunj Logistics", remarks: "All good", status: "Approved" },
    { date: "2025-06-09", grn: "0017", supplier: "Gorkha Wholesale", remarks: "Damaged item", status: "Rejected" },
    { date: "2025-06-08", grn: "0018", supplier: "Chitwan Suppliers", remarks: "All items fine", status: "Approved" },
    { date: "2025-06-07", grn: "0019", supplier: "Makwanpur Corp", remarks: "Awaiting inspection", status: "Pending" },
    { date: "2025-06-06", grn: "0020", supplier: "Jhapa Goods", remarks: "All good", status: "Approved" }
];*/
document.addEventListener("DOMContentLoaded", function () {
    const columnConfig = [
        {header: "Date", dataKey: "date", resizable: true, sortable: true},
        {header: "GRN No", dataKey: "grn", resizable: true, sortable: true},
        {header: "Supplier", dataKey: "supplier", resizable: true, sortable: true},
        {header: "Remarks", dataKey: "remarks", resizable: true},
        {header: "Status", dataKey: "status", resizable: true, sortable: true},
        {
            header: "Actions",
            renderCell: (item, _, idx) => {
                let html = `
                <a href="/goodsissuereportview">
                    <button class="btn btn-primary view">View</button>
                </a>
                <button class="btn btn-primary edit">Edit</button>
                <button class="btn btn-primary delete">Delete</button>
            `;
                return html;
            }, resizable: true
        },

        // New column for Approve and Reject buttons
        {
            header: "Approval",
            renderCell: (item, _, idx) => {
                if (item.status === "Pending") {
                    return `
                    <button class="btn btn-success approve" onclick="handleApprove(${idx})">Approve</button>
                    <button class="btn btn-danger reject" onclick="handleReject(${idx})">Reject</button>
                `;
                }
                return ''; // Return nothing if not "Pending"
            }, resizable: true
        }
    ];

    new TableManager({
        apiEndpoint: "/api/",
        idKey: "goodreceivingnoteId",
        columnConfig: columnConfig,
        confirmMessage: "Are you sure you want to delete this company?",
        errorMessage: "Failed to delete company: ",
        actions: [
            {label: "Edit", type: "url", url: "/companyedit?id={id}"},
            {label: "View", type: "url", url: "/companyview?id={id}"},
            {label: "Delete", type: "api", endpoint: "/api/company/company-delete/{id}"}
        ]
    })
});

/*
let filteredData = [...grnData];

function renderTable(data) {
    if (!window.DynamicTableRenderer) {
        console.error("DynamicTableRenderer is not loaded");
        return;
    }

    const totalRows = data.length;
    if (totalRows === 0) {
        window.DynamicTableRenderer.render([], columnConfig);
        document.getElementById.innerHTML = '';
        return;
    }


    window.DynamicTableRenderer.render(data, columnConfig);

}


function filterData() {
    filteredData = [...grnData];
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;
    const supplier = document.getElementById('supplier').value.trim().toLowerCase();
    const status = document.getElementById('status').value;
    const search = document.getElementById('generalSearch').value.trim().toLowerCase();

    if (dateFrom) {
        filteredData = filteredData.filter(r => r.date >= dateFrom);
    }
    if (dateTo) {
        filteredData = filteredData.filter(r => r.date <= dateTo);
    }

    if (supplier) {
        filteredData = filteredData.filter(r => r.supplier && r.supplier.toLowerCase() === supplier);
    }

    if (status && status !== "Select Status") {
        filteredData = filteredData.filter(r => r.status === status);
    }

    if (search) {
        filteredData = filteredData.filter(r =>
            (r.date && r.date.toLowerCase().includes(search)) ||
            (r.grn && r.grn.toLowerCase().includes(search)) ||
            (r.supplier && r.supplier.toLowerCase().includes(search)) ||
            (r.remarks && r.remarks.toLowerCase().includes(search)) ||
            (r.status && r.status.toLowerCase().includes(search))
        );
    }

    currentPage = 1;
    renderTable(filteredData);
}

// Event listeners
document.querySelector('.custom-btn-search').addEventListener('click', function(e) {
    e.preventDefault();
    filterData();
});
document.getElementById('generalSearch').addEventListener('input', filterData);

document.querySelector('.custom-btn-reset').addEventListener('click', () => {
    document.getElementById('filterDateFrom').value = '';
    document.getElementById('filterDateTo').value = '';
    document.getElementById('supplier').selectedIndex = 0;
    document.getElementById('status').selectedIndex = 0;
    document.getElementById('generalSearch').value = '';
    filteredData = [...grnData];
    renderTable(filteredData);
});

// Initial render
renderTable(filteredData);*/
