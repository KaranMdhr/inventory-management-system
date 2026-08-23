let audioUrl = '';

async function searchWord() {
    const word = document.getElementById('wordInput').value.trim();
    if (!word) return;

    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const data = await response.json();

    const defBox = document.getElementById('definition');
    const audioBox = document.getElementById('pronounceBtn');

    if (data[0]?.meanings) {
        const meaning = data[0].meanings[0].definitions[0].definition;
        defBox.innerText = `Definition: ${meaning}`;

        // Get audio URL
        audioUrl = data[0].phonetics.find(p => p.audio)?.audio;
        if (audioUrl) {
            audioBox.style.display = 'block';
        } else {
            audioBox.style.display = 'none';
        }

        saveToHistory(word);
    } else {
        defBox.innerText = "Word not found!";
        audioBox.style.display = 'none';
    }
}

function playAudio() {
    if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
    }
}

function saveToHistory(word) {
    let history = JSON.parse(localStorage.getItem("dictionaryHistory")) || [];
    if (!history.includes(word)) {
        history.unshift(word);
        if (history.length > 10) history.pop();
        localStorage.setItem("dictionaryHistory", JSON.stringify(history));
        displayHistory();
    }
}

function displayHistory() {
    const historyList = document.getElementById('historyList');
    const history = JSON.parse(localStorage.getItem("dictionaryHistory")) || [];
    historyList.innerHTML = '';
    history.forEach(w => {
        const li = document.createElement('li');
        li.textContent = w;
        li.onclick = () => {
            document.getElementById('wordInput').value = w;
            searchWord();
        };
        historyList.appendChild(li);
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark');
}

window.onload = displayHistory;