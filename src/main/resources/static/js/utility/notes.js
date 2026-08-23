let noteIdCounter = 0;
const notesMap = new Map();

function createNote() {
    const container = document.getElementById("noteContainer");
    const noteId = "note-" + noteIdCounter++;
    const note = document.createElement("div");
    note.className = "note";
    note.dataset.id = noteId;

    const creationDate = new Date().toLocaleString();

    // Header with + Title X
    const header = document.createElement("div");
    header.className = "note-header";

    const addBtn = document.createElement("button");
    addBtn.className = "plus-btn";
    addBtn.textContent = "+";
    addBtn.onclick = createNote;

    const title = document.createElement("div");
    title.className = "note-title";
    title.contentEditable = "true";
    title.textContent = "";
    title.oninput = () => updateSidebar();

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "plus-btn";
    deleteBtn.textContent = "X";
    deleteBtn.onclick = () => {
        note.remove();
        notesMap.delete(noteId);
        updateSidebar();
    };

    header.appendChild(addBtn);
    header.appendChild(title);
    header.appendChild(deleteBtn);

    // Content area
    const content = document.createElement("div");
    content.className = "note-content";
    content.contentEditable = "true";
    content.setAttribute("data-placeholder", "Take a note...");
    content.oninput = () => updateSidebar();

    // Toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "note-toolbar";
    toolbar.innerHTML = `
    <button onclick="formatNote(this, 'bold')"><b>B</b></button>
    <button onclick="formatNote(this, 'italic')"><i>I</i></button>
    <button onclick="formatNote(this, 'underline')"><u>U</u></button>
    <button onclick="formatNote(this, 'strikeThrough')"><s>ab</s></button>
    <button onclick="formatNote(this, 'insertUnorderedList')">• List</button>
    <button onclick="triggerImage(this)">🖼</button>
  `;

    // Combine
    note.appendChild(header);
    note.appendChild(content);
    note.appendChild(toolbar);
    container.appendChild(note);

    notesMap.set(noteId, { title, content, date: creationDate, element: note });
    updateSidebar();
}

function updateSidebar() {
    const list = document.getElementById("notesList");
    list.innerHTML = "";

    notesMap.forEach((noteObj, id) => {
        const titleText = noteObj.title.innerText.trim() || "Untitled";
        const snippet = noteObj.content.innerText.trim().slice(0, 30);
        const date = noteObj.date;

        const entry = document.createElement("div");
        entry.className = "sidebar-note";
        entry.style.display = "flex";
        entry.style.justifyContent = "space-between";
        entry.style.alignItems = "center";
        entry.style.gap = "5px";

        const textArea = document.createElement("div");
        textArea.style.cursor = "pointer";
        textArea.style.flex = "1";
        textArea.innerHTML = `
      <strong>${titleText}</strong><br>
      <small>${date}</small><br>
      <span style="font-size: 13px; color: #555;">${snippet}</span>
    `;
        textArea.onclick = () => {
            // Hide all notes
            document.querySelectorAll(".note").forEach(n => n.style.display = "none");
            // Show only the clicked note
            noteObj.element.style.display = "flex";
            noteObj.element.scrollIntoView({ behavior: "smooth", block: "center" });
        };

        const delBtn = document.createElement("button");
        delBtn.textContent = "🗑️";
        delBtn.style.border = "none";
        delBtn.style.background = "transparent";
        delBtn.style.cursor = "pointer";
        delBtn.style.padding = "0 4px";
        delBtn.onclick = (e) => {
            e.stopPropagation();
            noteObj.element.remove();
            notesMap.delete(id);
            updateSidebar();
        };

        entry.appendChild(textArea);
        entry.appendChild(delBtn);
        list.appendChild(entry);
    });
}

function formatNote(button, command) {
    const note = button.closest(".note");
    const content = note.querySelector(".note-content");
    content.focus();
    document.execCommand(command, false, null);
}

function triggerImage(button) {
    const note = button.closest(".note");
    const content = note.querySelector(".note-content");

    const fileInput = document.getElementById("imageInput");
    fileInput.click();

    fileInput.onchange = function () {
        const file = fileInput.files[0];
        if (file && file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = function (e) {
                content.focus();
                document.execCommand("insertImage", false, e.target.result);
                updateSidebar();
            };
            reader.readAsDataURL(file);
        }
    };
}

window.onload = createNote;
