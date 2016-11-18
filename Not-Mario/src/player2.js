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
this.jumping = false;
this.falling=false;
this.crouching = "no"
this.floorYPostion = 600;
this.jumpingTime = 0;
this.facing = "left";

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
	if (this.jumping==false && this.falling==false)
	{
		if(input.left){
		this.velocity.x -= PLAYER_RUN_VELOCITY;
		this.changeAnimation("moving left");
		this.facing = "left";
		}
		else if(input.right){
			this.velocity.x += PLAYER_RUN_VELOCITY;
			this.changeAnimation("moving right");
			this.facing = "right";
		} 
		else if(this.velocity.x>0) {
			this.velocity.x -=PLAYER_RUN_VELOCITY;
		}
		else if(this.velocity.x<0){
			this.velocity.x +=PLAYER_RUN_VELOCITY;
		}
	}
	else{
		this.changeAnimation("moving up");
	}
	
	// set a maximum run speed
	if(this.velocity.x < -PLAYER_RUN_MAX) this.velocity.x=-PLAYER_RUN_MAX;
	if(this.velocity.x > PLAYER_RUN_MAX) this.velocity.x=PLAYER_RUN_MAX;
	
	
	console.log("jumping: " +this.jumping +"  falling: " +this.falling + "animation: " + this.animation);
	if(input.up && this.jumping==false && this.falling==false) {
		this.velocity.y -= PLAYER_JUMP_SPEED;
		this.jumping=true;
		
		this.jumpingTime+=elapsedTime;
	}
	else if(this.jumping==true || this.falling==true) {
		this.velocity.y += PLAYER_FALL_VELOCITY;
		if(this.velocity.y>0) {
			this.jumping=false;
			this.falling=true;
		}
			
		if (this.facing=="left")
		{
			
			if(input.right){
				this.velocity.x += PLAYER_JUMP_BREAK_VELOCITY;
			}
			
		}
		
		else if (this.facing=="right")
		{
			
			
			if(input.left){
			this.velocity.x -= PLAYER_JUMP_BREAK_VELOCITY;
			 
			}
		}
		if (this.position.y > this.floorYPostion - 4)
		{
			this.position.y = this.floorYPostion;
			this.velocity.y = 0;
			this.jumping = false;
			this.falling=false;
		}
		
	}
	
	
	/*
	else if(input.down && this.jumping==false) this.crouching == true;//this.velocity.y += PLAYER_RUN_SPEED / 2;
	*/


	// move the player
	this.position.x += this.velocity.x;
	this.position.y += this.velocity.y;
	//if(this.velocity.y>0) this.jumping=true;
	if(this.velocity.y<0) {
		//this.jumping=false;
		//this.falling=true;
		//this.velocity.y=0;
	}
	
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
   //this.xPlaceInImage=0;
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
			this.tookAstep = "yes";
		//}
		
		
	}
	else
	{
		this.numberOfSpirtes = 7;
		//tookAstep = "no";  
		switch(this.animation)
		{
			case "moving up":
			
				//this.xPlaceInImage =this.spirteWidth*7;
			
			break;
			
			case "moving down":
			this.yPlaceInImage =this.spirteHeight*0;
			break;
			
			case "moving left":
			
				if(this.jumping==false && this.falling==false)this.yPlaceInImage =this.spirteHeight*1;
			break;
			
			case "moving right":
			this.yPlaceInImage =this.spirteHeight*0;
			break;
		}
		
		
	}
	if(this.jumping==true) this.xPlaceInImage = this.spirteWidth*7;
	else if(this.falling==true) this.xPlaceInImage = this.spirteWidth*8;
	else this.xPlaceInImage = 0;
	
}