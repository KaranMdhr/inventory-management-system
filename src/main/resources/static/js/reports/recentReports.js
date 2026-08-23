/*const reportData = [
    { date: "2025-06-25", type: "Requisition Form", code: "0001", requestedBy: "Ram Bahadur", remarks: "Stationery requisition", status: "Approved" },
    { date: "2025-06-24", type: "Purchase Order", code: "0002", requestedBy: "Sita Karki", remarks: "New branch setup", status: "Pending" },
    { date: "2025-06-23", type: "Good Receiving", code: "0003", requestedBy: "Bikash Thapa", remarks: "Annual upgrade", status: "Rejected" },
    { date: "2025-06-22", type: "Good Issue", code: "0004", requestedBy: "Anita Shrestha", remarks: "Health initiative", status: "Approved" },
    { date: "2025-06-18", type: "Purchase Order", code: "0005", requestedBy: "Prakash Lama", remarks: "Conference room", status: "Pending" },
    { date: "2025-06-16", type: "Good Issue", code: "0006", requestedBy: "Sunita Maharjan", remarks: "Document storage", status: "Approved" },
    { date: "2025-06-15", type: "Other", code: "0007", requestedBy: "Kiran Gurung", remarks: "Miscellaneous", status: "Approved" },
    { date: "2025-06-14", type: "Other", code: "0008", requestedBy: "Nirmala Rai", remarks: "Other expense", status: "Pending" },
    { date: "2025-06-13", type: "Other", code: "0009", requestedBy: "Manish Singh", remarks: "Office supplies", status: "Approved" },
    { date: "2025-06-12", type: "Other", code: "0010", requestedBy: "Rita Khadka", remarks: "Maintenance", status: "Rejected" },
    { date: "2025-06-11", type: "Other", code: "0011", requestedBy: "Suman Shahi", remarks: "Miscellaneous", status: "Pending" },
    { date: "2025-06-10", type: "Other", code: "0012", requestedBy: "Mina Joshi", remarks: "Other expense", status: "Approved" },
    { date: "2025-06-09", type: "Other", code: "0013", requestedBy: "Dipesh Bista", remarks: "Miscellaneous", status: "Approved" },
    { date: "2025-06-08", type: "Other", code: "0014", requestedBy: "Kabita Magar", remarks: "Office supplies", status: "Pending" },
    { date: "2025-06-07", type: "Other", code: "0015", requestedBy: "Ramesh Chaudhary", remarks: "Maintenance", status: "Rejected" },
    { date: "2025-06-06", type: "Other", code: "0016", requestedBy: "Sabina Yadav", remarks: "Other expense", status: "Approved" },
    { date: "2025-06-05", type: "Other", code: "0017", requestedBy: "Rajendra Poudel", remarks: "Miscellaneous", status: "Pending" },
    { date: "2025-06-04", type: "Other", code: "0018", requestedBy: "Asmita Adhikari", remarks: "Office supplies", status: "Approved" },
    { date: "2025-06-03", type: "Other", code: "0019", requestedBy: "Bimal Basnet", remarks: "Maintenance", status: "Rejected" },
    { date: "2025-06-02", type: "Other", code: "0020", requestedBy: "Laxmi Sharma", remarks: "Other expense", status: "Approved" },
    { date: "2025-06-01", type: "Other", code: "0021", requestedBy: "Bikram Shrestha", remarks: "Miscellaneous", status: "Pending" },
    { date: "2025-05-31", type: "Other", code: "0022", requestedBy: "Sushila Lama", remarks: "Other expense", status: "Approved" },
    { date: "2025-05-30", type: "Other", code: "0023", requestedBy: "Nabin Gurung", remarks: "Office supplies", status: "Rejected" },
    { date: "2025-05-29", type: "Other", code: "0024", requestedBy: "Saraswati Rai", remarks: "Maintenance", status: "Approved" },
    { date: "2025-05-28", type: "Other", code: "0025", requestedBy: "Ramesh Basnet", remarks: "Miscellaneous", status: "Pending" },
    { date: "2025-05-27", type: "Other", code: "0026", requestedBy: "Sita Magar", remarks: "Other expense", status: "Approved" },
    { date: "2025-05-26", type: "Other", code: "0027", requestedBy: "Keshav Poudel", remarks: "Office supplies", status: "Rejected" },
    { date: "2025-05-25", type: "Other", code: "0028", requestedBy: "Manju Sharma", remarks: "Maintenance", status: "Approved" },
    { date: "2025-05-24", type: "Other", code: "0029", requestedBy: "Bishal Thapa", remarks: "Miscellaneous", status: "Pending" },
    { date: "2025-05-23", type: "Other", code: "0030", requestedBy: "Rina Shrestha", remarks: "Other expense", status: "Approved" }
];*/

document.addEventListener("DOMContentLoaded", function () {
    const columnConfig = [
        {header: "Date", dataKey: "date", resizable: true, sortable: true},
        {header: "Form Type", dataKey: "type", resizable: true, sortable: true},
        {header: "Code", dataKey: "code", resizable: true, sortable: true},
        {header: "Requested By", dataKey: "requestedBy", resizable: true, sortable: true},
        {header: "Remarks", dataKey: "remarks", resizable: true},
        {header: "Status", dataKey: "status", resizable: true, sortable: true},

        // Actions column with View, Edit, Delete buttons
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
let filteredData = [...reportData];

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
    filteredData = [...reportData];
    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;
    const type = document.getElementById('formType').value;
    const requestedBy = document.getElementById('requestedBy').value.trim().toLowerCase();
    const status = document.getElementById('status').value;
    const search = document.getElementById('generalSearch').value.trim().toLowerCase();

    if (dateFrom) {
        filteredData = filteredData.filter(r => r.date >= dateFrom);
    }
    if (dateTo) {
        filteredData = filteredData.filter(r => r.date <= dateTo);
    }

    if (type && type !== "Select Type") {
        filteredData = filteredData.filter(r => r.type === type);
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
            (r.type && r.type.toLowerCase().includes(search)) ||
            (r.code && r.code.toLowerCase().includes(search)) ||
            (r.requestedBy && r.requestedBy.toLowerCase().includes(search)) ||
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
    document.getElementById('formType').selectedIndex = 0;
    document.getElementById('requestedBy').selectedIndex = 0;
    document.getElementById('status').selectedIndex = 0;
    document.getElementById('generalSearch').value = '';
    filteredData = [...reportData];
    renderTable(filteredData);
});

// Initial render
renderTable(filteredData);