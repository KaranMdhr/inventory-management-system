// const girData = [
//     { date: "2025-06-25", grn: "0001", branch: "Kathmandu", requestedTo: "John Doe", remarks: "All items checked", status: "Approved" },
//     { date: "2025-06-24", grn: "0002", branch: "Pokhara", requestedTo: "Jane Smith", remarks: "Awaiting inspection", status: "Pending" },
//     { date: "2025-06-23", grn: "0003", branch: "Biratnagar", requestedTo: "Michael Brown", remarks: "Damaged items", status: "Rejected" },
//     { date: "2025-06-22", grn: "0004", branch: "Kathmandu", requestedTo: "John Doe", remarks: "Delivered on time", status: "Approved" },
//     { date: "2025-06-21", grn: "0005", branch: "Pokhara", requestedTo: "Jane Smith", remarks: "Partial delivery", status: "Pending" },
//     { date: "2025-06-20", grn: "0006", branch: "Biratnagar", requestedTo: "Sita Sharma", remarks: "All good", status: "Approved" },
//     { date: "2025-06-19", grn: "0007", branch: "Kathmandu", requestedTo: "Ram Bahadur", remarks: "More items to come", status: "Pending" },
//     { date: "2025-06-18", grn: "0008", branch: "Pokhara", requestedTo: "Hari Prasad", remarks: "Safe delivery", status: "Approved" },
//     { date: "2025-06-17", grn: "0009", branch: "Biratnagar", requestedTo: "Anita Karki", remarks: "Damaged item", status: "Rejected" },
//     { date: "2025-06-16", grn: "0010", branch: "Kathmandu", requestedTo: "Bikash Thapa", remarks: "All good", status: "Approved" },
//     { date: "2025-06-15", grn: "0011", branch: "Pokhara", requestedTo: "Dinesh Shrestha", remarks: "Awaiting inspection", status: "Pending" },
//     { date: "2025-06-14", grn: "0012", branch: "Biratnagar", requestedTo: "Rita Lama", remarks: "All items fine", status: "Approved" },
//     { date: "2025-06-13", grn: "0013", branch: "Kathmandu", requestedTo: "Suman Gurung", remarks: "Expired items", status: "Rejected" },
//     { date: "2025-06-12", grn: "0014", branch: "Pokhara", requestedTo: "Kiran KC", remarks: "All good", status: "Approved" },
//     { date: "2025-06-11", grn: "0015", branch: "Biratnagar", requestedTo: "Manish Yadav", remarks: "More items to come", status: "Pending" },
//     { date: "2025-06-10", grn: "0016", branch: "Kathmandu", requestedTo: "Sunita Rai", remarks: "All good", status: "Approved" },
//     { date: "2025-06-09", grn: "0017", branch: "Pokhara", requestedTo: "Prakash Adhikari", remarks: "Damaged item", status: "Rejected" },
//     { date: "2025-06-08", grn: "0018", branch: "Biratnagar", requestedTo: "Mina Shrestha", remarks: "All items fine", status: "Approved" },
//     { date: "2025-06-07", grn: "0019", branch: "Kathmandu", requestedTo: "Ramesh Bista", remarks: "Awaiting inspection", status: "Pending" },
//     { date: "2025-06-06", grn: "0020", branch: "Pokhara", requestedTo: "Sujata Basnet", remarks: "All good", status: "Approved" }
// ];
document.addEventListener("DOMContentLoaded", function () {
    const columnConfig = [
        {header: "Date", dataKey: "date", resizable: true, sortable: true},
        {header: "GRN", dataKey: "grn", resizable: true, sortable: true},
        {header: "Branch", dataKey: "branch", resizable: true, sortable: true},
        {header: "Requested To", dataKey: "requestedTo", resizable: true, sortable: true},
        {header: "Remarks", dataKey: "remarks", resizable: true},
        {header: "Status", dataKey: "status", resizable: true, sortable: true},
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
            }, resizable: true
        }
    ];

    new TableManager({
        apiEndpoint: "/api/",
        idKey: "goodissuereportId",
        columnConfig: columnConfig,
        confirmMessage: "Are you sure you want to delete this report?",
        errorMessage: "Failed to delete report: ",
        actions: [
            {label: "Edit", type: "url", url: "/?id={id}"},
            {label: "View", type: "url", url: "/?id={id}"},
            {label: "Delete", type: "api", endpoint: "/api"}
        ]
    })



});

let filteredData

function filterData() {
    filteredData

    const dateFrom = document.getElementById('filterDateFrom').value;
    const dateTo = document.getElementById('filterDateTo').value;
    const branch = document.getElementById('branch').value;
    const issuedTo = document.getElementById('issuedTo').value.trim().toLowerCase();
    const status = document.getElementById('status').value;
    const search = document.getElementById('generalSearch').value.trim().toLowerCase();

    if (dateFrom) filteredData = filteredData.filter(r => r.date >= dateFrom);
    if (dateTo) filteredData = filteredData.filter(r => r.date <= dateTo);
    if (branch && branch !== "") filteredData = filteredData.filter(r => r.branch === branch);
    if (issuedTo) filteredData = filteredData.filter(r => r.requestedTo && r.requestedTo.toLowerCase() === issuedTo);
    if (status && status !== "Select Status" && status !== "") filteredData = filteredData.filter(r => r.status === status);
    if (search) {
        filteredData = filteredData.filter(r =>
            (r.date && r.date.toLowerCase().includes(search)) ||
            (r.grn && r.grn.toLowerCase().includes(search)) ||
            (r.branch && r.branch.toLowerCase().includes(search)) ||
            (r.requestedTo && r.requestedTo.toLowerCase().includes(search)) ||
            (r.remarks && r.remarks.toLowerCase().includes(search)) ||
            (r.status && r.status.toLowerCase().includes(search))
        );
    }

    renderTable(filteredData);
}
/*
let filteredData = [...girData];

function renderTable(data) {
    if (!window.DynamicTableRenderer) {
        console.error("DynamicTableRenderer is not loaded");
        return;
    }

    if (data.length === 0) {
        window.DynamicTableRenderer.renderFromApi("/api/good-issue-reports", columnConfig);
    } else {
        window.DynamicTableRenderer.render(data, columnConfig);
    }

}



document.querySelector('.custom-btn-search').addEventListener('click', function (e) {
    e.preventDefault();
    filterData();
});

document.getElementById('generalSearch').addEventListener('input', filterData);

document.querySelector('.custom-btn-reset').addEventListener('click', () => {
    document.getElementById('filterDateFrom').value = '';
    document.getElementById('filterDateTo').value = '';
    document.getElementById('branch').selectedIndex = 0;
    document.getElementById('issuedTo').value = '';
    document.getElementById('status').selectedIndex = 0;
    document.getElementById('generalSearch').value = '';
    filteredData = [...girData];
    renderTable(filteredData);
});

renderTable(filteredData);*/
