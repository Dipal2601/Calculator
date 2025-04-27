// DOM Elements
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.getElementById('equals');
const clearButton = document.getElementById('clear');
const deleteButton = document.getElementById('delete');
const darkModeButton = document.getElementById('dark-mode');
const historyToggleButton = document.getElementById('history-toggle');
const historyPanel = document.getElementById('history-panel');
const closeHistoryButton = document.getElementById('close-history');
const historyContent = document.getElementById('history-content');
const calculationAnimation = document.getElementById('calculation-animation');
const soundToggleButton = document.getElementById('sound-toggle');
const animationToggleButton = document.getElementById('animation-toggle');

// Calculator State
let currentOperand = '0';
let previousOperand = '';
let operation = undefined;
let shouldResetScreen = false;
let calculationHistory = [];
let soundEnabled = true;
let animationsEnabled = true;

// Sound Effects
const sounds = {
    click: new Audio('./assets/sounds/click.mp3'),
    operation: new Audio('./assets/sounds/operation.mp3'),
    equals: new Audio('./assets/sounds/equals.mp3'),
    clear: new Audio('./assets/sounds/clear.mp3'),
    error: new Audio('./assets/sounds/error.mp3')
};

// Initialize Calculator
function initialize() {
    updateDisplay();
    setupEventListeners();
    loadHistory();
    loadSettings();
    renderHistory();
}

// Event Listeners
function setupEventListeners() {
    // Number buttons
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            appendNumber(button.getAttribute('data-number'));
            playButtonAnimation(button);
            playSound('click');
        });
    });

    // Operator buttons
    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            chooseOperation(button.getAttribute('data-operator'));
            playButtonAnimation(button);
            playSound('operation');
        });
    });

    // Equals button
    equalsButton.addEventListener('click', () => {
        calculate();
        playButtonAnimation(equalsButton);
        playSound('equals');
    });

    // Clear button
    clearButton.addEventListener('click', () => {
        clear();
        playButtonAnimation(clearButton);
        playSound('clear');
    });

    // Delete button
    deleteButton.addEventListener('click', () => {
        deleteNumber();
        playButtonAnimation(deleteButton);
        playSound('click');
    });

    // Dark mode toggle
    darkModeButton.addEventListener('click', () => {
        toggleDarkMode();
        playButtonAnimation(darkModeButton);
        playSound('click');
    });

    // History toggle
    historyToggleButton.addEventListener('click', () => {
        toggleHistoryPanel();
        playButtonAnimation(historyToggleButton);
        playSound('click');
    });

    // Close history
    closeHistoryButton.addEventListener('click', () => {
        toggleHistoryPanel();
        playSound('click');
    });

    // Sound toggle
    soundToggleButton.addEventListener('click', () => {
        toggleSound();
        playButtonAnimation(soundToggleButton);
        // Don't play sound here as it might be confusing when turning sound off
    });

    // Animation toggle
    animationToggleButton.addEventListener('click', () => {
        toggleAnimations();
        playButtonAnimation(animationToggleButton);
        playSound('click');
    });

    // Keyboard support
    document.addEventListener('keydown', handleKeyboardInput);
}

// Calculator Functions
function appendNumber(number) {
    if (shouldResetScreen) {
        currentOperand = '';
        shouldResetScreen = false;
    }

    // Handle decimal point
    if (number === '.' && currentOperand.includes('.')) return;
    
    // Replace initial 0 unless it's a decimal point
    if (currentOperand === '0' && number !== '.') {
        currentOperand = number;
    } else {
        currentOperand += number;
    }
    
    updateDisplay();
}

function chooseOperation(op) {
    if (currentOperand === '') return;
    
    if (previousOperand !== '') {
        calculate();
    }
    
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
    updateDisplay();
}

