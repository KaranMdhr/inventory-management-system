/*const purchaseOrderData = [
    { date: "2025-06-25", code: "0001", supplier: "Shrestha Suppliers", requestedBy: "Ram Bahadur", remarks: "Office stationery", status: "Pending" },
    { date: "2025-06-24", code: "0002", supplier: "Himalayan Traders", requestedBy: "Sita Karki", remarks: "IT equipment", status: "Transit" },
    { date: "2025-06-23", code: "0003", supplier: "Everest Distributors", requestedBy: "Bikash Thapa", remarks: "Furniture", status: "Delivered" },
    { date: "2025-06-22", code: "0004", supplier: "Kathmandu Goods", requestedBy: "Anita Shrestha", remarks: "Cleaning materials", status: "Pending" },
    { date: "2025-06-21", code: "0005", supplier: "Sagarmatha Enterprises", requestedBy: "Prakash Lama", remarks: "Cafeteria stock", status: "Transit" },
    { date: "2025-06-20", code: "0006", supplier: "Pokhara Logistics", requestedBy: "Sunita Maharjan", remarks: "Stationery", status: "Delivered" },
    { date: "2025-06-19", code: "0007", supplier: "Lumbini Wholesale", requestedBy: "Kiran Gurung", remarks: "Printer ink", status: "Pending" },
    { date: "2025-06-18", code: "0008", supplier: "Biratnagar Supplies", requestedBy: "Nirmala Rai", remarks: "Safety gear", status: "Transit" },
    { date: "2025-06-17", code: "0009", supplier: "Janakpur Products", requestedBy: "Manish Singh", remarks: "Projector", status: "Delivered" },
    { date: "2025-06-16", code: "0010", supplier: "Butwal Goods", requestedBy: "Rita Khadka", remarks: "Desks", status: "Pending" },
    { date: "2025-06-15", code: "0011", supplier: "Dharan Mart", requestedBy: "Suman Shahi", remarks: "Monitors", status: "Transit" },
    { date: "2025-06-14", code: "0012", supplier: "Bhaktapur Suppliers", requestedBy: "Mina Joshi", remarks: "Cables", status: "Delivered" },
    { date: "2025-06-13", code: "0013", supplier: "Nepalgunj Traders", requestedBy: "Dipesh Bista", remarks: "Chairs", status: "Pending" },
    { date: "2025-06-12", code: "0014", supplier: "Hetauda Goods", requestedBy: "Kabita Magar", remarks: "Tables", status: "Transit" },
    { date: "2025-06-11", code: "0015", supplier: "Dhangadhi Inc", requestedBy: "Ramesh Chaudhary", remarks: "Whiteboards", status: "Delivered" },
    { date: "2025-06-10", code: "0016", supplier: "Birgunj Logistics", requestedBy: "Sabina Yadav", remarks: "Markers", status: "Pending" },
    { date: "2025-06-09", code: "0017", supplier: "Gorkha Wholesale", requestedBy: "Rajendra Poudel", remarks: "Paper", status: "Transit" },
    { date: "2025-06-08", code: "0018", supplier: "Chitwan Supplies", requestedBy: "Asmita Adhikari", remarks: "Binders", status: "Delivered" },
    { date: "2025-06-07", code: "0019", supplier: "Makwanpur Corp", requestedBy: "Bimal Basnet", remarks: "Folders", status: "Pending" },
    { date: "2025-06-06", code: "0020", supplier: "Jhapa Goods", requestedBy: "Laxmi Sharma", remarks: "Pens", status: "Transit" }
];*/

document.addEventListener("DOMContentLoaded", function () {
    const columnConfig = [
        {header: "Date", dataKey: "date", resizable: true, sortable: true},
        {header: "Number", dataKey: "code", resizable: true, sortable: true},
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
        idKey: "",
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
let filteredData = [...purchaseOrderData];

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

function filterData() {
    filteredData = [...purchaseOrderData];
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
            (r.code && r.code.toLowerCase().includes(search)) ||
            (r.supplier && r.supplier.toLowerCase().includes(search)) ||
            (r.remarks && r.remarks.toLowerCase().includes(search)) ||
            (r.status && r.status.toLowerCase().includes(search))
        );
    }

    renderTable(filteredData);
}

document.querySelector('.custom-btn-search').addEventListener('click', function (e) {
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
    filteredData = [...purchaseOrderData];
    renderTable(filteredData);
});

renderTable(filteredData);
*/
