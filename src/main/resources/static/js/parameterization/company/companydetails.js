document.addEventListener("DOMContentLoaded", function () {
const columnConfig = [
    { header: "Company Code", dataKey: "code" },
    { header: "Type", dataKey: "type" },
    { header: "Name", dataKey: "name" },
    { header: "Address", dataKey: "address" },
    { header: "Mobile", dataKey: "mobile" },
    { header: "Email", dataKey: "email" },
    { header: "Status", dataKey: "status" },
    { header: "Actions",},
];

new TableManager({
    apiEndpoint: "/api/company/company-list",
    idKey: "companyId",
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
