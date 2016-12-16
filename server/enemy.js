"use strict";

/* Constants */
var Enemy_RUN_VELOCITY = 0.25;
var Enemy_RUN_SPEED = 5;
var Enemy_RUN_MAX = 10;
var Enemy_FALL_VELOCITY = 0.25;
var Enemy_JUMP_SPEED = 6;
var Enemy_JUMP_BREAK_VELOCITY= 0.20;
var LEVEL_LENGTH = 11229;

var FIRE_SPEED = 15;

var EnemyFire = require('./enemyFire');
var EnemyBomb = require('./enemyBomb');
var Vector = require('./vector');
var Camera = require('./camera');
/**
 * @module exports the Enemy class
 */
module.exports = exports = Enemy;

/**
 * @constructor Player
 * Creates a player
 */
function Enemy(position,socket ) {
	this.animationTimer = 0;
	this.animationCounter = 0; // what frame in the animation is the enemy on
	this.frameLength = 8; // number of frames in animation
	this.numberOfSprites = 0; // how man y frames are there in the animation
	this.spriteWidth = 42; // width of each frame
	this.spriteHeight = 23; // height of each frame
	this.widthInGame = 80;  //width of enemy in game
	this.heightInGame = 68; //height of enemy in game
	this.xPlaceInImage = 0; // this should CHANGE for the same animation
	this.yPlaceInImage = 0; // this should NOT change for the same animation
	this.animation = "stand still"; // this will keep track of the animation
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
	this.velocity = {x: 0, y: 0}; 
	this.screenPos= {x: 512, y: position.y}; // position the enemy is relative to his screen
	this.levelPos= {x: position.x, y: position.y}; // position the enemy is relative to the world
	this.direction = {left:false, down:false, right:false, up:false}; // what direction is the enemy looking
	this.noDir = {left:false, down:false, right:false, up:false};	
	this.enemyFire = []; // Array of enemy bullets
	this.enemyBombs = []; // Array of enemy bombs
	this.sound = null;
	
	//hintbox properties
	this.hintboxAlpha = 0.1;
    this.increaseAlpha = true;	
	this.hintboxCooldown = 600;
	this.hintboxIteration = 0;
	this.leftOfPlayer = false;
	
	this.send = {levelPos:this.levelPos, screenPos:this.screenPos, direction: this.noDir,
	sx:this.xPlaceInImage+this.spriteWidth*this.animationCounter, sy:this.yPlaceInImage,
	swidth:this.spriteWidth, sheight:this.spriteHeight, width:this.widthInGame,
	height:this.heightInGame, animation:this.animationCounter,
	velocity:this.velocity,enemyFire:this.enemyFire, sound:this.sound, hintboxAlpha:this.hintboxAlpha,
	leftOfPlayer:this.leftOfPlayer};

	this.socket = socket;

	this.reticulePosition = {x:0,y:0,fire:false}; // reticule information
	this.floorYPostion = 610;
	this.facing = "left";
	this.lazerCooldown=0;
	this.bombCooldown=0;
	this.numBombs = 3;
}



