"use strict";

/* Classes and Libraries */
const Game = require('./game');
 


/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);
var input = {
  up: false,
  down: false,
  left: false,
  right: false
}
 
var img = new Image()
img.src = 'assets/baldricfrontwalksheet copy.png';
//independent of the animation
var animationTimer = 0;
var animationCounter = 0;
var frameLength = 9;
//animation dependent
var numberOfSpirtes = 0; // how man y frames are there in the animation
var spirteWidth = 64.33333333333333; // width of each frame
var spirteHeight = 64; // height of each frame
var widthInGame = 128;   
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
function update(elapsedTime) {

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
			xPlaceInImage = 0;
		//}
		
		
	}
	else
	{
		numberOfSpirtes = 8;
		//tookAstep = "no";
		xPlaceInImage = 0;
		switch(x)
		{
			case "moving up":
			
			yPlaceInImage =spirteHeight*0;
			
			break;
			
			case "moving down":
			yPlaceInImage =spirteHeight*2;
			xPlaceInImage = spirteWidth;
			numberOfSpirtes = 7;
			break;
			
			case "moving left":
			yPlaceInImage =spirteHeight*1;
			break;
			
			case "moving right":
			yPlaceInImage =spirteHeight*3;
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
 
