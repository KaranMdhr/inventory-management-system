/*const stockData = [
    { category: "furniture", in: 20, out: 100, balance: 80 },
    { category: "plate", in: 15, out: 50, balance: 35 },
    { category: "Wash Cloth", in: 10, out: 30, balance: 20 },
    { category: "glass", in: 5, out: 25, balance: 20 },
    // add more rows as needed
];*/
document.addEventListener("DOMContentLoaded", function () {
const columnConfig = [
    { header: "Category Name", dataKey: "category",resizable: true, sortable: true, renderCell: item => `<a href="stock_detail?category=${encodeURIComponent(item.category)}">${item.category}</a>` },
    { header: "IN", dataKey: "in" ,resizable: true, },
    { header: "OUT", dataKey: "out" ,resizable: true},
    { header: "Balance", dataKey: "balance" ,resizable: true},
    { header: "Actions",resizable: true, renderCell: () => `<button class="btn btn-primary view">View</button>` }
];
    new TableManager({
        apiEndpoint: "/api",
        idKey: "Id",
        columnConfig: columnConfig,
        confirmMessage: "Are you sure you want to delete this ?",
        errorMessage: "Failed to delete     : ",
        actions: [

            {label: "View", type: "url", url: "?id={id}"},

        ]
    })

});
/*let filteredData = [...stockData];

function renderTable(data) {
    if (!window.DynamicTableRenderer) {
        console.error("DynamicTableRenderer is not loaded");
        return;
    }

    const totalRows = data.length;
    if (totalRows === 0) {
        window.DynamicTableRenderer.render([], columnConfig);
        document.getElementById('pagination').innerHTML = '';
        return;
    }

    window.DynamicTableRenderer.render(data, columnConfig);
}


// Initial render
renderTable(filteredData);*/
