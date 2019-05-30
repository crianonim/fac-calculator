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
let currentInput = "0";
let afterEquals = false; // after '=' so 
let DISPLAY;


window.addEventListener("load", init);

function init() {
    DISPLAY = document.getElementById("display");
    document.querySelectorAll('main button').forEach(el => el.addEventListener("click", handleButton));
    document.addEventListener('keydown', handleKeyboard)
    updateDisplay();
    run_tests();
}
function handleKeyboard(event) {
    const exchange = { "Enter": "=", "*": "x", "Escape": "C", "Delete": "DEL" };
    let key = event.key;
    key = exchange[key] ? exchange[key] : key;
    if ([...OPERATORS, ...DIGITS, "=", ".", "C","DEL"].includes(key)) {
        processInput(key)
    }
    console.log(event.key,key)
}
function handleButton(event) {
    let input = event.target.innerText;
    processInput(input);
}

function processInput(input) {
    if (DIGITS.includes(input)) {
        if (currentInput == "0" || afterEquals) {
            currentInput = input;
            afterEquals = false;
        } else {
            if (currentInput.length < MAX_INPUT) {
                currentInput += input;
            }
        }
        updateDisplay();

    } else if (OPERATORS.includes(input)) {
        if (afterEquals) {
            currentInput = total + "";
            afterEquals = false;
        }
        if (input == "-" && currentInput == "0") {
            currentInput = "-";
            updateDisplay("-");
            return
        }
        if (operation) {
            evaluateOperation();
        } else {
            total = Number(currentInput)
        }
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
    } else if (input == "C") {
        total = 0;
        operation = null;
        currentInput = "0";
        afterEquals = false;
        updateDisplay();
    } else if (input == "DEL") {
        if (currentInput.length == 1) {
            currentInput = "0";
        } else {
            currentInput = currentInput.substr(0, currentInput.length - 1);
        }
        updateDisplay()
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

function roundToPrecision(number) {
    const precision = 10 ** 6;
    return Math.round(number * precision) / precision
}

function evaluateOperation() {
    total = roundToPrecision(operation(total, Number(currentInput)));
    operation = null;
}

function updateDisplay(value = currentInput) {
    DISPLAY.innerText = value + "";
}


function run_tests(){
    const tests=[
        ["1 0 / - 2 =",-5],
        ["1 0 + 5 / 3 = - 3 =",2],
        ["/ / =",NaN],
        ["- 3 x - 3 x - 3 =",-27]
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
    let success= (expected+"")==(total+""); // so that NaN will equal to itself
    console.log(inputString,", expected: ",expected,success?' OK ':(' FAIL, got: '+total));

    processInput("C");
    return success;
}