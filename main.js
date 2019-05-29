const OPERATORS = ["/", "+", "-", "x"];
const DIGITS = "1234567890".split('');
const OPERATIONS = {
    "/": (a, b) => a / b,
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "x": (a, b) => a * b
}
let total = 0;
let operation = null;
let currentInput = "0";
let afterEquals = false; // after '=' so 
let DISPLAY;

window.addEventListener("load", init);

function init() {
    DISPLAY = document.getElementById("display");
    document.querySelectorAll('main button').forEach(el => el.addEventListener("click", handleButton))
    updateDisplay();
}

function handleButton(event) {
    // console.log("BEFORE", total, operation, currentInput)
    let input = event.target.innerText;
    processInput(input);
}

function processInput(input) {
    if (DIGITS.includes(input)) {
        if (currentInput == "0" || afterEquals) {
            currentInput = input;
            afterEquals = false;
        } else {
            currentInput += input;
        }
        updateDisplay();

    } else if (OPERATORS.includes(input)) {
        if (operation) {
            evaluateOperation();
        } else {
            total = Number(currentInput)
        }
        afterEquals = false;
        operation = OPERATIONS[input];
        updateDisplay(total);
        currentInput = "0";
    } else if (input == "." && !currentInput.includes(".")) {
        if (afterEquals) {
            currentInput = "0";
            afterEquals = false;
        }
        currentInput += ".";
        updateDisplay();
    } else if (input == "Clear") {
        total = 0;
        operation = null;
        currentInput = "0";
        afterEquals = false;
        updateDisplay();
    } else if (input == "=" && !afterEquals) {
        if (operation) {
            evaluateOperation();
        }
        else {
            total = Number(currentInput);
        }
        currentInput = "0";
        updateDisplay(total);
        afterEquals = true;
    }
}
function evaluateOperation() {
    total = operation(total, Number(currentInput));
    operation = null;
}
function updateDisplay(value = currentInput) {
    DISPLAY.innerText = value + "";
}