/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Enemy.prototype.update = function(tilemap) {
if(this.direction.left){
		//if (!input.down)
		{
			this.velocity.x -= Enemy_RUN_VELOCITY;
			this.velocity.x -= Enemy_RUN_VELOCITY;
			this.changeAnimation("moving left");
			this.facing = "left";
			
		
		}
					
	}
	else if(this.direction.right){
		this.velocity.x += Enemy_RUN_VELOCITY;
		this.velocity.x += Enemy_RUN_VELOCITY;
		this.changeAnimation("moving right");
		
			
		
		this.facing = "right";
	}
	else this.changeAnimation("stand still");
	if(this.velocity.x>0) {
		this.velocity.x -=Enemy_RUN_VELOCITY;
	}
	if(this.velocity.x<0){
		this.velocity.x +=Enemy_RUN_VELOCITY
	}
	
	if(this.velocity.x < -Enemy_RUN_MAX) this.velocity.x=-Enemy_RUN_MAX;
	if(this.velocity.x > Enemy_RUN_MAX) this.velocity.x=Enemy_RUN_MAX;

	this.levelPos.x += this.velocity.x;
	//this.levelPos.y += this.velocity.y;
	//this.screenPos.y += this.velocity.y;

	// Prevent enemy from flying off screen
	if(this.levelPos.x <= 0){
		this.levelPos.x = 0;
	}
	else if(this.levelPos.x >= LEVEL_LENGTH - this.widthInGame){
		this.levelPos.x = LEVEL_LENGTH - this.widthInGame;
	}

	// Prevent background from moving too far
	if(this.levelPos.x <= 512 ){
		this.screenPos.x = this.levelPos.x;
	}
	else if(this.levelPos.x >= LEVEL_LENGTH - 512){
		this.screenPos.x = 1024 - (LEVEL_LENGTH - this.levelPos.x);
	}
	else{
		this.screenPos.x = 512;
	}	


	this.animationTimer++;
  if (this.animationTimer>this.frameLength)
  {
	  if(this.animation!="moving up"){
		this.animationCounter++;
		
	  }
	  this.animationTimer = 0;
  }
  if (this.animationCounter>=this.numberOfSprites){
		if(this.animation!="stand still"){
			this.animationCounter = 0;
		}
		else{
		this.animationCounter = 0;
		}
  }
   for (var i = 0 ; i < this.enemyFire.length ; i++)
  {
	  this.enemyFire[i].update();
	  
	  //remove the shot at this condtion, it could be hitting an opject or going out of the screen
	  if (this.enemyFire[i].timer>40)
	  {
		  
		  this.enemyFire.splice(i,1);
		  i--;
	  }
  }
  for (var i = 0 ; i < this.enemyBombs.length ; i++)
  {
	  this.enemyBombs[i].update();
	  
	  //remove the shot at this condtion, it could be hitting an opject or going out of the screen
	  if (this.enemyBombs[i].timer>40 && this.enemyBombs[i].state=="falling")
	  {
		  this.enemyBombs[i].explode();
		  this.numBombs--;
		  
	  }
	  else if (this.enemyBombs[i].state=="finished")
	   {
		this.enemyBombs.splice(i,1);
		i--; 
	   }
  }
  
  if(this.reticulePosition.fire==true){
	  var camera = new Camera(this.reticulePosition.canvas);
	  var direction = Vector.subtract(
      {x:this.reticulePosition.x,y:this.reticulePosition.y},
      camera.toScreenCoordinates(this.screenPos));
      
	  if(this.reticulePosition.type=="lazer"){
		this.fire(direction,this.enemyFire);
	  }
	  else if(this.reticulePosition.type=="bomb"){
		  if(this.numBombs == 0)
		  {
		  	return;
		  }
		  this.bomb(direction,this.enemyBombs);
	  }
	  this.reticulePosition.fire=false;
  }
  
  //Check if the enemy is due for a hintbox
  this.hintboxCooldown -= 1;
  if(this.hintboxCooldown <= 0 && this.levelPos.x < 10600 && this.levelPos.x > 600)
  {
	if(this.hintboxAlpha >= 0.7 && this.increaseAlpha)
	{
	  this.increaseAlpha = false;
	}
	if (this.increaseAlpha)
	{
	  this.hintboxAlpha += 0.05;
	}
	else
	{
	  this.hintboxAlpha -= 0.05;
	}

	//Check if the animation is complete. If so, reset the properties we use for the animation
	if(this.hintboxAlpha <= 0.1)
	{
	  this.hintboxAlpha = 0.1;		 
	  this.increaseAlpha = true;
	  this.hintboxIteration++;
	  
	  if (this.hintboxIteration == 2)
	  {
		  this.hintboxCooldown = 900;
		  this.hintboxIteration = 0;
	  }
	}
  }
	  
  	this.lazerCooldown--;
  	this.bombCooldown--;
  
	this.send = {levelPos:this.levelPos, screenPos:this.screenPos, direction: this.noDir,
	sx:this.xPlaceInImage+this.spriteWidth*this.animationCounter, sy:this.yPlaceInImage,
	swidth:this.spriteWidth, sheight:this.spriteHeight, width:this.widthInGame,
	height:this.heightInGame, animation:this.animationCounter,
	velocity:this.velocity,enemyFire:this.enemyFire,reticule:this.reticulePosition.fire,
	enemyBomb:this.enemyBombs, sound:this.sound, hintboxAlpha:this.hintboxAlpha, leftOfPlayer:this.leftOfPlayer,
	numBombs:this.numBombs};
}

Enemy.prototype.changeAnimation = function(animation)
{
	this.animation = animation;
	if (this.animation == "stand still"){
		this.numberOfSprites = 0;
		this.animationTimer = 0;
		this.animationCounter = 0;
		this.spriteHeight = this.stillHeight;
		this.spriteWidth = this.stillWidth;
		this.widthInGame = this.stillWidthInGame;   
		this.heightInGame = this.stillHeightInGame;
		this.moving = false;
		
		if (this.facing=="right")
			this.yPlaceInImage = this.spriteHeight*0;
		else
			this.yPlaceInImage = this.spriteHeight*1;
		this.xPlaceInImage = this.spriteWidth*0;
		
	}
	else{
		this.numberOfSprites = 3;
		this.heightInGame = 68;
		this.spriteHeight = this.movingHeight;
		this.spriteWidth = this.movingWidth;
		this.widthInGame = this.movingWidthInGame;   
		this.heightInGame = this.movingHeightInGame;
		this.moving = true;
		switch(this.animation){
			case "moving left":
				this.yPlaceInImage = 84; 
				break;
			case "moving right":
				this.yPlaceInImage = 48; 
				break;
		}
	}
}

Enemy.prototype.fire = function(direction,enemyFire)
{	
	 var velocity = Vector.scale(Vector.normalize(direction), FIRE_SPEED);
	 
	 if ( this.lazerCooldown<1)
  {
	  var p = Vector.add(this.levelPos, {x:0, y:0});
	  var laz = new EnemyFire(p,velocity,this.levelPos);
	  this.enemyFire.push(laz);	  
	  this.lazerCooldown = 15;  
  }
}


Enemy.prototype.bomb = function(direction,enemyBombs)
{
	var velocity = Vector.scale(Vector.normalize(direction), FIRE_SPEED);
	if ( this.bombCooldown<1)
  	{
	  
	  //var p = {x : this.position.x+this.widthInGame/2, y: this.position.y+this.heightInGame - this.heightInGame/3}
	  var p =  Vector.add(this.levelPos, {x:15, y:15});
	  //var position = Vector.add(this.position, {x:30, y:30});
	  var bomb = new EnemyBomb(p,velocity,this.levelPos);
	  /*
	  if (this.facing == "right")
	  {
		   //p.x += this.widthInGame;
		   bomb =  new EnemyBomb(p,velocity);
	  }
		*/ 
 
	  
	  enemyBombs.push(bomb);
	  this.bombCooldown = 60;  
  	}
	
}
