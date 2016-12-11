(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Player = require('./player');
const Enemy = require('./enemy');
const Vector = require('./vector');
const Camera = require('./camera');

/* Global variables */
var canvas = document.getElementById('screen');

var camera = new Camera(canvas);
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
  dash: false,
  lazer: false,
  bomb: false
}
var enemy = new Enemy();
var enemyFire = [];
var enemyBombs = [];

var reticule = {
  x: 0,
  y: 0
}


/**
 * @function onmousemove
 * Handles mouse move events
 */
window.onmousemove = function(event) {
  event.preventDefault();
  reticule.x = event.offsetX;
  reticule.y = event.offsetY;
}

/**
 * @function onmousedown
 * Handles mouse left-click events
 */
window.onmousedown = function(event) {
  event.preventDefault();
    if(event.button == 0) {
    reticule.x = event.offsetX;
    reticule.y = event.offsetY;
    var direction = Vector.subtract(
      reticule,
      camera.toScreenCoordinates(enemy.position)
    );
    enemy.fire(direction,enemyFire);
  }
}

/**
 * @function oncontextmenu
 * Handles mouse right-click events
 */
canvas.oncontextmenu = function(event) {
  event.preventDefault();
  reticule.x = event.offsetX;
  reticule.y = event.offsetY;
  
   var direction = Vector.subtract(
      reticule,
      camera.toScreenCoordinates(enemy.position)
    );
  enemy.bomb(direction,enemyBombs);
}

 
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
	  enemyInput.lazer = true;
	  break;
	  
	  case "o":
	  enemyInput.bomb = true;
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
	  enemyInput.lazer=false;
	   
      event.preventDefault();
      break;
	  
	case "o":
	  enemyInput.bomb=false;
	   
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
  enemy.update(elapsedTime,enemyInput,enemyFire,enemyBombs);
  
  //update fire 
  for (var i = 0 ; i < enemyFire.length ; i++)
  {
	  
	  enemyFire[i].update(elapsedTime);
	  
	  //remove the shot at this condtion, it could be hitting an opject or going out of the screen
	  if (enemyFire[i].timer>40)
	  {
		  
		  enemyFire.splice(i,1);
		  i--;
	  }
  }
  
  //update bomb 
  for (var i = 0 ; i < enemyBombs.length ; i++)
  {
	  
	  enemyBombs[i].update(elapsedTime);
	  
	  //explode at this condtion, it could be hitting an opject or going out of the screen
	  if (enemyBombs[i].timer>40 && enemyBombs[i].state=="falling")
	  {
		  
			  enemyBombs[i].explode();
	  }
	  
	  if (enemyBombs[i].state=="finished")
	   {
		enemyBombs.splice(i,1);
		i--; 
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
 
  player.render(elapsedTime, ctx);
  enemy.render(elapsedTime, ctx);
  //ctx.drawImage( img,xPlaceInImage+spriteWidth*animationCounter , yPlaceInImage, spriteWidth,spriteHeight, 50, 50, widthInGame,heightInGame);
  ctx.save();
   
  ctx.restore();
  
  //draw fire
  for (var i = 0 ; i < enemyFire.length ; i++)
  {
	  
	  enemyFire[i].render(elapsedTime, ctx);
  }
  
  //draw bomb
  for (var i = 0 ; i < enemyBombs.length ; i++)
  {
	  
	  enemyBombs[i].render(elapsedTime, ctx);
  }
   
   // Render the reticule
  ctx.save();
  ctx.translate(reticule.x, reticule.y);
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, 2*Math.PI);
  ctx.moveTo(0, 15);
  ctx.lineTo(0, -15);
  ctx.moveTo(15, 0);
  ctx.lineTo(-15, 0);
  ctx.strokeStyle = '#00ff00';
  ctx.stroke();
  ctx.restore();
}


