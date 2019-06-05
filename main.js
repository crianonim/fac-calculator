const OPERATORS = ["/", "+", "-", "x"];
const DIGITS = "1234567890".split('');
const OPERATIONS = {
    "/": (a, b) => a / b,
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "x": (a, b) => a * b
}
const MAX_INPUT = 16;
let total = 0;
let operation = null;
let lastOperation = null;
let currentInput = "0";
let afterEquals = false; // after '=' so 
let noInputYet = true;
let DISPLAY;
let buttons = {};

window.addEventListener("load", init);

function init() {
    DISPLAY = document.getElementById("display");
    document.querySelectorAll('#buttons button').forEach(el => el.addEventListener("click", handleButton));
    document.addEventListener('keydown', handleKeyboard);
    buttonElementsDictionary();
    updateDisplay();
    run_tests();
}
function buttonElementsDictionary() {
    document.querySelectorAll('#buttons button').forEach(elem => {
        buttons[elem.textContent] = elem;
        elem.addEventListener("transitionend", (event => {
            event.target.classList.remove("pressed");
        }))
        elem.addEventListener("transitioncancel", (event => {
            event.target.classList.remove("pressed");
        }));
    })
}
function handleKeyboard(event) {
    const exchange = { "Enter": "=", "*": "x", "Escape": "C", "Delete": "DEL", "Backspace": "DEL" };
    let key = event.key;
    key = exchange[key] ? exchange[key] : key;
    if ([...OPERATORS, ...DIGITS, "=", ".", "C", "DEL"].includes(key)) {
        processInput(key)
    }
}
function handleButton(event) {
    let input = event.target.innerText;
    processInput(input);
}
function animateButton(input) {
    elem = buttons[input]
    elem.classList.add("pressed");
}

function processInput(input) {
    animateButton(input);
    if (DIGITS.includes(input)) {
        processDigit(input)
    } else if (OPERATORS.includes(input)) {
        processOperator(input);
    } else if (input == "." && !currentInput.includes(".")) {
        processPeriod()
    } else if (input == "C") {
        processClear();
    } else if (input == "DEL") {
        processDelete();
    } else if (input == "=") {
        processEquals();
    }
}

function processDigit(input) {
    if (currentInput == "0" || afterEquals) {
        currentInput = input;
        afterEquals = false;
    } else {
        if (currentInput.length < MAX_INPUT) {
            currentInput += input;
        }
    }
    noInputYet = false;
    updateDisplay();
}

function processOperator(input) {

    if (afterEquals) {
        currentInput = total + "";
        afterEquals = false;
    }
    if (input == "-" && currentInput == "0") {
        currentInput = "-";
        updateDisplay("-");
        return
    }
    if (!noInputYet) {

        if (operation) {
            evaluateOperation();
        } else {
            total = Number(currentInput)
        }
    }
    operation = OPERATIONS[input];
    noInputYet = true;
    updateDisplay(total);
    currentInput = "0";
}
function processPeriod() {
    if (afterEquals) {
        currentInput = "0";
        afterEquals = false;
    }
    currentInput += ".";
    updateDisplay();
}
function processClear() {
    total = 0;
    operation = null;
    currentInput = "0";
    afterEquals = false;
    lastOperation = null;
    noInputYet = true;
    updateDisplay();
}
function processDelete() {
    if (currentInput.length == 1) {
        currentInput = "0";
        noInputYet = true;
    } else {
        currentInput = currentInput.substr(0, currentInput.length - 1);
    }
    updateDisplay();
}

function processEquals() {
    noInputYet = true;
    if (!afterEquals) {
        if (operation) {
            evaluateOperation();
        }
        else {
            total = Number(currentInput);
        }
        currentInput = "0";
        updateDisplay(total);
        afterEquals = true;
    } else if (lastOperation) {
        total = lastOperation();
        updateDisplay(total);
    }
}


function roundToPrecision(number) {
    const precision = 10 ** 6;
    return Math.round(number * precision) / precision
}

function evaluateOperation() {
    let operationToBeRepeated = operation;
    let inputToBeRepeated = Number(currentInput)
    lastOperation = () => roundToPrecision(operationToBeRepeated(total, inputToBeRepeated))
    total = roundToPrecision(operation(total, Number(currentInput)));
    operation = null;
}

function updateDisplay(value = currentInput) {
    let str = value + "";
    let number = Number(value);
    if (str.length > MAX_INPUT - 1) {
        str = number.toPrecision(MAX_INPUT);
        if (str.length > MAX_INPUT - 1) { // if e+24 etc.
            str = number.toPrecision(MAX_INPUT - 6);
        }
    }
    DISPLAY.innerText = str;
}


function run_tests() {
    const tests = [
        ["1 0 / - 2 =", -5],
        ["1 0 + 5 / 3 = - 3 =", 2],
        ["/ / =", NaN],
        ["- 3 x - 3 x - 3 =", -27],
        ["5 / x + 4 =", 9],
        [". . . . 2 . + . . 1 =", 0.3],
        ["DEL DEL 3 DEL . 1 + DEL . 2 =", 0.3],
        ["1 2 C - 1 2 x / - 2 =",24 ]
    ]
    let failedCount = tests.length - tests.filter(test => test_input(...test)).length;
    if (failedCount) {
        console.error(`${failedCount} TESTS FAILED!!!`);
    }
    return !failedCount;
}

function test_input(inputString, expected) {
    processInput("C");

    inputString.split(' ').forEach(processInput);
    let success = (expected + "") == (total + ""); // so that NaN will equal to itself
    console.log(inputString, ", expected: ", expected, success ? ' OK ' : (' FAIL, got: ' + total));

    processInput("C");
    return success;
}