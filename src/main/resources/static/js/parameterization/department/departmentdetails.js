document.addEventListener("DOMContentLoaded", function () {
    const columnConfig = [
        { header: "Code", dataKey: "departmentCode", resizable: true },
        { header: "Name", dataKey: "departmentName", sortable: true, resizable: true },
        { header: "Actions" },
    ];

    new TableManager({
        apiEndpoint: "/api/department/department-list",
        idKey: "departmentId",
        columnConfig: columnConfig,
        confirmMessage: "Are you sure you want to delete this department?",
        errorMessage: "Failed to delete department: ",
        actions: [
            { label: "Edit", type: "url", url: "/departmentedit?id={id}" },
            // { label: "View", type: "url", url: "/departmentview?id={id}" },
            { label: "Delete", type: "api", endpoint: "/api/department/delete/{id}" }
        ]
    });
});







