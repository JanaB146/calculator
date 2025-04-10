//Aufgabe:
// - der Taschenrechner muss alle üblichen Funktionen abdecken
// - kein import von Bibliotheken
// - alle mathematischen Funktionen müssen selbst erstellt werden

function myFunction(button) {
    var eingabe = button.value;
    var display = document.getElementById("zahlen");
    let aktuellerText = display.innerHTML;
    let ergebnisListe = [];

    //Eingaben löschen
    if (eingabe === "C" || eingabe === "CE") {
        display.innerHTML = "0";
    } else if (eingabe === "del") {
        if(aktuellerText.length > 1) {
            display.innerHTML = aktuellerText.slice(0, -1);
        } else {
            display.innerHTML = "0";
        }
    //Ausgabe vom Ergebnis
    } else if (eingabe === "=") {
        try {
            let berechnung = aktuellerText;
            let ergebnis = calculate(berechnung);
            display.innerHTML = ergebnis;
        } catch(e) {
            display.innerHTML = "Fehler";
        }
    } else {
        if (display.innerHTML === "0") {
            display.innerHTML = eingabe;
        } else {
            display.innerHTML += eingabe;
        }
    }
}

function calculate(expression) {
    expression = expression.replace(/x/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/,/g, ".");

    expression = handleWurzeln(expression);
    expression = handleQuadrate(expression);
    expression = handleProzent(expression);

    const tokens = expression.match(/(\d+(\.\d+)?|[+\-*/])/g);
    if (!tokens) return "Fehler";

    //Multiplizieren & Dividieren
    let i = 0;
    while (i < tokens.length) {
        if (tokens[i] === "*" || tokens[i] === "/") {
            let a = parseFloat(tokens[i - 1]);
            let b = parseFloat(tokens[i + 1]);
            let res = tokens[i] === "*" ? a * b : a / b;
            tokens.splice(i - 1, 3, res.toString());
            i = 0;
        } else {
            i++;
        }
    }
    //Addieren & Subtrahieren
    i = 0;
    while (i < tokens.length) {
        if (tokens[i] === "+" || tokens[i] === "-") {
            let a = parseFloat(tokens[i - 1]);
            let b = parseFloat(tokens[i + 1]);
            let res = tokens[i] === "+" ? a + b : a - b;
            tokens.splice(i - 1, 3, res.toString());
            i = 0;
        } else {
            i++;
        }
    }

    return tokens[0];
}

function handleWurzeln(expression) {
    while (expression.includes("√")) {
        const wurzelRegex = /√(\d+(\.\d+)?)/;
        const match = expression.match(wurzelRegex);
        if (match) {
            let inside = match[1];
            let value = parseFloat(inside);
            let result = wurzel(value);
            expression = expression.replace(wurzelRegex, result);
        } else {
            return "Fehler: Ungültige Wurzel";
        }
    }
    return expression;
}
function wurzel(x) {
    if (x < 0) return "Fehler: √ aus negativer Zahl";
    
    let guess = x / 2;
    let prevGuess;

    do {
        prevGuess = guess;
        guess = (guess + x / guess) / 2;
    } while (Math.abs(prevGuess - guess) > 0.00001);

    return guess;
}

function handleQuadrate(expression) {
    while (expression.includes("²")) {
        const quadratRegex = /(\d+(\.\d+)?)²/;
        const match = expression.match(quadratRegex);
        if (match) {
            let inside = match[1];
            let value = parseFloat(inside);
            let result = quadrat(value);
            expression = expression.replace(match[0], result);
        } else {
            return "Fehler: Ungültiges Quadrat";
        }
    }
    return expression;
}
function quadrat(x) {
    return x * x;
}

function handleProzent(expression) {
    const prozentRegex = /(\d+(\.\d+)?)%/;
    let match;
    while (match = expression.match(prozentRegex)) {
        let number = parseFloat(match[1]);
        let percentageValue = number / 100;
        expression = expression.replace(match[0], percentageValue);
    }
    return expression;
}