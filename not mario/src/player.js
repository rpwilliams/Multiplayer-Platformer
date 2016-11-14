"use strict";

/* Classes and Libraries */
 

/* Constants */
const PLAYER_RUN_VELOCITY = 0.25;
const PLAYER_RUN_SPEED = 5;
const PLAYER_RUN_MAX = 3;
const PLAYER_FALL_VELOCITY = 0.25;
const PLAYER_JUMP_SPEED = 3;

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
this.spirteWidth = 50; // width of each frame
this.spirteHeight = 48; // height of each frame
this.widthInGame = 80;   
this.heightInGame = 128;
this. xPlaceInImage = 0; // this should CHANGE for the same animation 
this. yPlaceInImage = 0; // this should NOT change for the same animation

this.animation = "stand still" // this will keep track of the animation
this.tookAstep = "no"
this.img.src = 'assets/death_scythe.png';

this.position = {x: 0 , y:0};

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
	if(input.left) this.velocity.x -= PLAYER_RUN_VELOCITY;
	else if(input.right) this.velocity.x += PLAYER_RUN_VELOCITY;
	else if(this.velocity.x>0) this.velocity.x -=PLAYER_RUN_VELOCITY;
	else if(this.velocity.x<0)this.velocity.x +=PLAYER_RUN_VELOCITY
	//this.velocity.y = 0;
	if(this.velocity.x < -PLAYER_RUN_MAX) this.velocity.x=-PLAYER_RUN_MAX;
	if(this.velocity.x > PLAYER_RUN_MAX) this.velocity.x=PLAYER_RUN_MAX;

	if(input.up && this.jumping==false) {
		this.velocity.y -= PLAYER_JUMP_SPEED;
		this.jumping=true;
	}
	else if(jumping==true) this.velocity.y += PLAYER_FALL_VELOCITY;
	else if(input.down && this.jumping==false) this.crouching == true;//this.velocity.y += PLAYER_RUN_SPEED / 2;



	// move the player
	this.position.x += this.velocity.x;
	this.position.y += this.velocity.y;
	
	
	if (!(this.animation=="stand still" && this.tookAstep=="yes"))
  this.animationTimer++;
  if (this.animationTimer>this.frameLength)
  {
	  this.animationCounter++;
	  this.animationTimer = 0;
  }
  if (this.animationCounter>this.numberOfSpirtes){
	  this.animationCounter = 0;
  }
  
  switch(this.animation)
  {
	  case "moving up":
	  case "moving down":
	  case "moving left":
	  case "moving right":
	  if (this.animationTimer == 0)
		  tookAstep = "yes";
	  
	  break;
	  case "stand still":
	  if (this.animationTimer == 0){
		  this.numberOfSpirtes = 0;
		    this.animationTimer = 0;
			this.animationCounter = 0;
			this.tookAstep = "yes";
	  }
	  
  }
}

/**
 * @function render
 * Renders the player helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Player.prototype.render = function(elapasedTime, ctx) {
   
}
 
 
Player.prototype.changeAnimation = function(x)
{
	this.animation = x;
	if (x == "stand still")
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
		this.numberOfSpirtes = 3;
		//tookAstep = "no";  
		switch(x)
		{
			case "moving up":
			
			this.yPlaceInImage =spirteHeight*3;
			
			break;
			
			case "moving down":
			this.yPlaceInImage =spirteHeight*0;
			break;
			
			case "moving left":
			this.yPlaceInImage =spirteHeight*1;
			break;
			
			case "moving right":
			this.yPlaceInImage =spirteHeight*2;
			break;
		}
		
	}
	
}