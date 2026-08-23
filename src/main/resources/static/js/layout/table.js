(function () {
    const dynamicTableHead = document.getElementById("dynamic-table-head");
    const dynamicTableBody = document.getElementById("dynamic-table-body");

    let originalData = [];
    let currentData = [];
    let currentSort = { col: null, order: 'default' };

    // Track resize intent
    let isResizing = false;

    function renderDynamicTable(dataArray, columnConfig) {
        if (!dynamicTableHead || !dynamicTableBody) {
            console.error("Dynamic table head or body not found!");
            return;
        }

        if (!columnConfig || columnConfig.length === 0) {
            console.error("No column configuration provided.");
            dynamicTableBody.innerHTML = `<tr><td colspan="1" style="text-align:center; padding: 20px;">Table configuration error.</td></tr>`;
            return;
        }

        originalData = dataArray.map((item, idx) => ({ item, idx }));
        currentData = [...originalData];

        dynamicTableHead.innerHTML = "";
        dynamicTableBody.innerHTML = "";

        // Render header
        const headerRow = document.createElement("tr");
        columnConfig.forEach((col, index) => {
            const th = document.createElement("th");
            th.style.position = 'relative';

            // Sortable
            if (col.sortable) {
                th.classList.add('sortable');
                th.innerHTML = `${col.header} <span class="sort-indicator">⇄</span>`;
            } else {
                th.textContent = col.header;
            }

            // Resizable
            if (col.resizable) {
                const resizer = document.createElement("span");
                resizer.classList.add("resize-handle");
                resizer.title = "Resize column";
                resizer.innerHTML = "⋮";
                th.appendChild(resizer);
            }

            headerRow.appendChild(th);
        });
        dynamicTableHead.appendChild(headerRow);

        // Render body rows
        if (dataArray.length === 0) {
            dynamicTableBody.innerHTML = `<tr><td colspan="${columnConfig.length}" style="text-align:center; padding: 20px;">No data available.</td></tr>`;
        } else {
            dataArray.forEach((item, idx) => {
                const row = document.createElement("tr");
                columnConfig.forEach((col) => {
                    const td = document.createElement("td");
                    const cellValue = col.dataKey ? item[col.dataKey] : null;

                    if (col.renderCell) {
                        td.innerHTML = col.renderCell(item, cellValue, idx);
                    } else {
                        td.textContent = cellValue || "-";
                    }
                    row.appendChild(td);
                });
                dynamicTableBody.appendChild(row);
            });
        }

        attachSorting(columnConfig);
        attachResizing(columnConfig);
    }

    function attachSorting(columnConfig) {
        const headers = dynamicTableHead.querySelectorAll('th');

        headers.forEach((th, idx) => {
            if (columnConfig[idx].sortable) {
                th.addEventListener('click', (e) => {
                    if (e.target.classList.contains('resize-handle') || isResizing) {
                        return;
                    }

                    // Toggle between ascending and descending
                    if (currentSort.col === idx) {
                        currentSort.order = currentSort.order === 'asc' ? 'desc' : 'asc';
                    } else {
                        currentSort = { col: idx, order: 'asc' };
                    }
                    sortTable(idx, columnConfig);
                    updateSortIndicators();
                });
            }
        });
    }

    function attachResizing(columnConfig) {
        const headers = dynamicTableHead.querySelectorAll('th');
        let startX, startWidth, resizingTh, resizingIndex;

        headers.forEach((th, index) => {
            if (columnConfig[index].resizable) {
                const resizer = th.querySelector('.resize-handle');
                if (resizer) {
                    resizer.addEventListener('mousedown', (e) => {
                        e.stopPropagation();
                        isResizing = false;
                        resizingTh = th;
                        resizingIndex = index;
                        startX = e.pageX;
                        startWidth = th.offsetWidth;
                        document.body.style.cursor = 'col-resize';
                        document.addEventListener('mousemove', resize);
                        document.addEventListener('mouseup', stopResize);
                    });
                }
            }
        });

        function resize(e) {
            if (resizingTh) {
                isResizing = true;
                const diff = e.pageX - startX;
                const newWidth = Math.max(50, startWidth + diff);
                resizingTh.style.width = newWidth + 'px';

                // Apply to all rows in body
                dynamicTableBody.querySelectorAll('tr').forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells[resizingIndex]) cells[resizingIndex].style.width = newWidth + 'px';
                });
            }
        }

        function stopResize() {
            document.body.style.cursor = '';
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
            // Prevent accidental click after mouseup from triggering sorting
            setTimeout(() => { isResizing = false; }, 0);
            resizingTh = null;
        }
    }

    function sortTable(colIdx, columnConfig) {
        const key = columnConfig[colIdx].dataKey;
        const order = currentSort.order;

        currentData.sort((aObj, bObj) => {
            let A = aObj.item[key] || '';
            let B = bObj.item[key] || '';

            // Date sort
            let dateA = Date.parse(A);
            let dateB = Date.parse(B);
            if (!isNaN(dateA) && !isNaN(dateB)) {
                return order === 'asc'
                    ? dateA - dateB || aObj.idx - bObj.idx
                    : dateB - dateA || aObj.idx - bObj.idx;
            }

            // Numeric sort
            let numA = parseFloat(A.replace(/[^\d.-]/g, ''));
            let numB = parseFloat(B.replace(/[^\d.-]/g, ''));
            if (!isNaN(numA) && !isNaN(numB)) {
                return order === 'asc'
                    ? numA - numB || aObj.idx - bObj.idx
                    : numB - numA || aObj.idx - bObj.idx;
            }

            // String
            let comp = A.localeCompare(B);
            return order === 'asc'
                ? (comp !== 0 ? comp : aObj.idx - bObj.idx)
                : (comp !== 0 ? -comp : aObj.idx - bObj.idx);
        });

        renderBody(currentData.map(o => o.item), columnConfig);
    }

    function renderBody(dataArray, columnConfig) {
        dynamicTableBody.innerHTML = "";
        dataArray.forEach((item, idx) => {
            const row = document.createElement("tr");
            columnConfig.forEach((col) => {
                const td = document.createElement("td");
                const cellValue = col.dataKey ? item[col.dataKey] : null;

                if (col.renderCell) {
                    td.innerHTML = col.renderCell(item, cellValue, idx);
                } else {
                    td.textContent = cellValue || "-";
                }
                row.appendChild(td);
            });
            dynamicTableBody.appendChild(row);
        });
    }

    function renderFromApi(apiUrl, columnConfig) {
        window.ApiService.get(apiUrl)
            .then(data => {
                console.log("✅ Data fetched from API:", data);

                // If response has a wrapper like { data: [...] }, unwrap it
                if (!Array.isArray(data)) {
                    if (Array.isArray(data.data)) {
                        data = data.data;
                    } else {
                        console.error("❌ API response is not a valid array:", data);
                        renderDynamicTable([], columnConfig);
                        return;
                    }
                }

                renderDynamicTable(data, columnConfig);
            })
            .catch(error => {
                console.error("❌ Failed to fetch data for table:", error);
                renderDynamicTable([], columnConfig);
            });
    }

    dynamicTableBody.addEventListener('click', async function (e) {
        if (e.target.classList.contains('delete-btn')) {
            const id = e.target.getAttribute('data-id');
            if (!id) return;

            // OPTIONAL: confirm
            if (!confirm("Are you sure you want to delete this item?")) return;

            try {
                await window.ApiService.delete('', {}, "application/json", { id });
                // Optionally show a success message here

                // Remove the row visually (or reload table)
                e.target.closest('tr').remove();
                // OR, re-fetch/re-render data as needed
            } catch (err) {
                alert("Failed to delete: " + (err.message || err));
            }
        }
    });

    function updateSortIndicators() {
        const headers = dynamicTableHead.querySelectorAll('th');
        headers.forEach((th, idx) => {
            const indicator = th.querySelector('.sort-indicator');
            if (currentSort.col === idx) {
                indicator.textContent = currentSort.order === 'asc' ? '▲' : '▼';
            } else {
                indicator.textContent = '▲';
            }
        });
    }

    // Expose globally
    window.DynamicTableRenderer = {
        render: renderDynamicTable,
        renderFromApi: renderFromApi
    };
})();