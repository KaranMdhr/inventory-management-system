/*
const requisitionData = [
    { date: "2025-06-25", code: "0001", requestedBy: "Ram Bahadur", remarks: "Stationery requisition", status: "Approved" },
    { date: "2025-06-24", code: "0002", requestedBy: "Sita Karki", remarks: "New branch setup", status: "Pending" },
    { date: "2025-06-23", code: "0003", requestedBy: "Bikash Thapa", remarks: "Annual upgrade", status: "Rejected" },
    { date: "2025-06-22", code: "0004", requestedBy: "Anita Shrestha", remarks: "Health initiative", status: "Approved" },
    { date: "2025-06-21", code: "0005", requestedBy: "Prakash Lama", remarks: "New hires", status: "Pending" },
    { date: "2025-06-20", code: "0006", requestedBy: "Sunita Maharjan", remarks: "Stock replenishment", status: "Approved" },
    { date: "2025-06-19", code: "0007", requestedBy: "Kiran Gurung", remarks: "For new employees", status: "Pending" },
    { date: "2025-06-18", code: "0008", requestedBy: "Nirmala Rai", remarks: "Office improvement", status: "Approved" },
    { date: "2025-06-17", code: "0009", requestedBy: "Manish Singh", remarks: "Stationery", status: "Rejected" },
    { date: "2025-06-16", code: "0010", requestedBy: "Rita Khadka", remarks: "Monthly supply", status: "Approved" },
    { date: "2025-06-15", code: "0011", requestedBy: "Suman Shahi", remarks: "Conference room", status: "Pending" },
    { date: "2025-06-14", code: "0012", requestedBy: "Mina Joshi", remarks: "Meeting rooms", status: "Approved" },
    { date: "2025-06-13", code: "0013", requestedBy: "Dipesh Bista", remarks: "Field work", status: "Rejected" },
    { date: "2025-06-12", code: "0014", requestedBy: "Kabita Magar", remarks: "Network upgrade", status: "Approved" },
    { date: "2025-06-11", code: "0015", requestedBy: "Ramesh Chaudhary", remarks: "Document archiving", status: "Pending" },
    { date: "2025-06-10", code: "0016", requestedBy: "Sabina Yadav", remarks: "Office supplies", status: "Approved" },
    { date: "2025-06-09", code: "0017", requestedBy: "Rajendra Poudel", remarks: "Budget review", status: "Rejected" },
    { date: "2025-06-08", code: "0018", requestedBy: "Asmita Adhikari", remarks: "Petty cash", status: "Approved" },
    { date: "2025-06-07", code: "0019", requestedBy: "Bimal Basnet", remarks: "Snacks", status: "Pending" },
    { date: "2025-06-06", code: "0020", requestedBy: "Laxmi Sharma", remarks: "Miscellaneous", status: "Approved" }
];
*/
document.addEventListener("DOMContentLoaded", function () {
const columnConfig = [
    { header: "Date", dataKey: "date",resizable: true, sortable: true },
    { header: "Number", dataKey: "code",resizable: true, sortable: true },
    { header: "Requested By", dataKey: "requestedBy",resizable: true, sortable: true },
    { header: "Remarks", dataKey: "remarks",resizable: true },
    { header: "Status", dataKey: "status",resizable: true, sortable: true },
    {header: "Actions", resizable: true},

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
        },resizable: true
    }
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
let filteredData = [...requisitionData];

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
    filteredData = [...requisitionData];
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;
    const requestedBy = document.getElementById('requestedBy').value.trim().toLowerCase();
    const status = document.getElementById('status').value;
    const search = document.getElementById('generalSearch').value.trim().toLowerCase();

    if (dateFrom) {
        filteredData = filteredData.filter(r => r.date >= dateFrom);
    }
    if (dateTo) {
        filteredData = filteredData.filter(r => r.date <= dateTo);
    }

    if (requestedBy) {
        filteredData = filteredData.filter(r => r.requestedBy && r.requestedBy.toLowerCase() === requestedBy);
    }

    if (status && status !== "Select Status") {
        filteredData = filteredData.filter(r => r.status === status);
    }

    if (search) {
        filteredData = filteredData.filter(r =>
            (r.date && r.date.toLowerCase().includes(search)) ||
            (r.code && r.code.toLowerCase().includes(search)) ||
            (r.requestedBy && r.requestedBy.toLowerCase().includes(search)) ||
            (r.remarks && r.remarks.toLowerCase().includes(search)) ||
            (r.status && r.status.toLowerCase().includes(search))
        );
    }

    renderTable(filteredData);
}

// Event listeners
document.querySelector('.custom-btn-search').addEventListener('click', function (e) {
    e.preventDefault();
    filterData();
});
document.getElementById('generalSearch').addEventListener('input', filterData);

document.querySelector('.custom-btn-reset').addEventListener('click', () => {
    document.getElementById('filterDateFrom').value = '';
    document.getElementById('filterDateTo').value = '';
    document.getElementById('requestedBy').selectedIndex = 0;
    document.getElementById('status').selectedIndex = 0;
    document.getElementById('generalSearch').value = '';
    filteredData = [...requisitionData];
    renderTable(filteredData);
});

// Initial render
renderTable(filteredData);
*/
