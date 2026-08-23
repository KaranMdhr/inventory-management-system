let memoryValue = 0;
let current = '';

function append(value) {
    current += value;
    updateDisplay();
}

function clearAll() {
    current = '';
    updateDisplay();
}

function clearEntry() {
    current = current.slice(0, -1);
    updateDisplay();
}

function toggleSign() {
    if (current) {
        current = (parseFloat(current) * -1).toString();
        updateDisplay();
    }
}

function squareRoot() {
    if (current) {
        current = Math.sqrt(parseFloat(current)).toString();
        updateDisplay();
    }
}

function percentage() {
    if (current) {
        current = (parseFloat(current) / 100).toString();
        updateDisplay();
    }
}

function calculate() {
    try {
        current = eval(current).toString();
    } catch {
        current = "Error";
    }
    updateDisplay();
}

function memory(action) {
    switch (action) {
        case 'MC':
            memoryValue = 0;
            break;
        case 'MR':
            current += memoryValue;
            break;
        case 'M+':
            memoryValue += parseFloat(current || 0);
            break;
        case 'M-':
            memoryValue -= parseFloat(current || 0);
            break;
    }
    updateDisplay();
}

function updateDisplay() {
    document.getElementById('display').value = current;
}
