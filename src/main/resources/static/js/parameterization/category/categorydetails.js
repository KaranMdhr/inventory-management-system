document.addEventListener("DOMContentLoaded", function () {
    const columnConfig = [
        {header: "Category Name", dataKey: "categoryName"},
        {
            header: "Category Type", renderCell: item => item.categoryTypeId ? item.categoryTypeId.categoryname : "-"
        },
        {header: "Category Code", dataKey: "categoryCode"},
        {
            header: "Actions",
          },
    ];


    new TableManager({
        apiEndpoint: "/api/category/category-list",
        idKey: "categoryId",
        columnConfig: columnConfig,
        confirmMessage: "Are you sure you want to delete this category?",
        errorMessage: "Failed to delete category: ",
        actions: [
            {label: "Edit", type: "url", url: "/categoryedit?id={id}"},
            {label: "Delete", type: "api", endpoint: "/api/category/category-delete/{id}"}
        ]
    });
});