function calculate() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch (operation) {
        case '+':
            computation = prev + current;
            break;
        case '-':
            computation = prev - current;
            break;
        case '×':
            computation = prev * current;
            break;
        case '÷':
            if (current === 0) {
                currentOperand = 'Error';
                previousOperand = '';
                operation = undefined;
                shouldResetScreen = true;
                updateDisplay();
                playSound('error');
                playErrorAnimation();
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }
    
    // Format the result to avoid excessive decimal places
    currentOperand = formatNumber(computation);
    
    // Add to history
    addToHistory(`${previousOperand} ${operation} ${currentOperand}`, currentOperand);
    
    // Play calculation animation
    playCalculationAnimation(operation);
    
    operation = undefined;
    previousOperand = '';
    shouldResetScreen = true;
    updateDisplay();
}

function formatNumber(number) {
    // Convert to string and check if it's a whole number
    const stringNumber = number.toString();
    
    if (stringNumber === 'Infinity' || stringNumber === '-Infinity') {
        return '∞';
    }
    
    // Check if the number is too large for display
    if (number > 1e15 || number < -1e15) {
        return number.toExponential(5);
    }
    
    const integerDigits = parseFloat(stringNumber.split('.')[0]);
    const decimalDigits = stringNumber.split('.')[1];
    
    let integerDisplay;
    
    if (isNaN(integerDigits)) {
        integerDisplay = '';
    } else {
        integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
    }
    
    if (decimalDigits != null) {
        // Limit decimal places to 10 maximum
        const limitedDecimal = decimalDigits.length > 10 ? decimalDigits.slice(0, 10) : decimalDigits;
        return `${integerDisplay}.${limitedDecimal}`;
    } else {
        return integerDisplay;
    }
}

function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = undefined;
    updateDisplay();
}

function deleteNumber() {
    if (currentOperand === 'Error' || currentOperand === '∞') {
        currentOperand = '0';
    } else if (currentOperand.length === 1) {
        currentOperand = '0';
    } else {
        currentOperand = currentOperand.slice(0, -1);
    }
    updateDisplay();
}

function updateDisplay() {
    // Format the current operand for display
    currentOperandElement.textContent = currentOperand;
    
    // Update the previous operand display with the operation
    if (operation != null) {
        previousOperandElement.textContent = `${previousOperand} ${operation}`;
    } else {
        previousOperandElement.textContent = previousOperand;
    }
    
    // Adjust font size if the number is too long
    adjustFontSize();
}

function adjustFontSize() {
    const maxLength = 12;
    if (currentOperand.length > maxLength) {
        const scaleFactor = Math.max(0.5, 1 - (currentOperand.length - maxLength) * 0.05);
        currentOperandElement.style.fontSize = `${scaleFactor * 2.5}rem`;
    } else {
        currentOperandElement.style.fontSize = '2.5rem';
    }
}

function handleKeyboardInput(e) {
    // Numbers 0-9
    if (/^\d$/.test(e.key)) {
        appendNumber(e.key);
        highlightButton(`[data-number="${e.key}"]`);
        playSound('click');
    }
    
    // Decimal point
    if (e.key === '.') {
        appendNumber('.');
        highlightButton('[data-number="."]');
        playSound('click');
    }
    
    // Operators
    if (e.key === '+') {
        chooseOperation('+');
        highlightButton('[data-operator="+"]');
        playSound('operation');
    }
    if (e.key === '-') {
        chooseOperation('-');
        highlightButton('[data-operator="-"]');
        playSound('operation');
    }
    if (e.key === '*') {
        chooseOperation('×');
        highlightButton('[data-operator="×"]');
        playSound('operation');
    }
    if (e.key === '/') {
        e.preventDefault(); // Prevent browser's find functionality
        chooseOperation('÷');
        highlightButton('[data-operator="÷"]');
        playSound('operation');
    }
    
    // Equals (Enter or =)
    if (e.key === '=' || e.key === 'Enter') {
        e.preventDefault();
        calculate();
        highlightButton('#equals');
        playSound('equals');
    }
    
    // Delete (Backspace)
    if (e.key === 'Backspace') {
        deleteNumber();
        highlightButton('#delete');
        playSound('click');
    }
    
    // Clear (Escape or Delete)
    if (e.key === 'Escape' || e.key === 'Delete') {
        clear();
        highlightButton('#clear');
        playSound('clear');
    }
    
    // History (H key)
    if (e.key === 'h' || e.key === 'H') {
        toggleHistoryPanel();
        highlightButton('#history-toggle');
        playSound('click');
    }
    
    // Sound toggle (S key)
    if (e.key === 's' || e.key === 'S') {
        toggleSound();
        highlightButton('#sound-toggle');
    }
    
    // Animation toggle (A key)
    if (e.key === 'a' || e.key === 'A') {
        toggleAnimations();
        highlightButton('#animation-toggle');
        playSound('click');
    }
}

