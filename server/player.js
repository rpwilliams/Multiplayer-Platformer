"use strict";

/* Constants */
var PLAYER_RUN_VELOCITY = 3;
var PLAYER_RUN_SPEED = 5;
var PLAYER_RUN_MAX = 3;
var PLAYER_FALL_VELOCITY = 0.25;
var PLAYER_JUMP_SPEED = 6;
var PLAYER_JUMP_BREAK_VELOCITY= 0.10;

/**
 * @module exports the Player class
 */
module.exports = exports = Player;


/**
 * @constructor Player
 * Creates a player
 */
function Player(position,socket ) {
	this.animationTimer = 0;
	this.animationCounter = 0;
	this.frameLength = 8;
	//animation dependent
	this.numberOfSprites = 0; // how man y frames are there in the animation
	this.spriteWidth = 23; // width of each frame
	this.spriteHeight = 34; // height of each frame
	this.widthInGame = 46;
	this.heightInGame = 68;
	this.xPlaceInImage = 0; // this should CHANGE for the same animation
	this.yPlaceInImage = 0; // this should NOT change for the same animation
	this.animation = "stand still"; // this will keep track of the animation
	this.tookAstep = "no";
	this.velocity = {x: 0, y: 0};
	this.screenPos= {x: 512, y: position.y};
	this.levelPos= {x: position.x, y: position.y};
	this.direction = 'none'
	this.id='player';
	this.send = {levelPos:this.levelPos, screenPos:this.screenPos, direction: 'none',
	sx:this.xPlaceInImage+this.spriteWidth*this.animationCounter, sy:this.yPlaceInImage,
	swidth:this.spriteWidth, sheight:this.spriteHeight, width:this.widthInGame,
	height:this.heightInGame, animation:this.animationCounter,
	velocity:this.velocity, wonGame:this.wonGame,id:this.id};

	this.socket = socket;

	this.jumping = false;
	this.falling=false;
	this.crouching = "no";
	this.floorYPostion = 610;
	this.jumpingTime = 0;
	this.facing = "left";
	this.wonGame = false;
}



/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Player.prototype.update = function() {
// set the velocity
	//this.velocity.x = 0;
	//track movment than change velocity and animation
	if (this.jumping==false && this.falling==false)
	{
		if(this.direction=="left"){
			this.velocity.x = -PLAYER_RUN_VELOCITY;
			// this.velocity.x -= PLAYER_RUN_VELOCITY;
			this.changeAnimation("moving left");
			this.facing = "left";
		}
		else if(this.direction=="right"){
			this.velocity.x = PLAYER_RUN_VELOCITY;
			// this.velocity.x += PLAYER_RUN_VELOCITY;
			this.changeAnimation("moving right");
			this.facing = "right";
		}
    	else if(this.direction=="none"){
			//this.velocity.x += PLAYER_RUN_VELOCITY;
			this.velocity.x = 0;
			this.changeAnimation("stand still");
		}
		// else if(this.velocity.x>0) {
		// 	this.velocity.x -=PLAYER_RUN_VELOCITY;
		// }
		// else if(this.velocity.x<0){
		// 	this.velocity.x +=PLAYER_RUN_VELOCITY;
		// }
	}
	else{
		this.changeAnimation("moving up");
	}

	// set a maximum run speed
	// if(this.velocity.x < -PLAYER_RUN_MAX) this.velocity.x=-PLAYER_RUN_MAX;
	// if(this.velocity.x > PLAYER_RUN_MAX) this.velocity.x=PLAYER_RUN_MAX;

	if(this.direction=="up" && this.jumping==false && this.falling==false) {
		this.velocity.y -= PLAYER_JUMP_SPEED;
		this.jumping=true;

		//this.jumpingTime+=elapsedTime;
	}
	else if(this.jumping==true || this.falling==true) {
		this.velocity.y += PLAYER_FALL_VELOCITY;
		if(this.velocity.y>0) {
			this.jumping=false;
			this.falling=true;
		}
		if (this.facing=="left")
		{
			if(this.direction=="right" && this.velocity.x!=0){
				this.velocity.x += PLAYER_JUMP_BREAK_VELOCITY;
			}
		}
		else if (this.facing=="right")
		{
			if(this.direction=="left" && this.velocity.x!=0){
				this.velocity.x -= PLAYER_JUMP_BREAK_VELOCITY;
			}
			
		}
		if (this.levelPos.y > this.floorYPostion)
		{
			this.levelPos.y = this.floorYPostion;
			this.screenPos.y = this.floorYPostion;
			this.velocity.y = 0;
			//this.velocity.x=0; // HAVE THE PLAYER STOP ALL MOMENTUM WHEN HIT GROUND
			this.jumping = false;
			this.falling=false;
			//this.animation="stand still";
		}
	}
	/*
	else if(input.down && this.jumping==false) this.crouching == true;//this.velocity.y += PLAYER_RUN_SPEED / 2;
	*/
	// move the player
	if(this.velocity.x==0 && this.velocity.y==0) this.animation="stand still";
	else{
		this.levelPos.x += this.velocity.x;
		this.levelPos.y += this.velocity.y;
		this.screenPos.y += this.velocity.y;
	}

	//if (!(this.animation=="stand still" && this.tookAstep=="yes"))
	this.animationTimer++;
	if (this.animationTimer>this.frameLength)
	{
	  if(this.animation=="stand still") this.animationCounter=0;
	  else if(this.animation!="moving up"){
		this.animationCounter++;

	  }
	  this.animationTimer = 0;
	}

	if (this.animationCounter>=this.numberOfSprites){
		if(this.animation!="stand still"){
			this.animationCounter = 3;
		}
		else{
		this.animationCounter = 0;
		}
	}
	if(this.jumping==true) this.xPlaceInImage = this.spriteWidth*5;
	else if(this.falling==true) this.xPlaceInImage = this.spriteWidth*6;
	else this.xPlaceInImage = 0;

	// Check if player 1 won the game
	if(Math.floor(this.levelPos.x) > 11200)
	{
		this.wonGame = true;
    	//console.log('Player 1 wins!');
  	}

	this.send = { levelPos:this.levelPos, screenPos:this.screenPos, direction: 'none',
	sx:this.xPlaceInImage+this.spriteWidth*this.animationCounter, sy:this.yPlaceInImage,
	swidth:this.spriteWidth, sheight:this.spriteHeight, width:this.widthInGame,
	height:this.heightInGame, animation:this.animationCounter,
	velocity:this.velocity,wonGame:this.wonGame, id:this.id};
}


Player.prototype.changeAnimation = function(x)
{

	this.animation = x;
	if (this.animation == "stand still")
	{
		//if (animationTimer == 0)
		//{
			this.numberOfSprites = 0;
		    this.animationTimer = 0;
			this.animationCounter = 0;
			this.tookAstep = "yes";
		//}


	}
	else
	{
		this.numberOfSprites = 5;
		//tookAstep = "no";
		switch(this.animation)
		{
			case "moving up":
				this.animationCounter=0;
				//this.xPlaceInImage =this.spriteWidth*7;

			break;

			case "moving down":
  			this.yPlaceInImage =this.spriteHeight*0;
  			break;

			case "moving left":

				  if(this.jumping==false && this.falling==false){
            this.yPlaceInImage =this.spriteHeight*1;

          }
			     break;
			case "moving right":
			this.yPlaceInImage =this.spriteHeight*0;
			break;
		}
	}
}