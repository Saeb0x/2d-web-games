let renderer = PIXI.autoDetectRenderer();
renderer.resize(800, 557);
renderer.backgroundColor = 0xFFFFFF;

document.body.appendChild(renderer.view);
renderer.view.style.border = "1px dashed black";

// Centering our canvas
renderer.view.style.position = "absolute";
renderer.view.style.top = "50%";
renderer.view.style.left = "50%";
renderer.view.style.transform = "translate3d(-50%, -50%, 0)";

let stage = new PIXI.Container();
let loader = new PIXI.Loader();
let resources = loader.resources;
let state;

loader.add([
    "Assets/TreasureHunt/Field.png",
    "Assets/TreasureHunt/explorer.png",
    "Assets/TreasureHunt/door.png",
    "Assets/TreasureHunt/blob.png",
    "Assets/TreasureHunt/treasure.png"
]).load(setup);

let field, explorer, door, treasure, healthBar, message, gameScene, gameOverScene, blobs;

function setup() {

    gameScene = new PIXI.Container();
    stage.addChild(gameScene);

    field = new PIXI.Sprite.from("Assets/TreasureHunt/Field.png");
    gameScene.addChild(field);

    door = new PIXI.Sprite.from("Assets/TreasureHunt/door.png");
    door.x = 30;
    door.y = 12;
    gameScene.addChild(door);

    treasure = new PIXI.Sprite.from("Assets/TreasureHunt/treasure.png");
    treasure.x = 710;
    treasure.y = 510;
    gameScene.addChild(treasure);

    explorer = new PIXI.Sprite.from("Assets/TreasureHunt/explorer.png");
    explorer.x = 60;
    explorer.y = renderer.view.height / 2 - explorer.height / 2;
    explorer.velocityX = 0;
    explorer.velocityY = 0;
    gameScene.addChild(explorer);

    let numberOfBlobs = 10,
        spacing = 48,
        xOffset = 150,
        speed = 2,
        direction = 1;


    blobs = [];

    for (let i = 0; i < numberOfBlobs; i++) {
        const blob = new PIXI.Sprite.from("Assets/TreasureHunt/blob.png");

        const x = xOffset + spacing * i;
        const y = randomInt(0, renderer.view.height - blob.height);

        blob.x = x;
        blob.y = y;
        blob.vy = speed * direction;

        direction *= -1;

        blobs.push(blob);
        gameScene.addChild(blob);

    }

    // Health Bar
    healthBar = new PIXI.Container();
    healthBar.position.set(renderer.view.width - 190, 20);
    gameScene.addChild(healthBar);

    // black rectangle
    const innerBar = new PIXI.Graphics();
    innerBar.beginFill(0x000000);
    innerBar.drawRect(0, 0, 128, 8);
    innerBar.endFill();
    healthBar.addChild(innerBar);

    // red outer rectangle 
    const outerBar = new PIXI.Graphics();
    outerBar.beginFill(0xFF3300);
    outerBar.drawRect(0, 0, 128, 8);
    outerBar.endFill();
    healthBar.addChild(outerBar);

    healthBar.outer = outerBar;

    // Game Over Scene
    gameOverScene = new PIXI.Container();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);


    const style = new PIXI.TextStyle({
        fontFamily: "Comic",
        fontSize: 64,
        fill: "red"
    });

    message = new PIXI.Text("The End!", style);
    message.x = renderer.view.width / 2 - message.width / 2;
    message.y = renderer.view.height / 2 - message.height / 2;
    gameOverScene.addChild(message);

    const left = keyboard("ArrowLeft"),
        right = keyboard("ArrowRight"),
        up = keyboard("ArrowUp"),
        down = keyboard("ArrowDown");

    left.press = () => {
        explorer.velocityX = -2;
        explorer.velocityY = 0;
    }
    left.release = () => {
        if (!right.isDown && explorer.velocityY === 0) {
            explorer.velocityX = 0;
        }
    }

    right.press = () => {
        explorer.velocityX = 2;
        explorer.velocityY = 0;
    }
    right.release = () => {
        if (!left.isDown && explorer.velocityY === 0) {
            explorer.velocityX = 0;
        }
    }

    up.press = () => {
        explorer.velocityX = 0;
        explorer.velocityY = -2;
    }
    up.release = () => {
        if (!down.isDown && explorer.velocityX === 0) {
            explorer.velocityY = 0;
        }
    }

    down.press = () => {
        explorer.velocityX = 0;
        explorer.velocityY = 2;
    }
    down.release = () => {
        if (!up.isDown && explorer.velocityX === 0) {
            explorer.velocityY = 0;
        }
    }

    state = play;
    gameLoop();
}


