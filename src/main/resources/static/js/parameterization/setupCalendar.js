document.addEventListener("DOMContentLoaded", function () {
    const columnConfig = [
        {header: "SN", renderCell: (item, _, idx) => idx + 1},
        {header: "Year", dataKey: "year"},
        {header: "AD Date", dataKey: "adDate"},
        {header: "BS Date", dataKey: "bsDate"},
        {header: "Fiscal Year (BS)", dataKey: "nepaliFiscalYear"},
        {header: "Fiscal Year (AD)", dataKey: "englishFiscalYear"},
        {header: "Days of Holidays", dataKey: "holidayCount"},
        {header: "Status", dataKey: "display"},
        {
            header: "Actions",
            renderCell: (item) => `
            <div class="action-buttons">
                <button class="delete-btn" data-year="${item.bsDate ? item.bsDate.substring(0, 4) : ''}">&#10060; DELETE</button>
            </div>
        `
        },
    ];

    new TableManager({
        apiEndpoint: "/api/calender/calender-list",
        idKey: "calenderId",
        columnConfig: columnConfig,
        confirmMessage: "Are you sure you want to delete this calender?",
        errorMessage: "Failed to delete calender: ",
        actions: [
            // {label: "Edit", type: "url", url: "/companyedit?id={id}"},
            // {label: "View", type: "url", url: "/calenderview?id={id}"},
            {label: "Delete", type: "api", endpoint: "/api/calender/calender-delete/{id}"}
        ]
    })
});


const rowsPerPage = 10;
let currentPage = 1;

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

    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedData = data.slice(start, end);

    window.DynamicTableRenderer.render(paginatedData, columnConfig);
    renderPagination(totalRows);
}

function renderPagination(totalRows) {
    const totalPages = Math.ceil(totalRows / rowsPerPage);
    const pagination = document.getElementById('pagination');
    pagination.innerHTML = '';

    if (totalPages <= 1) return;

    pagination.innerHTML += `<li class="page-item${currentPage === 1 ? ' disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage - 1}">Previous</a></li>`;

    for (let i = 1; i <= totalPages; i++) {
        pagination.innerHTML += `<li class="page-item${i === currentPage ? ' active' : ''}">
            <a class="page-link" href="#" data-page="${i}">${i}</a></li>`;
    }

    pagination.innerHTML += `<li class="page-item${currentPage === totalPages ? ' disabled' : ''}">
        <a class="page-link" href="#" data-page="${currentPage + 1}">Next</a></li>`;

    pagination.querySelectorAll('a.page-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const page = parseInt(e.target.getAttribute('data-page'));
            if (!isNaN(page) && page >= 1 && page <= totalPages && page !== currentPage) {
                currentPage = page;
                renderTable(filteredData);
            }
        });
    });
}

function formatFiscalYear(from, till) {
    if (!from || !till) return "";
    const start = from;
    const end = till.length > 2 ? till.slice(-2) : till;
    return `${start}/${end}`;
}

async function fetchCalendarData() {
    const res = await fetch('/api/calendar/all');
    const data = await res.json();

    const grouped = {};
    data.forEach(item => {
        const year = item.bsDate ? item.bsDate.substring(0, 4) : '';
        if (!grouped[year]) grouped[year] = [];
        grouped[year].push(item);
    });

    const tableRows = Object.keys(grouped)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .map((year, idx) => {
            const rows = grouped[year];
            let holidayCount = 0;
            rows.forEach(row => {
                if (row.holiday === true || row.day === "SATURDAY") holidayCount++;
            });
            const first = rows[0];

            let nepaliFiscalYear = "";
            if (first.nepaliFiscalYearFrom && first.nepaliFiscalYearTill) {
                nepaliFiscalYear = formatFiscalYear(first.nepaliFiscalYearFrom, first.nepaliFiscalYearTill);
            }

            let englishFiscalYear = "";
            if (first.englishFiscalYearFrom && first.englishFiscalYearTill) {
                englishFiscalYear = formatFiscalYear(first.englishFiscalYearFrom, first.englishFiscalYearTill);
            }

            return {
                sn: idx + 1,
                year: first.year || (first.bsDate ? first.bsDate.substring(0, 4) : ''),
                adDate: first.adDate,
                bsDate: first.bsDate,
                nepaliFiscalYear,
                englishFiscalYear,
                holidayCount,
                display: first.display ? "Active" : "Inactive",
                id: first.cId
            };
        });

    renderTable(tableRows);
}

document.addEventListener("DOMContentLoaded", () => {
    fetchCalendarData();
});

document.addEventListener('click', async function(e) {
    if (e.target.classList.contains('delete-btn')) {
        const year = e.target.getAttribute('data-year');
        if (year && confirm(`Delete all calendar data for BS year ${year}?`)) {
            const res = await fetch(`/api/calendar/delete/year/${year}`, { method: 'PUT' });
            if (res.ok) {
                alert('Deleted!');
                fetchCalendarData();
            } else {
                alert('Failed to delete.');
            }
        }
    }
});
