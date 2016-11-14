(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Player = require('./player');


/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var input = {
  up: false,
  down: false,
  left: false,
  right: false
}
var player = new Player();
var img = new Image()
img.src = 'assets/death_scythe.png';
//independent of the animation
var animationTimer = 0;
var animationCounter = 0;
var frameLength = 9;
//animation dependent
var numberOfSpirtes = 0; // how man y frames are there in the animation
var spirteWidth = 50; // width of each frame
var spirteHeight = 48; // height of each frame
var widthInGame = 80;   
var heightInGame = 128;
var xPlaceInImage = 0; // this should CHANGE for the same animation 
var yPlaceInImage = 0; // this should NOT change for the same animation

var animation = "stand still" // this will keep track of the animation
var tookAstep = "no"
 
/**
 * @function onkeydown
 * Handles keydown events
 */
window.onkeydown = function(event) {
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = true;
	  
	   
	  changeAnimation("moving up");
	   
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = true;
	   
	  changeAnimation("moving down");
	   
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
      input.left = true;
	   
	  changeAnimation("moving left");
	   
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = true;
	   
	  changeAnimation("moving right");
	  //console.log(yPlaceInImage);
      event.preventDefault();
      break;
  }
}

/**
 * @function onkeyup
 * Handles keydown events
 */
window.onkeyup = function(event) {
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = false;
	 
	  changeAnimation("stand still");

      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = false;
	  changeAnimation("stand still");
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
      input.left = false;
	  changeAnimation("stand still");
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = false;
	  changeAnimation("stand still");
      event.preventDefault();
      break;
  }
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());

/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime,input) {

  if (!(animation=="stand still" && tookAstep=="yes"))
  animationTimer++;
  if (animationTimer>frameLength)
  {
	  animationCounter++;
	  animationTimer = 0;
  }
  if (animationCounter>numberOfSpirtes){
	  animationCounter = 0;
  }
  
  switch(animation)
  {
	  case "moving up":
	  case "moving down":
	  case "moving left":
	  case "moving right":
	  if (animationTimer == 0)
		  tookAstep = "yes";
	  
	  break;
	  case "stand still":
	  if (animationTimer == 0){
		  numberOfSpirtes = 0;
		    animationTimer = 0;
			animationCounter = 0;
			tookAstep = "yes";
	  }
	  
  }
  
  player.update(elapsedTime);
 
   
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 1024, 786);
 
  
  ctx.drawImage( img,xPlaceInImage+spirteWidth*animationCounter , yPlaceInImage, spirteWidth,spirteHeight, 50, 50, widthInGame,heightInGame);
  ctx.save();
   
  ctx.restore();
 
   
}


function changeAnimation (x)
{
	animation = x;
	if (x == "stand still")
	{
		//if (animationTimer == 0)
		//{
			numberOfSpirtes = 0;
		    animationTimer = 0;
			animationCounter = 0;
			tookAstep = "yes";
		//}
		
		
	}
	else
	{
		numberOfSpirtes = 3;
		//tookAstep = "no";  
		switch(x)
		{
			case "moving up":
			
			yPlaceInImage =spirteHeight*3;
			
			break;
			
			case "moving down":
			yPlaceInImage =spirteHeight*0;
			break;
			
			case "moving left":
			yPlaceInImage =spirteHeight*1;
			break;
			
			case "moving right":
			yPlaceInImage =spirteHeight*2;
			break;
		}
		
	}
	
}
/**
  * @function renderWorld
  * Renders the entities in the game world
  * IN WORLD COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
 

},{"./game":2,"./player":3}],2:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

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

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],3:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
 

/* Constants */
const PLAYER_RUN_VELOCITY = 0.25;
const PLAYER_RUN_SPEED = 5;
const PLAYER_RUN_MAX = 3;
const PLAYER_FALL_VELOCITY = 0.25;
const PLAYER_JUMP_SPEED = 3;

/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function Player( ) {
   
this.animationTimer = 0;
this.animationCounter = 0;
this.frameLength = 9;
//animation dependent
this.numberOfSpirtes = 0; // how man y frames are there in the animation
this.spirteWidth = 50; // width of each frame
this.spirteHeight = 48; // height of each frame
this.widthInGame = 80;   
this.heightInGame = 128;
this. xPlaceInImage = 0; // this should CHANGE for the same animation 
this. yPlaceInImage = 0; // this should NOT change for the same animation

this.animation = "stand still" // this will keep track of the animation
this.tookAstep = "no"
this.img.src = 'assets/death_scythe.png';

this.position = {x: 0 , y:0};

}

/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Player.prototype.update = function(elapsedTime, input) {
// set the velocity
	//this.velocity.x = 0;
	if(input.left) this.velocity.x -= PLAYER_RUN_VELOCITY;
	else if(input.right) this.velocity.x += PLAYER_RUN_VELOCITY;
	else if(this.velocity.x>0) this.velocity.x -=PLAYER_RUN_VELOCITY;
	else if(this.velocity.x<0)this.velocity.x +=PLAYER_RUN_VELOCITY
	//this.velocity.y = 0;
	if(this.velocity.x < -PLAYER_RUN_MAX) this.velocity.x=-PLAYER_RUN_MAX;
	if(this.velocity.x > PLAYER_RUN_MAX) this.velocity.x=PLAYER_RUN_MAX;

	if(input.up && this.jumping==false) {
		this.velocity.y -= PLAYER_JUMP_SPEED;
		this.jumping=true;
	}
	else if(jumping==true) this.velocity.y += PLAYER_FALL_VELOCITY;
	else if(input.down && this.jumping==false) this.crouching == true;//this.velocity.y += PLAYER_RUN_SPEED / 2;



	// move the player
	this.position.x += this.velocity.x;
	this.position.y += this.velocity.y;
	
	
	if (!(this.animation=="stand still" && this.tookAstep=="yes"))
  this.animationTimer++;
  if (this.animationTimer>this.frameLength)
  {
	  this.animationCounter++;
	  this.animationTimer = 0;
  }
  if (this.animationCounter>this.numberOfSpirtes){
	  this.animationCounter = 0;
  }
  
  switch(this.animation)
  {
	  case "moving up":
	  case "moving down":
	  case "moving left":
	  case "moving right":
	  if (this.animationTimer == 0)
		  tookAstep = "yes";
	  
	  break;
	  case "stand still":
	  if (this.animationTimer == 0){
		  this.numberOfSpirtes = 0;
		    this.animationTimer = 0;
			this.animationCounter = 0;
			this.tookAstep = "yes";
	  }
	  
  }
}

/**
 * @function render
 * Renders the player helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Player.prototype.render = function(elapasedTime, ctx) {
   
}
 
 
Player.prototype.changeAnimation = function(x)
{
	this.animation = x;
	if (x == "stand still")
	{
		//if (animationTimer == 0)
		//{
			this.numberOfSpirtes = 0;
		    this.animationTimer = 0;
			this.animationCounter = 0;
			this.tookAstep = "yes";
		//}
		
		
	}
	else
	{
		this.numberOfSpirtes = 3;
		//tookAstep = "no";  
		switch(x)
		{
			case "moving up":
			
			this.yPlaceInImage =spirteHeight*3;
			
			break;
			
			case "moving down":
			this.yPlaceInImage =spirteHeight*0;
			break;
			
			case "moving left":
			this.yPlaceInImage =spirteHeight*1;
			break;
			
			case "moving right":
			this.yPlaceInImage =spirteHeight*2;
			break;
		}
		
	}
	
}
},{}]},{},[1]);
