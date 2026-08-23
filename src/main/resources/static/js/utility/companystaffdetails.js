/*const staffData = [
    {
        name: "Ram Bahadur",
        type: "Permanent",
        email: "rambahadur@company.com",
        phone: "9876540123",
        branch: "Main Branch",
        department: "HR",
        photo: "https://picsum.photos/200"
    },
    {
        name: "Anita Shrestha",
        type: "Contract",
        email: "anitashrestha@company.com",
        phone: "9876540567",
        branch: "East Branch",
        department: "Marketing",
        photo: "https://picsum.photos/201"
    },
    {
        name: "Suresh Rai",
        type: "Permanent",
        email: "sureshrai@company.com",
        phone: "9876540987",
        branch: "Main Branch",
        department: "IT",
        photo: "https://picsum.photos/202"
    },
    {
        name: "Priya Sharma",
        type: "Temporary",
        email: "priyasharma@company.com",
        phone: "9876540789",
        branch: "West Branch",
        department: "Finance",
        photo: "https://picsum.photos/203"
    },
    {
        name: "Bikash Tamang",
        type: "Permanent",
        email: "bikashtamang@company.com",
        phone: "9876540910",
        branch: "North Branch",
        department: "Operations",
        photo: "https://picsum.photos/204"
    },
    {
        name: "Rina Gurung",
        type: "Contract",
        email: "rinagurung@company.com",
        phone: "9876540345",
        branch: "Main Branch",
        department: "Sales",
        photo: "https://picsum.photos/205"
    },
    {
        name: "Shyam Kumar",
        type: "Permanent",
        email: "shyamkumar@company.com",
        phone: "9876540765",
        branch: "South Branch",
        department: "Customer Support",
        photo: "https://picsum.photos/206"
    },
    {
        name: "Laxmi Adhikari",
        type: "Temporary",
        email: "laxmiadhikari@company.com",
        phone: "9876540321",
        branch: "East Branch",
        department: "HR",
        photo: "https://picsum.photos/207"
    },
    {
        name: "Sanjay Bhattarai",
        type: "Permanent",
        email: "sanjaybhattarai@company.com",
        phone: "9876540654",
        branch: "West Branch",
        department: "Marketing",
        photo: "https://picsum.photos/208"
    },
    {
        name: "Gita Thapa",
        type: "Contract",
        email: "gitathapa@company.com",
        phone: "9876540987",
        branch: "North Branch",
        department: "Finance",
        photo: "https://picsum.photos/209"
    },
];*/

document.addEventListener("DOMContentLoaded", function () {
    const columnConfig = [
        {header: "Name", dataKey: "name", resizable: true, sortable: true},
        {header: "Type", dataKey: "type", resizable: true, sortable: true},
        {header: "Email", dataKey: "email", resizable: true, sortable: true},
        {header: "Phone", dataKey: "phone", resizable: true, sortable: true},
        {header: "Branch", dataKey: "branch", resizable: true, sortable: true},
        {header: "Department", dataKey: "department", resizable: true, sortable: true},
        {
            header: "Photo",
            renderCell: (item) => `<img src="${item.photo}" class="staffimg" alt="photo">`
        },
        {
            header: "Action",
            renderCell: (item, _, idx) => `
            <button class="btn view-btn" data-href="/companystaffview">View</button>
            <button class="btn edit-btn">Edit</button>
            <button class="btn delete-btn">Delete</button>
            <button class="btn view-btn">User</button>
        `
        }
    ];

    new TableManager({
        apiEndpoint: "/api/",
        idKey: "Id",
        columnConfig: columnConfig,
        confirmMessage: "Are you sure you want to delete this user?",
        errorMessage: "Failed to delete user: ",
        actions: [
            {label: "Edit", type: "url", url: "/itemedit?id={id}"},
            {label: "View", type: "url", url: "/itemview?id={id}"},
            {label: "Delete", type: "api", endpoint: "/api/item/item-delete/{id}"}
        ]
    })
});

function renderStaffTable(data) {
    if (!window.DynamicTableRenderer) {
        console.error("DynamicTableRenderer is not loaded");
        return;
    }
    window.DynamicTableRenderer.render(data, staffColumnConfig, "dynamic-data-table");

    setTimeout(() => {
        const rows = document.querySelectorAll("#dynamic-table-body tr");
        rows.forEach(row => attachUserClick(row));

        // Add navigation for View button
        document.querySelectorAll("button.view-btn[data-href]").forEach(btn => {
            btn.addEventListener("click", function () {
                window.location.href = btn.getAttribute("data-href");
            });
        });
    }, 0);
}

function attachUserClick(row) {
    const actionCell = row.querySelector("td:last-child");
    if (!actionCell) return;
    const originalHTML = actionCell.innerHTML;

    const userBtn = actionCell.querySelector("button.view-btn:last-child");
    if (!userBtn) return;

    userBtn.addEventListener("click", () => {
        console.log("User button clicked for row:", row);
        actionCell.innerHTML = `
        <div style="display: flex; flex-direction: row; flex-wrap: wrap; gap: 29px;">
            <label><input type="checkbox" name="permissions"> Request</label>
            <label><input type="checkbox" name="permissions"> Approve</label>
            <label><input type="checkbox" name="permissions"> Purchase</label>
            <label><input type="checkbox" name="permissions"> Users</label>
            <label><input type="checkbox" name="permissions"> Staff</label>
            <label><input type="checkbox" name="permissions"> All</label>
            <button class="view-btn" style="background:#4CAF50;color:#fff;font-weight:bold;padding:6px 22px;border:none;border-radius:5px;">Save</button>
        </div>
        `;
        actionCell.querySelector(".view-btn").addEventListener("click", () => {
            console.log("Save button clicked for row:", row);
            actionCell.innerHTML = originalHTML;
            attachUserClick(row);
        });
    });
}

// Only call this once!
renderStaffTable(staffData);