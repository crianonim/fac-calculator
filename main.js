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
        console.log(currentInput);
        updateDisplay();

    } else if (OPERATORS.includes(input)) {
        if (operation) {
            evaluateOperation();
        } else {
            total = Number(currentInput)
        }
        operation = OPERATIONS[input];
        updateDisplay(total);
        currentInput = "0";


    } else if (input == "Clear") {
        total = 0;
        operation = null;
        currentInput = "0";
        updateDisplay();
    } else if (input == "=") {
        if (operation) {
            evaluateOperation();
            updateDisplay(total);
            currentInput = total + "";
            afterEquals = true;
        } else {

        }

    }
}
function evaluateOperation() {
    console.log(total, Number(currentInput))
    total = operation(total, Number(currentInput));
    operation = null;
}
function updateDisplay(value = currentInput) {
    DISPLAY.innerText = value + "";
}