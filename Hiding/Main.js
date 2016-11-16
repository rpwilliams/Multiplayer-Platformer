var canvas = document.getElementById('screen');
var background = new Image();
background.src = './assets/Menu.png';

var game = new Game(canvas, update, render);
var player = new Player({ x: 15, y: 240 });
var hidingObject = new HidingObject();
var input = {
    up: false,
    down: false,
    left: false,
    right: false
}
const PLAYER_SPEED = 4;

window.onkeydown = function (event) {
    switch (event.key) {
        case "ArrowUp":
        case "w":
            input.up = true;
            event.preventDefault();
            break;
        case "ArrowDown":
        case "s":
            input.down = true;
            event.preventDefault();
            break;
        case "ArrowLeft":
        case "a":
            input.left = true;
            event.preventDefault();
            break;
        case "ArrowRight":
        case "d":
            input.right = true;
            event.preventDefault();
            break;
    }
}

window.onkeyup = function (event) {
    switch (event.key) {
        case "ArrowUp":
        case "w":
            input.up = false;
            event.preventDefault();
            break;
        case "ArrowDown":
        case "s":
            input.down = false;
            event.preventDefault();
            break;
        case "ArrowLeft":
        case "a":
            input.left = false;
            event.preventDefault();
            break;
        case "ArrowRight":
        case "d":
            input.right = false;
            event.preventDefault();
            break;
    }
}
		
function update(elapsedTime) {
    hidingObject.update(elapsedTime);
    player.update(elapsedTime);
}

function render(elapsedTime, ctx) {
    ctx.clearRect(0, 0, game.HEIGHT, game.WIDTH);
    ctx.drawImage(background, 0, 0, 960, 500);

    hidingObject.render(elapsedTime, ctx);
    player.render(elapsedTime, ctx);
}

function Player(position) {

    this.position = { x: 0, y: 289 };
    this.leftHitboxX = this.position.x;
    this.rightHitboxX = this.position.x + 30;
    this.playerFrame = 1;
    this.velocity = { x: 0, y: 0 };
    this.width = 63;
    this.height = 63;
    this.spritesheet = new Image();
    this.spritesheet.src = encodeURI('assets/PlayerSprite.png');
}

Player.prototype.update = function (time) {

    this.velocity.x = 0;
    if (input.left) this.velocity.x -= PLAYER_SPEED;
    if (input.right) this.velocity.x += PLAYER_SPEED;
    this.velocity.y = 0;

    // move the player
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.leftHitboxX += this.velocity.x;
    this.rightHitboxX += this.velocity.x;

    //Check for collision between player and hiding objects
    if(this.rightHitboxX > hidingObject.leftHitboxX && this.leftHitboxX < hidingObject.rightHitboxX)
    {
        hidingObject.playerCollision = true;

        //Change sprite if player is pressing the down arrow
        if (input.down) {
            this.spritesheet.src = encodeURI('assets/PlayerSpriteHidden.png');
            this.playerFrame = 2;
        }
        else {
            this.spritesheet.src = encodeURI('assets/PlayerSprite.png');
            this.playerFrame = 1;
        }
    }
    else
    {
        hidingObject.playerCollision = false;
    }
}

Player.prototype.render = function(time, ctx) {
	ctx.save();
	ctx.drawImage(
       this.spritesheet,
       this.playerFrame * 64, 0, this.width, this.height, this.position.x, this.position.y, this.width, this.height);
	   ctx.restore();
}

function HidingObject() {
    this.x = 250;
    this.y = 250;
    this.leftHitboxX = this.x;
    this.rightHitboxX = this.x + 150;
    this.arrowX = 315;
    this.arrowY = 160;
    this.downArrow = false;
    this.playerCollision = false;
    this.frame = 5;
    this.spaceBetweenFrames = 0;
    this.hidingObjectImage = new Image();
    this.hidingObjectImage.src = 'assets/boulder.png';
    this.arrowImage = new Image();
    this.arrowImage.src = 'assets/DownArrow.png';
}

HidingObject.prototype.update = function(elapsedTime)
{
    //Increments to the next arrow animation frame every 150 ms
    if (this.spaceBetweenFrames > 150) {
        if (this.frame > 0) {
            this.frame--;
        }
        else {
            this.frame = 5;
        }
        this.spaceBetweenFrames = 0;
    }

    if (input.down)
    {
        this.downArrow = true;
    }
    else
    {
        this.downArrow = false;
    }

    this.spaceBetweenFrames += elapsedTime;
}

HidingObject.prototype.render = function (elapsedTime, ctx) {
    ctx.save();
    ctx.drawImage(this.hidingObjectImage, this.x, this.y);

    //Display animated down arrow if player is standing on an object that can be hid behind 
    if (!this.downArrow && this.playerCollision)
    {
        ctx.drawImage(this.arrowImage, this.frame * 130, 0, 128, 175, this.arrowX, this.arrowY, 30, 45);
    }
    ctx.restore();
}


function Game(screen, updateFunction, renderFunction) {
    this.update = updateFunction;
    this.render = renderFunction;

    //Height/Width
    this.HEIGHT = screen.height;
    this.WIDTH = screen.width;

    // Set up buffers
    this.frontBuffer = screen;
    this.frontCtx = screen.getContext('2d');
    this.backBuffer = document.createElement('canvas');
    this.backBuffer.width = screen.width;
    this.backBuffer.height = screen.height;
    this.backCtx = this.backBuffer.getContext('2d');

    // Start the game loop
    this.oldTime = performance.now();
    this.paused = false;

}

Game.prototype.loop = function (newTime) {
    var game = this;
    var elapsedTime = newTime - this.oldTime;
    this.oldTime = newTime;

    if (!this.paused) this.update(elapsedTime);

    this.render(elapsedTime, this.frontCtx);

    // Flip the back buffer
    this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

var masterLoop = function (timestamp) {
    game.loop(timestamp);
    window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());