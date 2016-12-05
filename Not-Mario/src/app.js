"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Player = require('./player');
var tilemap = require('./tilemap');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);

var tilemapData = require('../assets/tilemap.json');
var input = {
  up: false,
  down: false,
  left: false,
  right: false
}
var player = new Player();

 tilemap.load(tilemapData, {
    onload: function() {
      tilemap.render(canvas.getContext('2d'));
      //renderPlayer();
    }
  });



 
/**
 * @function onkeydown
 * Handles keydown events
 */
window.onkeydown = function(event) {
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
      input.left = true;
	   
	  //player.changeAnimation("moving left");
	   
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = true;
	   
	  //player.changeAnimation("moving right");
	  
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


function isPassible(x, y) {
    var data = tilemap.tileAt(x, y, 0);
    // if the tile is out-of-bounds for the tilemap, then
    // data will be undefined, a "falsy" value, and the
    // && operator will shortcut to false.
    // Otherwise, it is truthy, so the solid property
    // of the tile will determine the result
    return data && !data.solid
}


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
//console.log(tilemap.tileAt(.position.x, player.position.y, 0));
//console.log(tilemap.tileAt(0, 0, 0));
//console.log(player.position.x, player.position.y, 0);
console.log(tilemap.tileAt(300,300,0));
if(player.falling==true){
	if(isPassible(player.position.x,player.position.y)){
		player.velocity.y=0;
		player.falling=false;
	}
}
   
  
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
  tilemap.render(ctx);
  player.render(elapsedTime, ctx);
  //ctx.drawImage( img,xPlaceInImage+spirteWidth*animationCounter , yPlaceInImage, spirteWidth,spirteHeight, 50, 50, widthInGame,heightInGame);
  ctx.save();
   
  ctx.restore();
 
   
}
