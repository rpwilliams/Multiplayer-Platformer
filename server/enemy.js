"use strict";

/* Constants */
var Enemy_RUN_VELOCITY = 0.25;
var Enemy_RUN_SPEED = 5;
var Enemy_RUN_MAX = 3;
var Enemy_FALL_VELOCITY = 0.25;
var Enemy_JUMP_SPEED = 6;
var Enemy_JUMP_BREAK_VELOCITY= 0.20;

var FIRE_SPEED = 7;

var EnemyFire = require('./enemyFire');
//const EnemyBomb = require('./enemyBomb');
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
	this.animationCounter = 0;
	this.frameLength = 8;
	//animation dependent
	this.numberOfSprites = 0; // how man y frames are there in the animation
	this.spirteWidth = 42; // width of each frame
	this.spirteHeight = 23; // height of each frame
	this.widthInGame = 80;   
	this.heightInGame = 68;
	this.xPlaceInImage = 0; // this should CHANGE for the same animation
	this.yPlaceInImage = 0; // this should NOT change for the same animation
	this.animation = "stand still"; // this will keep track of the animation
	this.tookAstep = "no";
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
	this.velocity = {x: 0, y: 0};
	this.screenPos= {x: 512, y: position.y};
	this.levelPos= {x: position.x, y: position.y};
	this.direction = {left:false, down:false, right:false, up:false};
	this.enemyFire = [];
	this.enemyBombs = [];
	this.send = {levelPos:this.levelPos, screenPos:this.screenPos, direction: this.direction,
	sx:this.xPlaceInImage+this.spirteWidth*this.animationCounter, sy:this.yPlaceInImage,
	swidth:this.spirteWidth, sheight:this.spirteHeight, width:this.widthInGame,
	height:this.heightInGame, animation:this.animationCounter,
	velocity:this.velocity,woo:this.woo,enemyFire:this.enemyFire};

	this.socket = socket;

	this.reticulePosition = {x:0,y:0,fire:false};
	this.jumping = false;
	this.falling=false;
	this.crouching = "no";
	this.floorYPostion = 610;
	this.jumpingTime = 0;
	this.facing = "left";
	this.lazerCooldown=0;

	this.woo=false;
}



/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Enemy.prototype.update = function() {
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

	/*
	if(this.position.direction =="up")
	{
		
		this.velocity.y-=Enemy_RUN_VELOCITY;
		if(this.velocity.y < -Enemy_RUN_MAX) this.velocity.y=-Enemy_RUN_MAX;
	}
	else if (this.position.direction =="down")
	{
	
		this.velocity.y+=Enemy_RUN_VELOCITY;
		if(this.velocity.y > Enemy_RUN_MAX) this.velocity.y=Enemy_RUN_MAX;		
	}
    else{
		if(this.velocity.y>0)this.velocity.y-=Enemy_RUN_VELOCITY;
		else if(this.velocity.y<0)this.velocity.y+=Enemy_RUN_VELOCITY;
	}
	*/

	this.levelPos.x += this.velocity.x;
	this.levelPos.y += this.velocity.y;
	this.screenPos.y += this.velocity.y;
	//this.position.y += this.velocity.y;
	
	
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
  this.lazerCooldown--;
  if(this.reticulePosition.fire==true){
	  var camera = new Camera(this.reticulePosition.canvas);
	  var direction = Vector.subtract(
      {x:this.reticulePosition.x,y:this.reticulePosition.y},
      camera.toScreenCoordinates(this.screenPos));
      this.woo = this.reticulePosition;
	  this.fire(direction,this.enemyFire);
	  this.reticulePosition.fire=false;
  }
	  
  
	this.send = {levelPos:this.levelPos, screenPos:this.screenPos, direction: this.direction,
	sx:this.xPlaceInImage+this.spirteWidth*this.animationCounter, sy:this.yPlaceInImage,
	swidth:this.spirteWidth, sheight:this.spirteHeight, width:this.widthInGame,
	height:this.heightInGame, animation:this.animationCounter,
	velocity:this.velocity,woo:this.woo,enemyFire:this.enemyFire};
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
			//this.position.y+=this.offPostion;
			
			if (this.facing=="right")
				this.yPlaceInImage = this.spirteHeight*0;
			else
				this.yPlaceInImage = this.spirteHeight*1;
			this.xPlaceInImage = this.spirteWidth*0;
			//this.velocity.y=0;
		
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
					//this.position.y-=this.offPostion;
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
					//this.position.y-=this.offPostion;
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
	
	 var velocity2 = Vector.scale(Vector.normalize(direction), FIRE_SPEED);
	 //this.woo=velocity2;
	 
	 if ( this.lazerCooldown<1)
  {
	  //this.woo=true;
	  var p = Vector.add(this.levelPos, {x:0, y:0});
	  var laz = new EnemyFire(p,velocity2,this.levelPos);
	 // if (this.facing == "right")
	  //{
		   //p.x += this.widthInGame;
		  
	  //}
		 
	 
	  
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