function highlightButton(selector) {
    const button = document.querySelector(selector);
    if (button) {
        playButtonAnimation(button);
    }
}

function playButtonAnimation(button) {
    button.classList.add('button-animation');
    setTimeout(() => {
        button.classList.remove('button-animation');
    }, 200);
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    
    // Update dark mode button text
    if (document.body.classList.contains('dark-mode')) {
        darkModeButton.textContent = '🌙';
    } else {
        darkModeButton.textContent = '☀️';
    }
    
    // Save dark mode preference
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// Sound and Animation Functions
function playSound(soundType) {
    if (!soundEnabled) return;
    
    // Create a new audio object each time to allow overlapping sounds
    const sound = new Audio(sounds[soundType].src);
    
    // Handle potential errors with sound playback
    sound.play().catch(error => {
        console.log('Sound playback failed:', error);
    });
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    soundToggleButton.textContent = soundEnabled ? '🔊' : '🔇';
    soundToggleButton.classList.toggle('disabled', !soundEnabled);
    
    // Save sound preference
    localStorage.setItem('soundEnabled', soundEnabled);
}

function toggleAnimations() {
    animationsEnabled = !animationsEnabled;
    animationToggleButton.textContent = animationsEnabled ? '✨' : '✖️';
    animationToggleButton.classList.toggle('disabled', !animationsEnabled);
    
    // Save animation preference
    localStorage.setItem('animationsEnabled', animationsEnabled);
}

function playCalculationAnimation(operator) {
    if (!animationsEnabled) return;
    
    // Clear previous animations
    calculationAnimation.innerHTML = '';
    
    // Add equals animation to current operand
    currentOperandElement.classList.add('equals-animation');
    setTimeout(() => {
        currentOperandElement.classList.remove('equals-animation');
    }, 500);
    
    // Create floating particles based on the operator
    const symbols = {
        '+': ['+', '+', '+'],
        '-': ['-', '-', '-'],
        '×': ['×', '×', '×'],
        '÷': ['÷', '÷', '÷']
    };
    
    // If we have an operator, create particles
    if (operator && symbols[operator]) {
        const particles = symbols[operator];
        
        particles.forEach((symbol, index) => {
            setTimeout(() => {
                createParticle(symbol);
            }, index * 100);
        });
    }
}

function createParticle(symbol) {
    const particle = document.createElement('div');
    particle.classList.add('calculation-particle');
    particle.textContent = symbol;
    
    // Random position within the display
    const xPos = Math.random() * 80 + 10; // 10% to 90% of width
    particle.style.left = `${xPos}%`;
    particle.style.top = '70%';
    
    // Random animation duration
    const duration = Math.random() * 0.5 + 0.8; // 0.8s to 1.3s
    particle.style.animationDuration = `${duration}s`;
    
    calculationAnimation.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
        particle.remove();
    }, duration * 1000);
}

function playErrorAnimation() {
    if (!animationsEnabled) return;
    
    currentOperandElement.classList.add('error-animation');
    setTimeout(() => {
        currentOperandElement.classList.remove('error-animation');
    }, 500);
}

