const today = new Date();
const adToBsMonth = [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7];
let currentMonth = adToBsMonth[today.getMonth()];
let currentYear = new Date().getFullYear() + 57;

const nepaliMonths = [
  "Baishakh",
  "Jestha",
  "Ashad",
  "Shrawan",
  "Bhadra",
  "Ashoj",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

function setCurrentMonthAndYear(callback) {
  fetch(`/api/calendar/year/${currentYear}`)
    .then((res) => res.json())
    .then((data) => {
      const todayEntry = data.find(
        (d) =>
          d.adDate && new Date(d.adDate).toDateString() === today.toDateString()
      );
      if (todayEntry) {
        const nepaliMonth = todayEntry.month && todayEntry.month.trim();
        const idx = nepaliMonths.findIndex(
          (m) => m.toUpperCase() === nepaliMonth.toUpperCase()
        );
        if (idx !== -1) currentMonth = idx;

        if (todayEntry.bsDate) {
          currentYear = parseInt(todayEntry.bsDate.split("-")[0], 10);
        }
      }
      if (typeof callback === "function") callback(data);
    });
}

function populateDropdowns() {
  const yearSelect = document.getElementById("yearSelect");
  const monthSelect = document.getElementById("monthSelect");
  yearSelect.innerHTML = "";
  monthSelect.innerHTML = "";
  for (let y = 2070; y <= 2090; y++) {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    if (y === currentYear) opt.selected = true;
    yearSelect.appendChild(opt);
  }
  nepaliMonths.forEach((m, idx) => {
    const opt = document.createElement("option");
    opt.value = idx;
    opt.textContent = m;
    if (idx === currentMonth) opt.selected = true;
    monthSelect.appendChild(opt);
  });
}

function renderCalendar(data, monthIdx) {
  const grid = document.getElementById("calendarGrid");
  grid.innerHTML = "";

  ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].forEach((day) => {
    const el = document.createElement("div");
    el.className = "day-header";
    el.textContent = day;
    grid.appendChild(el);
  });

  const monthName = nepaliMonths[monthIdx].toUpperCase();
  const prevMonthIdx = (monthIdx + 11) % 12;
  const nextMonthIdx = (monthIdx + 1) % 12;
  const prevMonthName = nepaliMonths[prevMonthIdx].toUpperCase();
  const nextMonthName = nepaliMonths[nextMonthIdx].toUpperCase();

  const days = data.filter(
    (d) => d.month && d.month.trim().toUpperCase() === monthName
  );
  const prevMonthDays = data.filter(
    (d) => d.month && d.month.trim().toUpperCase() === prevMonthName
  );
  const nextMonthDays = data.filter(
    (d) => d.month && d.month.trim().toUpperCase() === nextMonthName
  );

  let adMonthYear = "";
  if (days.length) {
    const adMonths = days.map((d) => {
      const date = new Date(d.adDate);
      return {
        month: date.toLocaleString("default", { month: "long" }),
        year: date.getFullYear(),
      };
    });
    const uniqueMonths = [...new Set(adMonths.map((m) => m.month))];
    const uniqueYears = [...new Set(adMonths.map((m) => m.year))];
    if (uniqueMonths.length === 1 && uniqueYears.length === 1) {
      adMonthYear = `${uniqueMonths[0]} ${uniqueYears[0]}`;
    } else if (uniqueMonths.length === 1) {
      adMonthYear = `${uniqueMonths[0]} ${uniqueYears[0]}-${uniqueYears[1]}`;
    } else if (uniqueYears.length === 1) {
      adMonthYear = `${uniqueMonths[0]}/${uniqueMonths[1]} ${uniqueYears[0]}`;
    } else {
      adMonthYear = `${uniqueMonths[0]} ${uniqueYears[0]}/${uniqueMonths[1]} ${uniqueYears[1]}`;
    }
  }

  let firstDayIdx = 0;
  if (days[0] && days[0].day) {
    firstDayIdx = [
      "SUNDAY",
      "MONDAY",
      "TUESDAY",
      "WEDNESDAY",
      "THURSDAY",
      "FRIDAY",
      "SATURDAY",
    ].indexOf(days[0].day.trim().toUpperCase());
    if (firstDayIdx < 0) firstDayIdx = 0;
  }

  let cellCount = 0;
  const prevMonthLastDays = prevMonthDays.slice(-firstDayIdx);
  for (let i = 0; i < firstDayIdx; i++, cellCount++) {
    const d = prevMonthLastDays[i] || {};
    const cell = document.createElement("div");
    cell.className = "day-cell other-month";
    cell.innerHTML = `
            <div class="bs-date">${
              d.bsDate ? parseInt(d.bsDate.split("-")[2]) : ""
            }</div>
            <div class="ad-date">${
              d.adDate ? new Date(d.adDate).getDate() : ""
            }</div>
        `;
    grid.appendChild(cell);
  }

  days.forEach((day) => {
    const cell = document.createElement("div");
    cell.className = "day-cell";
    if (day.holiday) cell.classList.add("holiday");
    if (day.day && day.day.trim().toUpperCase() === "SATURDAY")
      cell.classList.add("saturday");
    if (new Date(day.adDate).toDateString() === new Date().toDateString())
      cell.classList.add("today");
    cell.innerHTML = `
            <div class="bs-date">${parseInt(day.bsDate.split("-")[2])}</div>
            <div class="ad-date">${new Date(day.adDate).getDate()}</div>
        `;
    grid.appendChild(cell);
    cellCount++;
  });

  const totalCells = cellCount;
  for (let i = 0; totalCells + i < 42; i++) {
    const d = nextMonthDays[i] || {};
    const cell = document.createElement("div");
    cell.className = "day-cell other-month";
    cell.innerHTML = `
            <div class="bs-date">${
              d.bsDate ? parseInt(d.bsDate.split("-")[2]) : ""
            }</div>
            <div class="ad-date">${
              d.adDate ? new Date(d.adDate).getDate() : ""
            }</div>
        `;
    grid.appendChild(cell);
  }

  document.getElementById("monthYear").textContent = `${
    nepaliMonths[monthIdx]
  } ${currentYear}${adMonthYear ? " | " + adMonthYear : ""}`;
}

