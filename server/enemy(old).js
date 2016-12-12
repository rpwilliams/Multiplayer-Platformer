"use strict";

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
function Enemy(position,socket ) {
   
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


this.animation = "stand still"; // this will keep track of the animation
this.tookAstep = "no";
this.position={x: position.x, y: position.y};
this.send = {x: this.position.x, y: this.position.y, direction: 'none',
sx:this.xPlaceInImage+this.spriteWidth*this.animationCounter,sy:this.yPlaceInImage,
swidth:this.spriteWidth,sheight:this.spriteHeight,width:this.widthInGame,
height:this.heightInGame};
this.socket = socket;

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

	
	if(this.position.direction =="left"){
		//if (!input.down)
		{
			this.velocity.x -= Enemy_RUN_VELOCITY;
			this.velocity.x -= Enemy_RUN_VELOCITY;
			this.changeAnimation("moving left");
			this.facing = "left";
			
		
		}
					
	}
	else if(this.position.direction =="right"){
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

	this.position.x += this.velocity.x;
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
  if (this.animationCounter>=this.numberOfsprites){
		if(this.animation!="stand still"){
			this.animationCounter = 0;
		}
		else{
		this.animationCounter = 0;
		}
  }
  
  
 
  this.send = {x: this.position.x, y: this.position.y, direction: 'none',
	sx:this.xPlaceInImage+this.spriteWidth*this.animationCounter,sy:this.yPlaceInImage,
	swidth:this.spriteWidth,sheight:this.spriteHeight,width:this.widthInGame,
	height:this.heightInGame};
}

/**
 * @function render
 * Renders the Enemy helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 
Enemy.prototype.render = function(elapasedTime, ctx) {
   ctx.drawImage( this.img,this.xPlaceInImage+this.spriteWidth*this.animationCounter , 
   this.yPlaceInImage, this.spriteWidth,this.spriteHeight, 
   this.position.x, this.position.y, this.widthInGame,this.heightInGame);
   this.xPlaceInImage=0;
}
 */
 
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
			//this.position.y+=this.offPostion;
			
			if (this.facing=="right")
				this.yPlaceInImage = this.spriteHeight*0;
			else
				this.yPlaceInImage = this.spriteHeight*1;
			this.xPlaceInImage = this.spriteWidth*0;
			//this.velocity.y=0;
		
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
					//this.position.y-=this.offPostion;
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