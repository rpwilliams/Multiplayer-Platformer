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
  right: false,
  attack: false,
  hide: false,
  crouch: false,
  dash: false 
}
var player = new Player();





 
/**
 * @function onkeydown
 * Handles keydown events
 */
window.onkeydown = function(event) {
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = true;
	   
	  input.down = false;
	  //input.left = false;
	  //input.right = false;
	 
	
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = true;
	  
	  input.up = false;
	  
	  input.left = false;
	  input.right = false;
	   
	  
	   
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
      input.left = true;
	  
	  input.up = false;
	  input.down = false;
	   
	  input.right = false;
	  
	   
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = true;
	  
	  input.up = false;
	  input.down = false;
	  input.left = false;
	   
	  
	  
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
function update(elapsedTime) {

   
  
  player.update(elapsedTime,input);
 
   
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
 
