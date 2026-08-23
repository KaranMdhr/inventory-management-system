
let activeRoles = [];

// Fetch active roles from backend before initializing the table
async function fetchActiveRoles() {
    try {
        const res = await fetch('/api/access/active-roles');
        if (!res.ok) throw new Error('Failed to fetch roles');
        activeRoles = await res.json();
    } catch (e) {
        console.error(e);
        activeRoles = [];
    }
}

document.addEventListener("DOMContentLoaded", async function () {
    await fetchActiveRoles();

    const columnConfig = [
        {
            header: "User",
            resizable: true,
            sortable: true,
            renderCell: (item) => renderUserCell(item)
        },
        { header: "Email", dataKey: "email", resizable: true, sortable: true },
        {
            header: "Role", resizable: true, sortable: true,
            renderCell: (item) => renderRoleCell(item)
        },
        {
            header: "Permissions", resizable: true,
            renderCell: (item) => renderPermissionsCell(item)
        },
        { header: "Status", dataKey: "status", resizable: true, sortable: true },
        { header: "Actions" }
    ];

    new TableManager({
        apiEndpoint: "/api/access/employees-list",
        idKey: "Id",
        columnConfig: columnConfig,
        confirmMessage: "Are you sure you want to delete this user?",
        errorMessage: "Failed to delete user: ",
        actions: [
            { label: "Edit", type: "url", url: "/itemedit?id={id}" },
            { label: "View", type: "url", url: "/itemview?id={id}" },
            { label: "Delete", type: "api", endpoint: "/api/item/item-delete/{id}" }
        ]
    })
});

// Helper to render the user cell
function renderUserCell(item) {
    // Combine first, middle, last name
    return [item.firstname, item.middleName, item.lastName].filter(Boolean).join(" ") || "-";
}

// Helper to render the role cell as a dropdown
function renderRoleCell(item) {
    if (!activeRoles.length) return "-";
    // Use the nested userRole object for the current roleId
    const currentRoleId = item.userRole && item.userRole.roleId ? item.userRole.roleId : null;
    return `
        <select class="role-dropdown" data-user-id="${item.employeeId || item.id}">
            ${activeRoles.map(role => `
                <option value="${role.roleId}" ${role.roleId === currentRoleId ? 'selected' : ''}>
                    ${role.roleName}
                </option>
            `).join('')}
        </select>
    `;
}

// Listen for role changes
document.addEventListener('change', function (e) {
    if (e.target.classList.contains('role-dropdown')) {
        const userId = e.target.getAttribute('data-user-id');
        const newRoleId = e.target.value;
        // TODO: Send update to backend if needed
        console.log(`User ${userId} role changed to ${newRoleId}`);
    }
});

