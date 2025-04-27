# Web Calculator Application

A fully functional, visually appealing calculator web application built with HTML, CSS, and JavaScript.

## Features

- Basic arithmetic operations: addition, subtraction, multiplication, and division
- Clean, modern user interface with responsive design
- Dark mode toggle
- Keyboard support for all operations
- Error handling for division by zero and invalid inputs
- Delete button to remove the last digit
- Clear button to reset the calculator
- Dynamic font sizing for large numbers
- **Calculation History**: Records all calculations with date and time stamps
  - History is organized by date (Today, Yesterday, and older dates)
  - History is preserved even when the browser is closed
  - Click on any history item to reuse the result
- **Sound Effects**: Audio feedback for different actions
  - Different sounds for number buttons, operators, equals, clear, and errors
  - Sound toggle button to enable/disable sounds (keyboard shortcut: 'S')
- **Animations**: Visual feedback for calculations
  - Floating particles based on the operation type
  - Special animations for equals and error states
  - Animation toggle button to enable/disable animations (keyboard shortcut: 'A')

## Usage

1. Open `index.html` in any modern web browser
2. Use the calculator by clicking the buttons or using your keyboard:
   - Numbers: 0-9 keys
   - Operators: +, -, *, /
   - Equals: Enter or =
   - Clear: Escape or Delete
   - Backspace: Delete the last digit
   - Dark Mode: Toggle using the ☀️/🌙 button
   - History: Toggle using the 📋 button or press 'H' key
   - Sound: Toggle using the 🔊/🔇 button or press 'S' key
   - Animations: Toggle using the ✨/✖️ button or press 'A' key

## Project Structure

```
calculator-project/
├── index.html      # Main HTML structure
├── style.css       # Styling and layout
├── script.js       # Calculator functionality
├── assets/
│   └── sounds/     # Sound effect files
│       ├── click.mp3
│       ├── operation.mp3
│       ├── equals.mp3
│       ├── clear.mp3
│       └── error.mp3
└── README.md       # Documentation
```

## Technical Implementation

- **HTML**: Semantic markup for the calculator structure
- **CSS**: Modern styling with CSS Grid for button layout, responsive design, and dark mode
- **JavaScript**: Event handling, calculation logic, keyboard support, and local storage for history
- **LocalStorage**: Used to persist calculation history and user preferences
- **Audio API**: Used for playing sound effects
- **CSS Animations**: Used for visual feedback and particle effects

## Responsive Design

The calculator is fully responsive and works on:
- Mobile devices
- Tablets
- Desktop computers

## Browser Compatibility

Compatible with all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge
