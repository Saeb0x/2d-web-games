/** @type {HTMLCanvasElement} */

// DOM Selectors
const canvas = document.querySelector("#myCanvas");
const context = canvas.getContext("2d");
const slider = document.querySelector("#slider input");
const speed = document.querySelector("#speed");

let screen, startsElement;
let starsParameters = {
    speed: 2,
    number: 250
}

setupStars();
updateStars();

speed.innerHTML = starsParameters.speed;
slider.oninput = function () {
    speed.innerHTML = this.value;
    starsParameters.speed = this.value;
}


window.onresize = function () {
    setupStars();
}

// Star Constructor
function Star() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.z = Math.random() * canvas.width;

    this.move = function () {
        this.z -= starsParameters.speed;
        if (this.z <= 0) {
            this.z = canvas.width;
        }
    };

    this.show = function () {
        let x, y, radius, opacity;
        x = (this.x - screen.c[0]) * (canvas.width / this.z);
        x = x + screen.c[0];
        y = (this.y - screen.c[1]) * (canvas.width / this.z);
        y = y + screen.c[1];

        radius = canvas.width / this.z;
        opacity = 1;

        context.beginPath();
        var r = Math.random, o = Math.round, s = 255;
        context.fillStyle = "rgba(" + o(r() * s) + ',' + o(r() * s) + ',' + o(r() * s) + ',' + opacity + ")";
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fill();
    }

}


function setupStars() {
    screen =
    {
        w: window.innerWidth,
        h: window.innerHeight,
        c: [window.innerWidth * 0.5, window.innerHeight * 0.5]
    };

    cancelAnimationFrame(updateStars);
    canvas.width = screen.w;
    canvas.height = screen.h;
    startsElement = [];
    for (var i = 0; i < starsParameters.number; i++) {
        startsElement[i] = new Star();
    }
}


function updateStars() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    startsElement.forEach(function (star) {
        star.show();
        star.move();
    }
    )
    requestAnimationFrame(updateStars);
}