// History Functions
function addToHistory(calculation, result) {
    const now = new Date();
    const historyItem = {
        id: Date.now(), // Unique ID based on timestamp
        date: now.toISOString(),
        calculation: calculation,
        result: result
    };
    
    calculationHistory.push(historyItem);
    saveHistory();
    renderHistory();
}

function saveHistory() {
    localStorage.setItem('calculatorHistory', JSON.stringify(calculationHistory));
}

function loadHistory() {
    // Load calculation history
    const savedHistory = localStorage.getItem('calculatorHistory');
    if (savedHistory) {
        calculationHistory = JSON.parse(savedHistory);
    }
}

function loadSettings() {
    // Load dark mode preference
    const darkModePreference = localStorage.getItem('darkMode');
    if (darkModePreference === 'true') {
        document.body.classList.add('dark-mode');
        darkModeButton.textContent = '🌙';
    }
    
    // Load sound preference
    const soundPreference = localStorage.getItem('soundEnabled');
    if (soundPreference === 'false') {
        soundEnabled = false;
        soundToggleButton.textContent = '🔇';
        soundToggleButton.classList.add('disabled');
    }
    
    // Load animation preference
    const animationPreference = localStorage.getItem('animationsEnabled');
    if (animationPreference === 'false') {
        animationsEnabled = false;
        animationToggleButton.textContent = '✖️';
        animationToggleButton.classList.add('disabled');
    }
}

function renderHistory() {
    // Clear current history display
    historyContent.innerHTML = '';
    
    if (calculationHistory.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.classList.add('history-empty');
        emptyMessage.textContent = 'No calculations yet';
        historyContent.appendChild(emptyMessage);
        return;
    }
    
    // Group history items by date
    const groupedHistory = groupHistoryByDate(calculationHistory);
    
    // Render each group
    Object.keys(groupedHistory).forEach(dateKey => {
        const dateGroup = document.createElement('div');
        dateGroup.classList.add('history-date-group');
        
        const dateHeader = document.createElement('h4');
        dateHeader.classList.add('history-date-header');
        dateHeader.textContent = dateKey;
        dateGroup.appendChild(dateHeader);
        
        // Add each calculation in this date group
        groupedHistory[dateKey].forEach(item => {
            const historyItem = document.createElement('div');
            historyItem.classList.add('history-item');
            
            const dateElement = document.createElement('div');
            dateElement.classList.add('history-date');
            dateElement.textContent = formatTime(new Date(item.date));
            
            const calculationElement = document.createElement('div');
            calculationElement.classList.add('history-calculation');
            calculationElement.textContent = item.calculation;
            
            const resultElement = document.createElement('div');
            resultElement.classList.add('history-result');
            resultElement.textContent = `= ${item.result}`;
            
            historyItem.appendChild(dateElement);
            historyItem.appendChild(calculationElement);
            historyItem.appendChild(resultElement);
            
            // Add click event to use this calculation
            historyItem.addEventListener('click', () => {
                currentOperand = item.result;
                updateDisplay();
                toggleHistoryPanel();
                playSound('click');
            });
            
            dateGroup.appendChild(historyItem);
        });
        
        historyContent.appendChild(dateGroup);
    });
}

function groupHistoryByDate(history) {
    const grouped = {};
    
    history.forEach(item => {
        const date = new Date(item.date);
        const dateKey = formatDate(date);
        
        if (!grouped[dateKey]) {
            grouped[dateKey] = [];
        }
        
        grouped[dateKey].push(item);
    });
    
    return grouped;
}

function formatDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (isSameDay(date, today)) {
        return 'Today';
    } else if (isSameDay(date, yesterday)) {
        return 'Yesterday';
    } else {
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
}

function formatTime(date) {
    return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit'
    });
}

function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

function toggleHistoryPanel() {
    historyPanel.classList.toggle('active');
    renderHistory(); // Re-render history when panel is opened
}

// Initialize the calculator when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initialize);
