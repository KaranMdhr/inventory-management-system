document.addEventListener("DOMContentLoaded", function () {
    const columnConfig = [
        { header: "Branch Code", dataKey: "branchCode", resizable: true},
        { header: "Name", dataKey: "branchName", resizable: true },
        { header: "Address", dataKey: "branchAddress", resizable: true },
        { header: "Mobile", dataKey: "branchPhone", resizable: true },
        { header: "Email", dataKey: "branchEmail", resizable: true },
        { header: "Actions",},
    ];

    new TableManager({
        apiEndpoint: "/api/branch/branch-list",
        idKey: "branchId",
        columnConfig: columnConfig,
        confirmMessage: "Are you sure you want to delete this branch?",
        errorMessage: "Failed to delete branch: ",
        actions: [
            {label: "Edit", type: "url", url: "/branchedit?id={id}"},
            {label: "View", type: "url", url: "/branchview?id={id}"},
            {label: "Delete", type: "api", endpoint: "/api/branch/branch-delete/{id}"}
        ]
    });

});