/**
  * @function renderWorld
  * Renders the entities in the game world
  * IN WORLD COORDINATES
  * @param {DOMHighResTimeStamp} elapsedTime
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
 

},{"./camera":2,"./enemy":3,"./game":6,"./player":7,"./vector":8}],2:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Vector = require('./vector');

/**
 * @module Camera
 * A class representing a simple camera
 */
module.exports = exports = Camera;

/**
 * @constructor Camera
 * Creates a camera
 * @param {Rect} screen the bounds of the screen
 */
function Camera(screen) {
  this.x = 0;
  this.y = 0;
  this.width = screen.width;
  this.height = screen.height;
}

/**
 * @function update
 * Updates the camera based on the supplied target
 * @param {Vector} target what the camera is looking at
 */
Camera.prototype.update = function(target) {
  this.x = target.x - 200;
}

/**
 * @function onscreen
 * Determines if an object is within the camera's gaze
 * @param {Vector} target a point in the world
 * @return true if target is on-screen, false if not
 */
Camera.prototype.onScreen = function(target) {
  return (
     target.x > this.x &&
     target.x < this.x + this.width &&
     target.y > this.y &&
     target.y < this.y + this.height
   );
}

/**
 * @function toScreenCoordinates
 * Translates world coordinates into screen coordinates
 * @param {Vector} worldCoordinates
 * @return the tranformed coordinates
 */
Camera.prototype.toScreenCoordinates = function(worldCoordinates) {
  return Vector.subtract(worldCoordinates, this);
}

/**
 * @function toWorldCoordinates
 * Translates screen coordinates into world coordinates
 * @param {Vector} screenCoordinates
 * @return the tranformed coordinates
 */
