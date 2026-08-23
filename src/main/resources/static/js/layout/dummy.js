class TableManager {
    constructor(config) {
        // Initialize configuration
        this.apiEndpoint = config.apiEndpoint;
        this.idKey = config.idKey || 'id';
        this.columnConfig = config.columnConfig;
        this.tableSelector = config.tableSelector || '.dynamic-table';
        this.tableHeadSelector = config.tableHeadSelector || '#dynamic-table-head';
        this.tableBodySelector = config.tableBodySelector || '#dynamic-table-body';
        this.confirmMessage = config.confirmMessage || 'Are you sure you want to perform this action?';
        this.errorMessage = config.errorMessage || 'Failed to perform action: ';
        this.dynamicTableHead = document.querySelector(this.tableHeadSelector);
        this.dynamicTableBody = document.querySelector(this.tableBodySelector);
        this.originalData = [];
        this.currentData = [];
        this.currentSort = { col: null, order: 'default' };
        this.isResizing = false;

        // Map legacy properties to actions array for backward compatibility
        this.actions = config.actions || [];
        if (config.editUrl) {
            this.actions.push({ label: 'Edit', type: 'url', url: config.editUrl });
        }
        if (config.viewUrl) {
            this.actions.push({ label: 'View', type: 'url', url: config.viewUrl });
        }
        if (config.deleteEndpoint) {
            this.actions.push({ label: 'Delete', type: 'api', endpoint: config.deleteEndpoint });
        }
        if (config.deleteUrl) {
            this.actions.push({ label: 'Delete Page', type: 'url', url: config.deleteUrl });
        }

        // Update columnConfig to use renderActionsCell for Actions column
        this.columnConfig = this.columnConfig.map(col => {
            if (col.header === 'Actions' && !col.renderCell) {
                return { ...col, renderCell: this.renderActionsCell.bind(this) };
            }
            return col;
        });

        this.init();
    }

    init() {
        if (!this.dynamicTableHead || !this.dynamicTableBody) {
            console.error("Dynamic table head or body not found!");
            return;
        }
        // Render initial table data
        this.renderFromApi();
        // Attach event listeners for actions
        this.attachEventListeners();
    }

    async renderFromApi() {
        try {
            const data = await window.ApiService.get(this.apiEndpoint);
            console.log("✅ Data fetched from API:", data);

            // Handle API response
            if (!Array.isArray(data)) {
                if (Array.isArray(data.data)) {
                    this.renderTable(data.data);
                } else {
                    console.error("❌ API response is not a valid array:", data);
                    this.renderTable([]);
                }
            } else {
                this.renderTable(data);
            }
        } catch (error) {
            console.error("❌ Failed to fetch data for table:", error);
            this.renderTable([]);
        }
    }

    renderTable(dataArray) {
        if (!this.columnConfig || this.columnConfig.length === 0) {
            console.error("No column configuration provided.");
            this.dynamicTableBody.innerHTML = `<tr><td colspan="1" style="text-align:center; padding: 20px;">Table configuration error.</td></tr>`;
            return;
        }

        this.originalData = dataArray.map((item, idx) => ({ item, idx }));
        this.currentData = [...this.originalData];

        this.dynamicTableHead.innerHTML = "";
        this.dynamicTableBody.innerHTML = "";

        // Render header
        const headerRow = document.createElement("tr");
        this.columnConfig.forEach((col, index) => {
            const th = document.createElement("th");
            th.style.position = 'relative';

            if (col.sortable) {
                th.classList.add('sortable');
                th.innerHTML = `${col.header} <span class="sort-indicator">⇄</span>`;
            } else {
                th.textContent = col.header;
            }

            if (col.resizable) {
                const resizer = document.createElement("span");
                resizer.classList.add("resize-handle");
                resizer.title = "Resize column";
                resizer.innerHTML = "⋮";
                th.appendChild(resizer);
            }

            headerRow.appendChild(th);
        });
        this.dynamicTableHead.appendChild(headerRow);

        // Render body
        this.renderBody(dataArray);

        this.attachSorting();
        this.attachResizing();
    }

    renderBody(dataArray) {
        this.dynamicTableBody.innerHTML = "";
        if (dataArray.length === 0) {
            this.dynamicTableBody.innerHTML = `<tr><td colspan="${this.columnConfig.length}" style="text-align:center; padding: 20px;">No data available.</td></tr>`;
            return;
        }

        dataArray.forEach((item, idx) => {
            const row = document.createElement("tr");
            this.columnConfig.forEach((col) => {
                const td = document.createElement("td");
                const cellValue = col.dataKey ? item[col.dataKey] : null;

                if (col.renderCell) {
                    td.innerHTML = col.renderCell(item, cellValue, idx);
                } else {
                    td.textContent = cellValue || "-";
                }
                row.appendChild(td);
            });
            this.dynamicTableBody.appendChild(row);
        });
    }

    renderActionsCell(item) {
        let buttons = '';
        this.actions.forEach(action => {
            const className = action.className || `action-btn ${action.label.toLowerCase().replace(/\s+/g, '-')}-btn`;
            buttons += `<button class="${className}" data-id="${item[this.idKey]}" data-action="${action.label}">${action.label}</button>`;
        });
        return buttons;
    }

    attachEventListeners() {
        this.dynamicTableBody.addEventListener('click', async (e) => {
            const target = e.target;
            if (!target.classList.contains('action-btn')) return;

            const id = target.getAttribute('data-id');
            const actionLabel = target.getAttribute('data-action');
            if (!id || !actionLabel) return;

            const action = this.actions.find(a => a.label === actionLabel);
            if (!action) return;

            if (action.type === 'api') {
                if (!confirm(this.confirmMessage)) return;

                try {
                    const endpoint = action.endpoint.replace('{id}', id);
                    await window.ApiService.delete(endpoint, {}, "application/json", { id });
                    target.closest('tr').remove();
                    await this.renderFromApi(); // Refresh table data
                } catch (err) {
                    alert(this.errorMessage + (err.message || err));
                }
            } else if (action.type === 'url') {
                window.location.href = action.url.replace('{id}', id);
            } else if (action.type === 'custom' && action.handler) {
                action.handler(id, target);
            }
        });
    }

    attachSorting() {
        const headers = this.dynamicTableHead.querySelectorAll('th');
        headers.forEach((th, idx) => {
            if (this.columnConfig[idx].sortable) {
                th.addEventListener('click', (e) => {
                    if (e.target.classList.contains('resize-handle') || this.isResizing) return;

                    if (this.currentSort.col === idx) {
                        this.currentSort.order = this.currentSort.order === 'asc' ? 'desc' : 'asc';
                    } else {
                        this.currentSort = { col: idx, order: 'asc' };
                    }
                    this.sortTable(idx);
                    this.updateSortIndicators();
                });
            }
        });
    }

    attachResizing() {
        const headers = this.dynamicTableHead.querySelectorAll('th');
        let startX, startWidth, resizingTh, resizingIndex;

        headers.forEach((th, index) => {
            if (this.columnConfig[index].resizable) {
                const resizer = th.querySelector('.resize-handle');
                if (resizer) {
                    resizer.addEventListener('mousedown', (e) => {
                        e.stopPropagation();
                        this.isResizing = false;
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

        const resize = (e) => {
            if (resizingTh) {
                this.isResizing = true;
                const diff = e.pageX - startX;
                const newWidth = Math.max(50, startWidth + diff);
                resizingTh.style.width = newWidth + 'px';

                this.dynamicTableBody.querySelectorAll('tr').forEach(row => {
                    const cells = row.querySelectorAll('td');
                    if (cells[resizingIndex]) cells[resizingIndex].style.width = newWidth + 'px';
                });
            }
        };

        const stopResize = () => {
            document.body.style.cursor = '';
            document.removeEventListener('mousemove', resize);
            document.removeEventListener('mouseup', stopResize);
            setTimeout(() => { this.isResizing = false; }, 0);
            resizingTh = null;
        };
    }

    sortTable(colIdx) {
        const key = this.columnConfig[colIdx].dataKey;
        const order = this.currentSort.order;

        this.currentData.sort((aObj, bObj) => {
            let A = aObj.item[key] || '';
            let B = bObj.item[key] || '';

            let dateA = Date.parse(A);
            let dateB = Date.parse(B);
            if (!isNaN(dateA) && !isNaN(dateB)) {
                return order === 'asc'
                    ? dateA - dateB || aObj.idx - bObj.idx
                    : dateB - dateA || aObj.idx - bObj.idx;
            }

            let numA = parseFloat(A.replace(/[^\d.-]/g, ''));
            let numB = parseFloat(B.replace(/[^\d.-]/g, ''));
            if (!isNaN(numA) && !isNaN(numB)) {
                return order === 'asc'
                    ? numA - numB || aObj.idx - bObj.idx
                    : numB - numA || aObj.idx - bObj.idx;
            }

            let comp = A.localeCompare(B);
            return order === 'asc'
                ? (comp !== 0 ? comp : aObj.idx - bObj.idx)
                : (comp !== 0 ? -comp : aObj.idx - bObj.idx);
        });

        this.renderBody(this.currentData.map(o => o.item));
    }

    updateSortIndicators() {
        const headers = this.dynamicTableHead.querySelectorAll('th');
        headers.forEach((th, idx) => {
            const indicator = th.querySelector('.sort-indicator');
            if (indicator) {
                if (this.currentSort.col === idx) {
                    indicator.textContent = this.currentSort.order === 'asc' ? '▲' : '▼';
                } else {
                    indicator.textContent = '⇄';
                }
            }
        });
    }
}
