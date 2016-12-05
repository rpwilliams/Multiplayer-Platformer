(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
  
  
  //enemy controls
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
	  
	  
	  
	  
  }
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
  
  //enemy
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
 

},{"./enemy":2,"./game":3,"./player":4}],2:[function(require,module,exports){

"use strict";

/* Classes and Libraries */
 

/* Constants */
const Enemy_RUN_VELOCITY = 0.25;
const Enemy_RUN_SPEED = 5;
const Enemy_RUN_MAX = 3;
const Enemy_FALL_VELOCITY = 0.25;
const Enemy_JUMP_SPEED = 6;
const Enemy_JUMP_BREAK_VELOCITY= 0.20;

/**
 * @module Enemy
 * A class representing a Enemy's helicopter
 */
module.exports = exports = Enemy;

/**
 * @constructor Enemy
 * Creates a Enemy
 * @param {BulletPool} bullets the bullet pool
 */
function Enemy( ) {
   
this.animationTimer = 0;
this.animationCounter = 0;
this.frameLength = 9;
//animation dependent
this.numberOfSpirtes = 0; // how many frames are there in the animation
this.spirteWidth = 42; // width of each frame
this.spirteHeight = 23; // height of each frame
this.widthInGame = 80;   
this.heightInGame = 68;
this.xPlaceInImage = 0; // this should CHANGE for the same animation 
this.yPlaceInImage = 0; // this should NOT change for the same animation

//specific animation information for this enemy
//while it is still
this.stillHeight = this.spirteHeight;
this.stillWidth = this.spirteWidth;
this.stillWidthInGame = this.widthInGame;   
this.stillHeightInGame = this.heightInGame;
//while it is moving
this.movingHeight = 32;
this.movingWidth = 41;			
this.movingWidthInGame = 80;   
this.movingHeightInGame = 90;
//this is used to make sure both movement feels to be in the same place in the screent 
this.offPostion = 8;


this.animation = "stand still" // this will keep track of the animation
this.tookAstep = "no"
this.img = new Image()
this.img.src = 'assets/Ship - Copy2.png';


this.position = {x: 500, y: 400};
this.velocity = {x: 0, y: 0};
this.jumping = false ;
this.crouching = "no"
this.floorYPostion = 600;
this.moving = false;


this.facing = "left";
this.dashing = false;

}





/**
 * @function update
 * Updates the Enemy based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Enemy.prototype.update = function(elapsedTime, input) {

	
	if(input.left){
				//if (!input.down)
				{
					this.velocity.x -= Enemy_RUN_VELOCITY;
					this.velocity.x -= Enemy_RUN_VELOCITY;
					this.changeAnimation("moving left");
					this.facing = "left";
					
				
				}
					
			}
			else if(input.right){
				this.velocity.x += Enemy_RUN_VELOCITY;
				this.velocity.x += Enemy_RUN_VELOCITY;
				this.changeAnimation("moving right");
				
					
				
				this.facing = "right";
			}

			if(this.velocity.x>0) {
				this.velocity.x -=Enemy_RUN_VELOCITY;
			}
			if(this.velocity.x<0){
				this.velocity.x +=Enemy_RUN_VELOCITY
			}
			
			if(this.velocity.x < -Enemy_RUN_MAX) this.velocity.x=-Enemy_RUN_MAX;
			if(this.velocity.x > Enemy_RUN_MAX) this.velocity.x=Enemy_RUN_MAX;
	
	
		if(input.up)
		{
			
			this.velocity.y-=Enemy_RUN_VELOCITY;
			if(this.velocity.y < -Enemy_RUN_MAX) this.velocity.y=-Enemy_RUN_MAX;
		}
		else if (input.down)
		{
		
			this.velocity.y+=Enemy_RUN_VELOCITY;
			if(this.velocity.y > Enemy_RUN_MAX) this.velocity.y=Enemy_RUN_MAX;		
		}

	// move the Enemy
	this.position.x += this.velocity.x;
	this.position.y += this.velocity.y;
	
	
	//if (!(this.animation=="stand still" && this.tookAstep=="yes"))
  this.animationTimer++;
  if (this.animationTimer>this.frameLength)
  {
	  if(this.animation!="moving up"){
		this.animationCounter++;
		
	  }
	  this.animationTimer = 0;
  }
  if (this.animationCounter>=this.numberOfSpirtes){
		if(this.animation!="stand still"){
			this.animationCounter = 0;
		}
		else{
		this.animationCounter = 0;
		}
  }
  
  
 
  
}

/**
 * @function render
 * Renders the Enemy helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Enemy.prototype.render = function(elapasedTime, ctx) {
   ctx.drawImage( this.img,this.xPlaceInImage+this.spirteWidth*this.animationCounter , 
   this.yPlaceInImage, this.spirteWidth,this.spirteHeight, 
   this.position.x, this.position.y, this.widthInGame,this.heightInGame);
   this.xPlaceInImage=0;
}
 
 
Enemy.prototype.changeAnimation = function(x)
{
	this.animation = x;
	if (this.animation == "stand still")
	{
		//if (animationTimer == 0)
		//{
			this.numberOfSpirtes = 0;
		    this.animationTimer = 0;
			this.animationCounter = 0;
			//this.tookAstep = "yes";
		//}
			this.spirteHeight = this.stillHeight;
			this.spirteWidth = this.stillWidth;
			this.widthInGame = this.stillWidthInGame;   
			this.heightInGame = this.stillHeightInGame;
			
			this.moving = false;
			this.position.y+=this.offPostion;
			
			if (this.facing=="right")
				this.yPlaceInImage = this.spirteHeight*0;
			else
				this.yPlaceInImage = this.spirteHeight*1;
			this.xPlaceInImage = this.spirteWidth*0;
		
		
	}
	else
	{
		this.numberOfSpirtes = 3;
		this.heightInGame = 68;
		//tookAstep = "no";  
		switch(this.animation)
		{
			case "moving up unused":
			
				//this.xPlaceInImage =this.spirteWidth*7;
			this.numberOfSpirtes = 0;
			this.animationTimer = 0;
			this.animationCounter = 0;
			
			break;
			
			case "moving down unused":
			//this.yPlaceInImage =this.spirteHeight*0;
			//this.numberOfSpirtes = 0;
			
			this.numberOfSpirtes = 0;
		    this.animationTimer = 0;
			this.animationCounter = 0;
			//this.tookAstep = "yes";
			
			break;
			
			case "moving left":
			
			this.yPlaceInImage = 84; 
			this.spirteHeight = this.movingHeight;
			this.spirteWidth = this.movingWidth;
			
			this.widthInGame = this.movingWidthInGame;   
			this.heightInGame = this.movingHeightInGame;
			
			if (!this.moving)
				{
					this.moving = true;
					this.position.y-=this.offPostion;
				}

			break;
			
			case "moving right":
			
			this.yPlaceInImage = 48; 
			this.spirteHeight = this.movingHeight;
			this.spirteWidth = this.movingWidth;
			
			this.widthInGame = this.movingWidthInGame;   
			this.heightInGame = this.movingHeightInGame;
			if (!this.moving)
				{
					this.moving = true;
					this.position.y-=this.offPostion;
				}
			
			break;
			
			case "standing":
			
			break;
			
			case "dashing":
			
			break;
			
			
		}
		
	}
	
}
},{}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){

"use strict";

/* Classes and Libraries */
 

/* Constants */
const PLAYER_RUN_VELOCITY = 0.25;
const PLAYER_RUN_SPEED = 5;
const PLAYER_RUN_MAX = 3;
const PLAYER_FALL_VELOCITY = 0.25;
const PLAYER_JUMP_SPEED = 6;
const PLAYER_JUMP_BREAK_VELOCITY= 0.20;

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
this.spirteWidth = 23; // width of each frame
this.spirteHeight = 34; // height of each frame
this.widthInGame = 46;   
this.heightInGame = 68;
this.xPlaceInImage = 0; // this should CHANGE for the same animation 
this.yPlaceInImage = 0; // this should NOT change for the same animation

this.animation = "stand still" // this will keep track of the animation
this.tookAstep = "no"
this.img = new Image()
this.img.src = 'assets/fumiko2.png';


this.position = {x: 50, y: 600};
this.velocity = {x: 0, y: 0};
this.jumping = false ;
this.crouching = "no"
this.floorYPostion = 600;

this.facing = "left";
this.dashing = false;

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
	
	//track movment than change velocity and animation 
	if (this.jumping==false&&this.dashing==false)//(input.up==false)
	{
			//crouch when down is held
		if (input.down == true)
		{
			if (this.crouching=="no")
			{
				this.changeAnimation("moving down");
				this.crouching = "yes";
				this.heightInGame = 34;
				this.position.y+=34;
				input.left = false;
				input.right = false;
			}
			
		}
		else 
		{
		
		if(input.left){
				//if (!input.down)
				{
					this.velocity.x -= PLAYER_RUN_VELOCITY;
					this.velocity.x -= PLAYER_RUN_VELOCITY;
					this.changeAnimation("moving left");
					this.facing = "left";
				}
					
			}
			else if(input.right){
				this.velocity.x += PLAYER_RUN_VELOCITY;
				this.velocity.x += PLAYER_RUN_VELOCITY;
				this.changeAnimation("moving right");
				this.facing = "right";
			} 
			
		
		}
		
		if(this.velocity.x>0) {
				this.velocity.x -=PLAYER_RUN_VELOCITY;
			}
			if(this.velocity.x<0){
				this.velocity.x +=PLAYER_RUN_VELOCITY
			}
			
	}
	else{
		this.changeAnimation("moving up");
	}
	
	// set a maximum run speed
	if(this.velocity.x < -PLAYER_RUN_MAX) this.velocity.x=-PLAYER_RUN_MAX;
	if(this.velocity.x > PLAYER_RUN_MAX) this.velocity.x=PLAYER_RUN_MAX;
	
	
	//jumping functionality
	if(input.up && this.jumping==false) {
		this.velocity.y -= PLAYER_JUMP_SPEED;
		this.jumping=true;
	}
	
	else if(this.jumping==true) {
		this.velocity.y += PLAYER_FALL_VELOCITY;
		
		if (this.facing=="left")
		{
			if(input.right){
				this.velocity.x += PLAYER_JUMP_BREAK_VELOCITY;
			}
			
		}
		
		if (this.facing=="right")
		{
			
			
			if(input.left){
			this.velocity.x -= PLAYER_JUMP_BREAK_VELOCITY;
			 
			}
		}
		
		//when you hit a floor from a jump you stop
		if (this.position.y > this.floorYPostion - 4)
		{
			this.position.y = this.floorYPostion;
			this.velocity.y = 0;
			this.jumping = false;
		}
		
	}
	
	//dashing functionality
	if (input.dash)
	{
		
	}
	
	
	/*
	else if(input.down && this.jumping==false) this.crouching == true;//this.velocity.y += PLAYER_RUN_SPEED / 2;
	*/


	// move the player
	this.position.x += this.velocity.x;
	this.position.y += this.velocity.y;
	
	
	//if (!(this.animation=="stand still" && this.tookAstep=="yes"))
  this.animationTimer++;
  if (this.animationTimer>this.frameLength)
  {
	  if(this.animation!="moving up"){
		this.animationCounter++;
		
	  }
	  this.animationTimer = 0;
  }
  if (this.animationCounter>=this.numberOfSpirtes){
		if(this.animation!="stand still"){
			this.animationCounter = 3;
		}
		else{
		this.animationCounter = 0;
		}
  }
  
  /*
  switch(this.animation)
  {
	  case "moving up":
	  case "moving down":
	  case "moving left":
	  case "moving right":
	  if (this.animationTimer == 0)
		  this.tookAstep = "yes";
	  
	  break;
	  case "stand still":
	  if (this.animationTimer == 0){
		  this.numberOfSpirtes = 0;
		    this.animationTimer = 0;
			this.animationCounter = 0;
			this.tookAstep = "yes";
	  }
	  
  }
  */
  
  //standing up 
  if (!input.down&&this.crouching=="yes")//&&this.crouching==true)
  {
	  
	  this.crouching = "no";
	  this.position.y-=34;
	  this.heightInGame = 68;
  }
  
  //console.log(this.animationCounter);
}

/**
 * @function render
 * Renders the player helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Player.prototype.render = function(elapasedTime, ctx) {
   ctx.drawImage( this.img,this.xPlaceInImage+this.spirteWidth*this.animationCounter , 
   this.yPlaceInImage, this.spirteWidth,this.spirteHeight, 
   this.position.x, this.position.y, this.widthInGame,this.heightInGame);
   this.xPlaceInImage=0;
}
 
 
Player.prototype.changeAnimation = function(x)
{
	this.animation = x;
	if (this.animation == "stand still")
	{
		//if (animationTimer == 0)
		//{
			this.numberOfSpirtes = 0;
		    this.animationTimer = 0;
			this.animationCounter = 0;
			//this.tookAstep = "yes";
		//}
		
		
	}
	else
	{
		this.numberOfSpirtes = 7;
		this.heightInGame = 68;
		//tookAstep = "no";  
		switch(this.animation)
		{
			case "moving up":
			
				this.xPlaceInImage =this.spirteWidth*7;
			
			break;
			
			case "moving down":
			//this.yPlaceInImage =this.spirteHeight*0;
			//this.numberOfSpirtes = 0;
			
			this.numberOfSpirtes = 0;
		    this.animationTimer = 0;
			this.animationCounter = 0;
			//this.tookAstep = "yes";
			
			break;
			
			case "moving left":
			this.yPlaceInImage =this.spirteHeight*1;
			break;
			
			case "moving right":
			this.yPlaceInImage =this.spirteHeight*0;
			break;
			
			case "standing":
			
			break;
			
			case "dashing":
			
			break;
			
			
		}
		
	}
	
}
},{}]},{},[1]);