// Helper to render the permissions cell
function renderPermissionsCell(item) {
    if (!item.permissions) return "-";
    const permKeys = ["request", "approve", "purchase", "users", "staff"];
    return permKeys.map(key => `
        <label>
            <input type="checkbox"
                   class="perm-checkbox"
                   data-user-id="${item.employeeId || item.id}"
                   data-perm="${key}"
                   ${item.permissions[key] ? "checked" : ""}>
            ${key.charAt(0).toUpperCase() + key.slice(1)}
        </label>
    `).join("<br>");
}
//
//
// function renderSuspendButton(user) {
//     const btnText = user.status === 'suspended' ? 'Activate' : 'Suspend';
//     return `<button class="btn suspend-btn" data-status="${user.status}" data-user-id="${user.id}" onclick="handleSuspendClick(this, ${user.id})">${btnText}</button>`;
// }
//
// function filterData() {
//     const status = document.getElementById('statusFilter').value;
//     const search = document.getElementById('searchUser').value.toLowerCase();
//
//     filteredData = userData.filter(user => {
//         let matchesSmartFilter = true;
//
//         // Check if a smart filter is applied
//         if (currentSmartFilter) {
//             if (currentSmartFilter.startsWith('role-')) {
//                 const selectedRole = currentSmartFilter.replace('role-', '');
//                 matchesSmartFilter = user.role === selectedRole;
//             } else if (currentSmartFilter.startsWith('perm-')) {
//                 const selectedPerm = currentSmartFilter.replace('perm-', '');
//                 matchesSmartFilter = user.permissions.includes(selectedPerm);
//             }
//         }
//
//         const matchesStatus = !status || user.status === status;
//         const matchesSearch = !search ||
//             user.user.toLowerCase().includes(search) ||
//             user.email.toLowerCase().includes(search);
//
//         return matchesSmartFilter && matchesStatus && matchesSearch;
//     });
//
//     renderTable(filteredData);
// }
//
// function resetFilter() {
//     document.getElementById('statusFilter').value = '';
//     document.getElementById('searchUser').value = '';
//     currentSmartFilter = null;
//     document.getElementById('selectedValue').textContent = 'Select...';
//     document.getElementById('smartFilter').classList.remove('open');
//     filteredData = [...userData];
//     renderTable(filteredData);
// }
//
// function updateRole(userId, newRole) {
//     const user = userData.find(u => u.id === userId);
//     if (user) {
//         user.role = newRole;
//     }
// }
//
// function updatePermission(userId, permission, hasPermission) {
//     const user = userData.find(u => u.id === userId);
//     if (user) {
//         if (hasPermission && !user.permissions.includes(permission)) {
//             user.permissions.push(permission);
//         } else if (!hasPermission) {
//             user.permissions = user.permissions.filter(p => p !== permission);
//         }
//     }
// }
//
// // === Suspend Button with Permanent/Temporary ===
// function handleSuspendClick(btn, userId) {
//     const user = userData.find(u => u.id === userId);
//     if (!user) return;
//
//     if (user.status === 'active') {
//         createSuspendActionDropdown(btn, userId);
//     } else {
//         user.status = 'active';
//         btn.textContent = 'Suspend';
//         btn.dataset.status = 'active';
//         filterData();
//     }
// }
//
// function createSuspendActionDropdown(btn, userId) {
//     // Remove existing menu if open
//     document.querySelectorAll('.suspend-action-menu').forEach(m => m.remove());
//
//     // Build the dropdown
//     const menu = document.createElement('div');
//     menu.className = 'suspend-action-menu';
//
//     // "Temporary Ban" option
//     const tempOpt = document.createElement('div');
//     tempOpt.className = 'dropdown-option suspend-temporary';
//     tempOpt.textContent = 'Temporary';
//     tempOpt.onclick = () => {
//         // Clear menu for time ban UI
//         menu.innerHTML = '';
//         const label = document.createElement('label');
//         label.className = 'suspend-label';
//         label.textContent = 'Ban for ';
//
//         const input = document.createElement('input');
//         input.type = 'number';
//         input.min = 1;
//         input.max = 365;
//         input.value = 1;
//         input.className = 'suspend-days-input';
//
//         const span = document.createElement('span');
//         span.className = 'suspend-days-span';
//         span.textContent = 'days';
//
//         const confirmBtn = document.createElement('button');
//         confirmBtn.className = 'suspend-confirm-btn';
//         confirmBtn.textContent = 'Confirm';
//         confirmBtn.onclick = () => {
//             const days = parseInt(input.value) || 1;
//             // Perform temporary suspension logic:
//             const user = userData.find(u => u.id === userId);
//             if (user) {
//                 user.status = 'suspended';
//                 user.suspendDays = days; // optional: for tracking
//             }
//             filterData();
//             menu.remove();
//         };
//
//         menu.appendChild(label);
//         menu.appendChild(input);
//         menu.appendChild(span);
//         menu.appendChild(confirmBtn);
//     };
//     menu.appendChild(tempOpt);
//
//     // "Permanent Ban" option
//     const permOpt = document.createElement('div');
//     permOpt.className = 'dropdown-option suspend-permanent';
//     permOpt.textContent = 'Permanent';
//     permOpt.onclick = () => {
//         const user = userData.find(u => u.id === userId);
//         if (user) {
//             user.status = 'suspended';
//             user.suspendDays = null; // optional: mark as permanent
//         }
//         filterData();
//         menu.remove();
//     };
//     menu.appendChild(permOpt);
//
//     // Remove dropdown on outside click
//     setTimeout(() => {
//         function handleClickOutside(event) {
//             if (!menu.contains(event.target) && event.target !== btn) {
//                 menu.remove();
//                 document.removeEventListener('mousedown', handleClickOutside);
//             }
//         }
//         document.addEventListener('mousedown', handleClickOutside);
//     });
//
//     // Insert menu
//     btn.parentElement.classList.add('suspend-btn-parent');
//     btn.parentElement.appendChild(menu);
// }
//
// function closeAllSuspendMenus() {
//     document.querySelectorAll('.suspend-action-menu').forEach(menu => menu.remove());
// }
//
// function setSuspendedState(btn, userId, { type, days }) {
//     const user = userData.find(u => u.id === userId);
//     if (!user) return;
//
//     user.status = 'suspended';
//     btn.textContent = 'Activate';
//     btn.dataset.status = 'suspended';
//     btn.title = type === "permanent" ? "Suspended permanently" : `Suspended for ${days} day${days > 1 ? "s" : ""}`;
//     filterData();
// }
//
// document.addEventListener("DOMContentLoaded", function () {
//     const dropdown = document.getElementById("smartFilter");
//     const dropdownSelected = document.getElementById("selectedValue");
//     const dropdownList = document.getElementById("dropdownList");
//     const originalOptions = `
//         <div class="dropdown-option" data-group="role" data-value="">Role</div>
//         <div class="dropdown-option" data-group="permission" data-value="">Permission</div>
//     `;
//     let lastOpenedMenu = null; // "role", "permission", or null
//
//     function renderRoleOptions() {
//         dropdownList.innerHTML =
//             `<div class="dropdown-option dropdown-back" data-group="back">← Back</div>` +
//             roles.map(item =>
//                 `<div class="dropdown-option sub-option" data-group="role-value" data-value="${item}">${item}</div>`
//             ).join('');
//         lastOpenedMenu = "role";
//     }
//
//     function renderPermissionOptions() {
//         dropdownList.innerHTML =
//             `<div class="dropdown-option dropdown-back" data-group="back">← Back</div>` +
//             permissions.map(item =>
//                 `<div class="dropdown-option sub-option" data-group="permission-value" data-value="${item}">${item}</div>`
//             ).join('');
//         lastOpenedMenu = "permission";
//     }
//
//     function renderMainOptions() {
//         dropdownList.innerHTML = originalOptions;
//         lastOpenedMenu = null;
//     }
//
//     dropdownSelected.addEventListener("click", function (e) {
//         dropdown.classList.toggle("open");
//
//         // When opening, show the last opened menu if set, otherwise main
//         if (dropdown.classList.contains("open")) {
//             if (lastOpenedMenu === "role") {
//                 renderRoleOptions();
//             } else if (lastOpenedMenu === "permission") {
//                 renderPermissionOptions();
//             } else {
//                 renderMainOptions();
//             }
//         }
//         e.stopPropagation();
//     });
//
//     dropdownList.addEventListener("click", function (e) {
//         const clickedOption = e.target.closest('.dropdown-option');
//         if (!clickedOption) return;
//
//         const group = clickedOption.getAttribute("data-group");
//         const value = clickedOption.getAttribute("data-value");
//
//         if (group === "role") {
//             renderRoleOptions();
//         } else if (group === "permission") {
//             renderPermissionOptions();
//         } else if (group === "back") {
//             renderMainOptions();
//         } else if (group === "role-value") {
//             currentSmartFilter = "role-" + value;
//             dropdownSelected.textContent = value;
//             dropdown.classList.remove("open");
//             filterData();
//         } else if (group === "permission-value") {
//             currentSmartFilter = "perm-" + value;
//             dropdownSelected.textContent = value;
//             dropdown.classList.remove("open");
//             filterData();
//         }
//         e.stopPropagation();
//     });
//
//     document.addEventListener("mousedown", function (event) {
//         if (!dropdown.contains(event.target)) {
//             dropdown.classList.remove("open");
//             // Menu content stays as lastOpenedMenu, so next open shows same sub-menu
//         }
//     });
//
//     // Call this function in resetFilter() to reset to initial
//     window.resetFilter = function () {
//         document.getElementById('statusFilter').value = '';
//         document.getElementById('searchUser').value = '';
//         currentSmartFilter = null;
//         dropdownSelected.textContent = 'Select...';
//         dropdown.classList.remove('open');
//         renderMainOptions(); // reset to main options
//         filteredData = [...userData];
//         renderTable(filteredData);
//     };
// });
//
//
// // === Initialization ===
// document.addEventListener('DOMContentLoaded', () => {
//     renderTable(userData);
// });