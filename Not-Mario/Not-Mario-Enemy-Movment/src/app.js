"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Player = require('./player');
const Enemy = require('./enemy');


/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var input = {
  up: false,
  down: false,
  left: false,
  right: false,
  attack: false,
  hide: false,
  crouch: false,
  dash: false
}
var player = new Player();
//var img = new Image();
//img.src = 'assets/death_scythe.png';

var enemyInput = {
  up: false,
  down: false,
  left: false,
  right: false,
  attack: false,
  hide: false,
  crouch: false,
  dash: false
}
var enemy = new Enemy();



 
/**
 * @function onkeydown
 * Handles keydown events
 */
window.onkeydown = function(event) {
	
	//player controls
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = true;
	  
	   
	  //player.changeAnimation("moving up");
	   
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = true;
	   
	  //player.changeAnimation("moving down");
	   
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
	//if (!input.down) // stop player from moving while crouching
      input.left = true;
	   
	  //player.changeAnimation("moving left");
	   
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
	//if (!input.down) // stop player from moving while crouching
      input.right = true;
	   
	  //player.changeAnimation("moving right");
	  
      event.preventDefault();
      break;
  }
  
   switch(event.key) {
	  
	  case "f":
	  input.dash = true;
	  break;
	  
	  case "g":
	  
	  break;
	  
	  
	  
	  
  }
  
  
  //enemy controls added these controls for the enemy********************************
  switch(event.key) {
    case "i":
    case "i":
      enemyInput.up = true;
	  
	   
	  //player.changeAnimation("moving up");
	   
      event.preventDefault();
      break;
    case "k":
    case "k":
      enemyInput.down = true;
	   
	  //player.changeAnimation("moving down");
	   
      event.preventDefault();
      break;
    case "j":
    case "j":
	//if (!input.down) // stop player from moving while crouching
      enemyInput.left = true;
	   
	  //player.changeAnimation("moving left");
	   
      event.preventDefault();
      break;
    case "l":
    case "l":
	//if (!input.down) // stop player from moving while crouching
      enemyInput.right = true;
	   
	  //player.changeAnimation("moving right");
	  
      event.preventDefault();
      break;
  }
  
   switch(event.key) {
	  
	  case "p":
	  enemyInput.dash = true;
	  break;
	  
	  case "h":
	  
	  break;
	  
	  
	  
	  
  }//***********************************************8
}

/**
 * @function onkeyup
 * Handles keydown events
 */
window.onkeyup = function(event) {
	
	//player
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = false;
	 
	  player.changeAnimation("stand still");

      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = false;
	  player.changeAnimation("stand still");
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
      input.left = false;
	  player.changeAnimation("stand still");
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = false;
	  player.changeAnimation("stand still");
      event.preventDefault();
      break;
	  
	case "f":
	  input.dash=false;
	  player.changeAnimation("stand still");
      event.preventDefault();
      break;
	
  }
  
  //enemy  added controls for the enemy**************************8
   switch(event.key) {
    case "i":
    case "i":
      enemyInput.up = false;
	 
	  //enemy.changeAnimation("stand still");

      event.preventDefault();
      break;
    case "k":
    case "k":
      enemyInput.down = false;
	  //enemy.changeAnimation("stand still");
      event.preventDefault();
      break;
    case "j":
    case "j":
      enemyInput.left = false;
	  enemy.changeAnimation("stand still");
      event.preventDefault();
      break;
    case "l":
    case "l":
      enemyInput.right = false;
	  enemy.changeAnimation("stand still");
      event.preventDefault();
      break;
	  
	case "p":
	  enemyInput.dash=false;
	  enemy.changeAnimation("stand still");
      event.preventDefault();
      break;
	
  } //****************************************************
  
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
function update(elapsedTime) {

   
  
  player.update(elapsedTime,input);
  enemy.update(elapsedTime,enemyInput);
 
   
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
 
  player.render(elapsedTime, ctx);
  enemy.render(elapsedTime, ctx);
  //ctx.drawImage( img,xPlaceInImage+spirteWidth*animationCounter , yPlaceInImage, spirteWidth,spirteHeight, 50, 50, widthInGame,heightInGame);
  ctx.save();
   
  ctx.restore();
 
   
}


/**
  * @function renderWorld
  * Renders the entities in the game world
  * IN WORLD COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
 