Camera.prototype.toWorldCoordinates = function(screenCoordinates) {
  return Vector.add(screenCoordinates, this);
}

},{"./vector":8}],3:[function(require,module,exports){

"use strict";

/* Classes and Libraries */
 

/* Constants */
const Enemy_RUN_VELOCITY = 0.25;
const Enemy_RUN_SPEED = 5;
const Enemy_RUN_MAX = 3;
const Enemy_FALL_VELOCITY = 0.25;
const Enemy_JUMP_SPEED = 6;
const Enemy_JUMP_BREAK_VELOCITY= 0.20;

const EnemyFire = require('./enemyFire');
const EnemyBomb = require('./enemyBomb');
const Vector = require('./vector');

const FIRE_SPEED = 7;

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
this.numberOfsprites = 0; // how many frames are there in the animation
this.spriteWidth = 42; // width of each frame
this.spriteHeight = 23; // height of each frame
this.widthInGame = 80;   
this.heightInGame = 68;
this.xPlaceInImage = 0; // this should CHANGE for the same animation 
this.yPlaceInImage = 0; // this should NOT change for the same animation

//specific animation information for this enemy
//while it is still
this.stillHeight = this.spriteHeight;
this.stillWidth = this.spriteWidth;
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


this.facing = "right";
this.dashing = false;

this.lazerCooldown = 0;
this.bombCooldown = 0;
//this.lazers = this.lazer(1);

}





/**
 * @function update
 * Updates the Enemy based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Enemy.prototype.update = function(elapsedTime, input,enemyFire,enemyBombs) {

	
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
  if (this.animationCounter>=this.numberOfsprites){
		if(this.animation!="stand still"){
			this.animationCounter = 0;
		}
		else{
		this.animationCounter = 0;
		}
  }
  
   
   
  
 this.lazerCooldown--;
 
 this.bombCooldown--;
  
}

/**
 * @function render
 * Renders the Enemy helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Enemy.prototype.render = function(elapasedTime, ctx) {
   ctx.drawImage( this.img,this.xPlaceInImage+this.spriteWidth*this.animationCounter , 
   this.yPlaceInImage, this.spriteWidth,this.spriteHeight, 
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
			this.numberOfsprites = 0;
		    this.animationTimer = 0;
			this.animationCounter = 0;
			//this.tookAstep = "yes";
		//}
			this.spriteHeight = this.stillHeight;
			this.spriteWidth = this.stillWidth;
			this.widthInGame = this.stillWidthInGame;   
			this.heightInGame = this.stillHeightInGame;
			
			this.moving = false;
			this.position.y+=this.offPostion;
			
			if (this.facing=="right")
				this.yPlaceInImage = this.spriteHeight*0;
			else
				this.yPlaceInImage = this.spriteHeight*1;
			this.xPlaceInImage = this.spriteWidth*0;
		
		
	}
	else
	{
		this.numberOfsprites = 3;
		this.heightInGame = 68;
		//tookAstep = "no";  
		switch(this.animation)
		{
			case "moving up unused":
			
				//this.xPlaceInImage =this.spriteWidth*7;
			this.numberOfsprites = 0;
			this.animationTimer = 0;
			this.animationCounter = 0;
			
			break;
			
			case "moving down unused":
			//this.yPlaceInImage =this.spriteHeight*0;
			//this.numberOfsprites = 0;
			
			this.numberOfsprites = 0;
		    this.animationTimer = 0;
			this.animationCounter = 0;
			//this.tookAstep = "yes";
			
			break;
			
			case "moving left":
			
			this.yPlaceInImage = 84; 
			this.spriteHeight = this.movingHeight;
			this.spriteWidth = this.movingWidth;
			
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
			this.spriteHeight = this.movingHeight;
			this.spriteWidth = this.movingWidth;
			
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

Enemy.prototype.fire = function(direction,enemyFire)
{
	
	 var velocity = Vector.scale(Vector.normalize(direction), FIRE_SPEED);
	 
	 if ( this.lazerCooldown<1)
  {
	  
	  var p = Vector.add(this.position, {x:0, y:0});
	  var laz = new EnemyFire(p,"left","lazer");
	 // if (this.facing == "right")
	  {
		   //p.x += this.widthInGame;
		   laz =  new EnemyFire(p,velocity);
	  }
		 
	 
	  
	  enemyFire.push(laz);
	  
	  this.lazerCooldown = 15;
	  
  }
}


Enemy.prototype.bomb = function(direction,enemyBombs)
{
	var velocity = Vector.scale(Vector.normalize(direction), FIRE_SPEED);
	if ( this.bombCooldown<1)
  {
	  
	  //var p = {x : this.position.x+this.widthInGame/2, y: this.position.y+this.heightInGame - this.heightInGame/3}
	  var p =  Vector.add(this.position, {x:15, y:15});
	  //var position = Vector.add(this.position, {x:30, y:30});
	  var bomb = new EnemyBomb(p,velocity);
	  /*
	  if (this.facing == "right")
	  {
		   //p.x += this.widthInGame;
		   bomb =  new EnemyBomb(p,velocity);
	  }
		*/ 
	 
	  
	  enemyBombs.push(bomb);
	  
	  this.bombCooldown = 30;
	  
  }
	
}




},{"./enemyBomb":4,"./enemyFire":5,"./vector":8}],4:[function(require,module,exports){
"use strict";
 
/* Constants */
const FIRE_SPEED = 7;

/**
 *  
 */
module.exports = exports = EnemyBomb;

function EnemyBomb(position,velocity) {
  this.position = {x: position.x, y:position.y}
  
   //this.direction = direction;
   //this.kind = kind;
   this.width = 14*2;
   this.height = 32*2;
   
   this.inGameExplosionWidth = 96*1.5;
   this.inGameExplosionHeight = 96*1.5;
   
   this.explosionImageWidth = 96
   this.explosionImageHeight = 96;
   
   this.animationTimer = 0;
   this.explosionAnimation = 0;
   
   
   this.timer = 0;
  //this.angle = 180;
  this.img = new Image()
  this.img.src = 'assets/enemyBomb.png';
  
  this.img2 = new Image()
  this.img2.src = 'assets/Explosion.png';
  
  this.state = "falling";
  
  //this.angle = angle;
  
  this.velocity = velocity;
  this.angle = Math.atan2(velocity.x, velocity.y);
   
}

EnemyBomb.prototype.update = function(elapsedTime)
{
	
	switch(this.state)
	{
		case "falling":
		this.position.x+=this.velocity.x;
		this.position.y+=this.velocity.y;
		break;
		
		case "exploding":
		this.animationTimer++;
		
		if (this.animationTimer>5)
		{
			this.animationTimer = 0;
			this.explosionAnimation++;
		}
		
		if (this.timer>60 )
			this.state = "finished"
		break;
		
	}
	
	
	 

	this.timer++;
}

EnemyBomb.prototype.render = function(elapasedTime, ctx) {
    ctx.save();
	ctx.translate(this.position.x,this.position.y);
	//ctx.rotate(this.angle);// should be just for the bobmb stage
	switch(this.state)
	{
		
		case "falling":
		 ctx.rotate(-this.angle);//console.log(this.angle);
		 ctx.drawImage( this.img,0,0 , 14,32 ,0,0,this.width ,this.height );
		break;
		
		case "exploding":
		 ctx.drawImage( this.img2,this.explosionAnimation*this.explosionImageWidth,0 , this.explosionImageWidth,this.explosionImageHeight ,0,0,this.width ,this.height );
		break;
		
	}
	ctx.restore();
	
  
}

EnemyBomb.prototype.explode = function() 
{
	this.state = "exploding"
	this.timer = 0;
	
	this.width =  this.inGameExplosionWidth;
    this.height = this.inGameExplosionHeight;
	
	this.position.y-=this.height/4;
	this.position.x -=this.width/3;
   
}
},{}],5:[function(require,module,exports){
"use strict";
 
/* Constants */
const FIRE_SPEED = 7;

/**
 *  
 */
module.exports = exports = EnemyFire;

function EnemyFire(position,velocity) {
   this.position = {x: position.x, y:position.y}
   //this.velocity = {x: velocity.x, y:velocity.y}
   //this.direction = direction;
   //this.kind = kind;
   this.width = 10;
   this.height = 10;
   this.lazerSize = 3;
   this.widthOverlap = this.width*0.30;
   this.heightOverlap = this.height*0.60;
   
   this.timer = 0;
  //this.angle = 180;
  //this.img = new Image()
  //this.img.src = 'assets/helicopter.png';
  
  this.velocity = velocity;//console.log(this.velocity);
  this.angle = Math.atan2(velocity.x, velocity.y);
   
}

EnemyFire.prototype.update = function(elapsedTime)
{
	/*
	this.position.y+=FIRE_SPEED;
	
	if (this.direction == "right")
	this.position.x+=FIRE_SPEED;
	
	if (this.direction == "left")
	this.position.x-=FIRE_SPEED;
	*/

	this.position.x+=this.velocity.x;
	this.position.y+=this.velocity.y;
	
	this.timer++;
}

EnemyFire.prototype.render = function(elapasedTime, ctx) {
    
  ctx.save();
  ctx.translate(this.position.x, this.position.y);
	
  ctx.fillStyle = "violet";
  /*
  for (var i = 0 ; i < this.lazerSize; i++)
  {
	  //ctx.rotate(2);
	  ctx.rotate(this.angle);
	  //if (this.direction == "right")
		ctx.fillRect(i*this.widthOverlap, i*this.heightOverlap, this.width, this.height);
	
	//if (this.direction == "left")
		//ctx.fillRect(i*(-this.widthOverlap), i*this.heightOverlap, this.width, this.height);
  }
  */
  ctx.rotate(-this.angle);
  ctx.fillRect(0,0, this.width, this.height*3);
  
  
  ctx.restore();
}
},{}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){

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
this.numberOfsprites = 0; // how man y frames are there in the animation
this.spriteWidth = 23; // width of each frame
this.spriteHeight = 34; // height of each frame
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
  if (this.animationCounter>=this.numberOfsprites){
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
		  this.numberOfsprites = 0;
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
   ctx.drawImage( this.img,this.xPlaceInImage+this.spriteWidth*this.animationCounter , 
   this.yPlaceInImage, this.spriteWidth,this.spriteHeight, 
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
			this.numberOfsprites = 0;
		    this.animationTimer = 0;
			this.animationCounter = 0;
			//this.tookAstep = "yes";
		//}
		
		
	}
	else
	{
		this.numberOfsprites = 7;
		this.heightInGame = 68;
		//tookAstep = "no";  
		switch(this.animation)
		{
			case "moving up":
			
				this.xPlaceInImage =this.spriteWidth*7;
			
			break;
			
			case "moving down":
			//this.yPlaceInImage =this.spriteHeight*0;
			//this.numberOfsprites = 0;
			
			this.numberOfsprites = 0;
		    this.animationTimer = 0;
			this.animationCounter = 0;
			//this.tookAstep = "yes";
			
			break;
			
			case "moving left":
			this.yPlaceInImage =this.spriteHeight*1;
			break;
			
			case "moving right":
			this.yPlaceInImage =this.spriteHeight*0;
			break;
			
			case "standing":
			
			break;
			
			case "dashing":
			
			break;
			
			
		}
		
	}
	
}
},{}],8:[function(require,module,exports){
"use strict";

/**
 * @module Vector
 * A library of vector functions.
 */
module.exports = exports = {
  add: add,
  subtract: subtract,
  scale: scale,
  rotate: rotate,
  dotProduct: dotProduct,
  magnitude: magnitude,
  normalize: normalize
}


/**
 * @function rotate
 * Scales a vector
 * @param {Vector} a - the vector to scale
 * @param {float} scale - the scalar to multiply the vector by
 * @returns a new vector representing the scaled original
 */
function scale(a, scale) {
 return {x: a.x * scale, y: a.y * scale};
}

/**
 * @function add
 * Computes the sum of two vectors
 * @param {Vector} a the first vector
 * @param {Vector} b the second vector
 * @return the computed sum
*/
function add(a, b) {
 return {x: a.x + b.x, y: a.y + b.y};
}

/**
 * @function subtract
 * Computes the difference of two vectors
 * @param {Vector} a the first vector
 * @param {Vector} b the second vector
 * @return the computed difference
 */
function subtract(a, b) {
  return {x: a.x - b.x, y: a.y - b.y};
}

/**
 * @function rotate
 * Rotates a vector about the Z-axis
 * @param {Vector} a - the vector to rotate
 * @param {float} angle - the angle to roatate by (in radians)
 * @returns a new vector representing the rotated original
 */
function rotate(a, angle) {
  return {
    x: a.x * Math.cos(angle) - a.y * Math.sin(angle),
    y: a.x * Math.sin(angle) + a.y * Math.cos(angle)
  }
}

/**
 * @function dotProduct
 * Computes the dot product of two vectors
 * @param {Vector} a the first vector
 * @param {Vector} b the second vector
 * @return the computed dot product
 */
function dotProduct(a, b) {
  return a.x * b.x + a.y * b.y
}

/**
 * @function magnitude
 * Computes the magnitude of a vector
 * @param {Vector} a the vector
 * @returns the calculated magnitude
 */
function magnitude(a) {
  return Math.sqrt(a.x * a.x + a.y * a.y);
}

/**
 * @function normalize
 * Normalizes the vector
 * @param {Vector} a the vector to normalize
 * @returns a new vector that is the normalized original
 */
function normalize(a) {
  var mag = magnitude(a);
  return {x: a.x / mag, y: a.y / mag};
}

},{}]},{},[1]);
