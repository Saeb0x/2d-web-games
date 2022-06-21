/** @type {HTMLCanvasElement} */
var canvas = document.querySelector("#myCanvas");
var context = canvas.getContext("2d");


// Dice Game

var diceX = 40;
var diceY = 40;
var diceWidth = 100;
var diceHeight = 100;
var dotRadius = 6;

var dX; // Horizontal positioning
var dY; // Vertical positioning

var firstTurn = true;
var point;

function throwdice() {
    var sum;
    var diceRoll = Math.floor(Math.random() * 6) + 1;
    sum = diceRoll;
    dX = diceX;
    dY = diceY;
    drawface(diceRoll);
    dX = diceX + 150;
    diceRoll = Math.floor(Math.random() * 6) + 1;
    sum += diceRoll;
    drawface(diceRoll);

    var credit = Number(document.f.credit.value);

    if (credit < 10) {
        alert("You ran out of money! Add some more and try again.");
        return;
    }

    document.f.credit.value = String(credit);

    if (firstTurn) {
        credit -= 20;
        document.f.credit.value = String(credit);
        switch (sum) {
            case 7:
            case 11:
                document.f.outcome.value = "You Win!";
                credit = Number(document.f.credit.value);
                credit += 20;
                document.f.credit.value = String(credit);
                break;
            case 2:
            case 3:
            case 12:
                document.f.outcome.value = "You Lose!";
                break;
            default:
                point = sum;
                document.f.pv.value = point;
                firstTurn = false;
                document.f.stage.value = "Need follow-up throw";
                document.f.outcome.value = "  ";
        }
    }
    else {
        switch (sum) {
            case point:
                document.f.outcome.value = "You Win!";
                document.f.stage.value = "Back to first throw";
                document.f.pv.value = "  ";
                firstTrue = true;
                credit = Number(document.f.credit.value);
                credit += 20;
                document.f.credit.value = String(credit);
                break;
            case 7:
                document.f.outcome.value = "You Lose!";
                document.f.stage.value = "Back to first throw";
                document.f.pv.value = "  ";
                firstTrue = true;
                break;
        }
    }
}


function drawface(d) {

    context.clearRect(dX, dY, diceWidth, diceHeight);

    context.lineWidth = 5;
    context.strokeStyle = 'red';
    context.strokeRect(dX, dY, diceWidth, diceHeight);

    context.fillStyle = 'black';

    switch (d) {
        case 1:
            draw1();
            break;
        case 2:
            draw2();
            break;
        case 3:
            draw2();
            draw1();
            break;
        case 4:
            draw4();
            break;
        case 5:
            draw4();
            draw1();
            break;
        case 6:
            draw4();
            draw2mid();
            break;
    }
}

function draw1() {
    var dotX;
    var dotY;

    context.beginPath();
    dotX = dX + 0.5 * diceWidth;
    dotY = dY + 0.5 * diceHeight;
    context.arc(dotX, dotY, dotRadius, 0, 2 * Math.PI, true);
    context.closePath();
    context.fill();
}

function draw2() {
    var dotX;
    var dotY;

    context.beginPath();
    dotX = dX + 3 * dotRadius;
    dotY = dY + 3 * dotRadius;
    context.arc(dotX, dotY, dotRadius, 0, 2 * Math.PI, true);

    dotX = dX + diceWidth - 3 * dotRadius;
    dotY = dY + diceHeight - 3 * dotRadius;
    context.arc(dotX, dotY, dotRadius, 0, 2 * Math.PI, true);
    context.closePath();
    context.fill();
}

function draw4() {
    var dotX;
    var dotY;
    context.beginPath();
    dotX = dX + 3 * dotRadius;
    dotY = dY + 3 * dotRadius;
    context.arc(dotX, dotY, dotRadius, 0, 2 * Math.PI, true);

    dotX = dX + diceWidth - 3 * dotRadius;
    dotY = dY + diceHeight - 3 * dotRadius;
    context.arc(dotX, dotY, dotRadius, 0, 2 * Math.PI, true);
    context.closePath();
    context.fill();

    context.beginPath();
    dotX = dX + 3 * dotRadius;
    dotY = dY + diceHeight - 3 * dotRadius;
    context.arc(dotX, dotY, dotRadius, 0, 2 * Math.PI, true);

    dotX = dX + diceWidth - 3 * dotRadius;
    dotY = dY + 3 * dotRadius;
    context.arc(dotX, dotY, dotRadius, 0, 2 * Math.PI, true);
    context.closePath();
    context.fill();
}

function draw2mid() {
    var dotX;
    var dotY;

    context.beginPath();
    dotX = dX + 3 * dotRadius;
    dotY = dY + 0.5 * diceHeight;
    context.arc(dotX, dotY, dotRadius, 0, 2 * Math.PI, true);

    dotX = dX + diceWidth - 3 * dotRadius;
    dotY = dY + 0.5 * diceHeight;
    context.arc(dotX, dotY, dotRadius, 0, 2 * Math.PI, true);
    context.closePath();
    context.fill();
}