function gameLoop() {

    requestAnimationFrame(gameLoop); // 60fps

    // Taking inputs, updating, rendering (drawing to the screen)
    state();

    renderer.render(stage);

}

function play() {

    // Game's Logic
    explorer.x += explorer.velocityX;
    explorer.y += explorer.velocityY;

    contain(explorer, {
        x: 0,
        y: 0,
        width: renderer.view.width - 10,
        height: renderer.view.height - 10
    })

    let explorerHit = false;


    blobs.forEach(function (blob) {
        blob.y += blob.vy;

        const blobHitWalls = contain(blob, {
            x: 10,
            y: 10,
            width: renderer.view.width - 10,
            height: renderer.view.height - 10
        })

        if (blobHitWalls) {
            if (blobHitWalls.has("top") || blobHitWalls.has("bottom")) {
                blob.vy *= -1;
            }
        }

        if (hitTestRectangle(explorer, blob)) {
            explorerHit = true;
        }
    })

    if (explorerHit) {
        explorer.alpha = 0.5;
        healthBar.outer.width -= 1;
    } else {
        explorer.alpha = 1;
    }

    if (healthBar.outer.width < 0) {
        state = end;
        message.text = "You Lost!";
    }

    if (hitTestRectangle(explorer, treasure)) {
        treasure.x = explorer.x + 8;
        treasure.y = explorer.y + 8;
    }

    if (hitTestRectangle(treasure, door)) {
        state = end;
        message.text = "You Won!";
    }

}

function end() {
    gameOverScene.visible = true;
    gameScene.visible = false;
}

function keyboard(keyCode) {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    key.downHandler = event => {
        if (event.code == key.code) {
            if (key.isUp && key.press) {
                key.press();
                key.isDown = true;
                key.isUp = false;
            }
        }
        event.preventDefault();
    }

    key.upHandler = event => {
        if (event.code == key.code) {
            if (key.isDown && key.release) {
                key.release();
                key.isDown = false;
                key.isUp = true;
            }
        }
        event.preventDefault();
    }

    window.addEventListener('keydown', key.downHandler);
    window.addEventListener('keyup', key.upHandler);

    return key;
}

function contain(sprite, container) {
    var collision = new Set();

    // Left
    if (sprite.x < container.x) {
        sprite.x = container.x;
        collision.add("left");
    }

    // Top
    if (sprite.y < container.y) {
        sprite.y = container.y;
        collision.add("top");
    }

    // Right
    if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width;
        collision.add("right");
    }

    // Bottom
    if (sprite.y + sprite.height > container.height) {
        sprite.y = container.height - sprite.height;
        collision.add("bottom");
    }

    if (collision.size === 0) {
        collision = undefined;
    }

    return collision;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function hitTestRectangle(rect1, rect2) {

    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    hit = false;

    rect1.centerX = rect1.x + rect1.width / 2;
    rect1.centerY = rect1.y + rect1.height / 2;
    rect2.centerX = rect2.x + rect2.width / 2;
    rect2.centerY = rect2.y + rect2.height / 2;

    rect1.halfWidth = rect1.width / 2;
    rect1.halfHeight = rect1.height / 2;
    rect2.halfWidth = rect2.width / 2;
    rect2.halfHeight = rect2.height / 2;

    vx = rect1.centerX - rect2.centerX;
    vy = rect1.centerY - rect2.centerY;
    combinedHalfWidths = rect1.halfWidth + rect2.halfWidth;
    combinedHalfHeights = rect1.halfHeight + rect2.halfWidth;

    if (Math.abs(vx) < combinedHalfWidths) {
        if (Math.abs(vy) < combinedHalfHeights) {
            hit = true; // collision
        } else {
            hit = false; // no collision in the y-axis
        }
    }
    else {
        hit = false; // no collision in the x-axis
    }

    return hit;
}