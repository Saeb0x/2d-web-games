/** @type {HTMLCanvasElement} */
var canvas = document.querySelector("#myCanvas");
var context = canvas.getContext("2d");

// Pong with a twist 

const playerOne =
{
    x: 50,
    y: 50,
    width: 20,
    height: 100,
    speed: 3,
    score: 0
}

const playerOneKeys =
{
    KeyA: false,
    KeyD: false,
    KeyW: false,
    KeyS: false
}

const playerTwo =
{
    x: 530,
    y: 50,
    width: 20,
    height: 100,
    speed: 3,
    score: 0
}

const playerTwoKeys =
{
    ArrowLeft: false,
    ArrowRight: false,
    ArrowUp: false,
    ArrowDown: false,
}

let speed = 3;
const ball =
{
    x: canvas.width / 2,
    y: canvas.height / 2,
    width: 10,
    height: 10,
    speedX: speed,
    speedY: -speed

}

window.addEventListener('keydown', keyPressed);
window.addEventListener('keyup', keyReleased);

function startGame() {
    requestAnimationFrame(draw);
}


function draw() {

    context.clearRect(0, 0, canvas.width, canvas.height);
    move();

    context.fillStyle = '#ff0000';
    context.fillRect(playerOne.x, playerOne.y, playerOne.width, playerOne.height);

    context.fillStyle = '#0000ff';
    context.fillRect(playerTwo.x, playerTwo.y, playerTwo.width, playerTwo.height);

    context.fillStyle = '#ffffff';
    context.fillRect(ball.x, ball.y, ball.width, ball.height);

    let score = `PlayerOne: ${playerOne.score}, PlayerTwo: ${playerTwo.score}`;
    context.font = '20px Comic';
    context.textAlign = 'center';
    context.fillStyle = '#ffffff';
    context.fillText(score, 300, 30);

    requestAnimationFrame(draw);
}

function keyPressed(event) {
    if (event.code in playerOneKeys) {
        playerOneKeys[event.code] = true;
    };

    if (event.code in playerTwoKeys) {
        playerTwoKeys[event.code] = true;
    };
}

function keyReleased(event) {

    if (event.code in playerOneKeys) {
        playerOneKeys[event.code] = false;
    };

    if (event.code in playerTwoKeys) {
        playerTwoKeys[event.code] = false;
    };
}

function move() {

    // PlayerOne Movement
    if (playerOneKeys.KeyA && playerOne.x >= 0) {
        playerOne.x -= playerOne.speed;
    }
    if (playerOneKeys.KeyD && playerOne.x + playerOne.width <= canvas.width) {
        playerOne.x += playerOne.speed;
    }
    if (playerOneKeys.KeyW && playerOne.y >= 0) {
        playerOne.y -= playerOne.speed;
    }
    if (playerOneKeys.KeyS && playerOne.y + playerOne.height <= canvas.height) {
        playerOne.y += playerOne.speed;
    }

    // PlayerTwo Movement
    if (playerTwoKeys.ArrowLeft && playerTwo.x >= 0) {
        playerTwo.x -= playerTwo.speed;
    }
    if (playerTwoKeys.ArrowRight && playerTwo.x + playerTwo.width <= canvas.width) {
        playerTwo.x += playerTwo.speed;
    }
    if (playerTwoKeys.ArrowUp && playerTwo.y >= 0) {
        playerTwo.y -= playerTwo.speed;
    }
    if (playerTwoKeys.ArrowDown && playerTwo.y + playerTwo.height <= canvas.height) {
        playerTwo.y += playerTwo.speed;
    }

    // Ball Movement
    ball.x += ball.speedX;
    ball.y += ball.speedY;


    if (ball.x + ball.width >= canvas.width) {
        playerOne.score++;
        ballReset();
    }
    else if (ball.x <= 0) {
        playerTwo.score++;
        ballReset();
    }

    if (ball.y <= 0 || ball.y + ball.height >= canvas.height) {
        ball.speedY *= -1;
    }

    if (checkCollision(ball, playerOne)) {
        ball.speedX *= -1;
        var case1 = playerOne.y + playerOne.height / 2;
        var case2 = ball.y + ball.height / 2;
        if (case1 < case2) {
            ball.speedY = speed;
        }
        else {
            ball.speedY = -speed;
        }
    }

    if (checkCollision(ball, playerTwo)) {
        ball.speedX *= -1;
        var case1 = playerTwo.y + playerTwo.height / 2;
        var case2 = ball.y + ball.height / 2;

        if (case1 < case2) {
            ball.speedY = speed;
        }
        else {
            ball.speedY = -speed;
        }
    }

}

function ballReset() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speedX = speed;
    ball.speedY = -speed;
}

function checkCollision(obj1, obj2) {

    var collision = obj1.x + obj1.width > obj2.x && obj1.x < obj2.x + obj2.width && obj1.y < obj2.y + obj2.height && obj1.y + obj1.height > obj2.y;
    if (collision) {
        console.log("Collision");
    }

    return collision;
}