function fetchAndRender(monthIdx, year) {
  year = year || currentYear;
  const monthName = nepaliMonths[monthIdx].toUpperCase();
  fetch(`/api/calendar/month/${year}/${monthName}`)
    .then((res) => res.json())
    .then((data) => {
      renderCalendar(data, monthIdx);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  setCurrentMonthAndYear((data) => {
    populateDropdowns();
    renderCalendar(data, currentMonth);

    document.getElementById("yearSelect").onchange = (e) => {
      currentYear = parseInt(e.target.value, 10);
      fetchAndRender(currentMonth, currentYear);
    };
    document.getElementById("monthSelect").onchange = (e) => {
      currentMonth = parseInt(e.target.value, 10);
      fetchAndRender(currentMonth, currentYear);
    };
    document.getElementById("prevMonth").onclick = () => {
      if (currentMonth === 0) {
        currentMonth = 11;
        currentYear--;
      } else {
        currentMonth--;
      }
      document.getElementById("monthSelect").value = currentMonth;
      document.getElementById("yearSelect").value = currentYear;
      fetchAndRender(currentMonth, currentYear);
    };
    document.getElementById("nextMonth").onclick = () => {
      if (currentMonth === 11) {
        currentMonth = 0;
        currentYear++;
      } else {
        currentMonth++;
      }
      document.getElementById("monthSelect").value = currentMonth;
      document.getElementById("yearSelect").value = currentYear;
      fetchAndRender(currentMonth, currentYear);
    };
  });
});
