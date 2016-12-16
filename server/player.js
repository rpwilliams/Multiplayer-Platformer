"use strict";
var firstFrame = true;
/*
	Constants
	We made these "var" instead of "const" because node.js is
	outdated on the lab computers
*/
var PLAYER_RUN_VELOCITY = 4;
var PLAYER_FALL_VELOCITY = 0.5;
var PLAYER_JUMP_SPEED = 8;
var PLAYER_WON_GAME_X_POS = 9500;
var CANVAS_WIDTH = 1024;
var LEVEL_LENGTH = 9600;
var PLAYER_MAX_FALL_VELOCITY = 12;
var TILE_SIZE = 48;

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
	this.widthInGame = 34.5;
	this.heightInGame = 51;
	this.xPlaceInImage = 0; // this should CHANGE for the same animation
	this.yPlaceInImage = 0; // this should NOT change for the same animation
	this.animation = "stand still"; // this will keep track of the animation
	this.velocity = {x: 0, y: 0};
	this.screenPos= {x: CANVAS_WIDTH/2, y: position.y};
	this.levelPos= {x: position.x, y: position.y};
	this.direction = {left:false, down:false, right:false, up:false};
	this.noDir = {left:false, down:false, right:false, up:false};
	this.id = 'player';
	this.sound = null;
	this.send = {levelPos:this.levelPos, screenPos:this.screenPos, direction: this.noDir,
	sx:this.xPlaceInImage+this.spriteWidth*this.animationCounter, sy:this.yPlaceInImage,
	swidth:this.spriteWidth, sheight:this.spriteHeight, width:this.widthInGame,
	height:this.heightInGame, animation:this.animationCounter,
	velocity:this.velocity, wonGame:this.wonGame,id:this.id, health:this.health};

	this.socket = socket;
	this.jumping = false;
	this.falling = true;
	this.facing = "left";
	this.wonGame = false;
	this.health = 5;
	this.pixelBuffer = 6;
}



/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Player.prototype.update = function(tilemap) {

	// TODO: Remove (lets player jump to clicked X position)
	if(this.reticulePosition && this.reticulePosition.fire){
		this.levelPos.x += this.reticulePosition.x - CANVAS_WIDTH/2;
		this.levelPos.y = 100;
		this.screenPos.y = 100;
		this.reticulePosition.fire=false;
  	}

	// Left key pressed
	if(this.direction.left){
		if(this.jumping || this.falling){
			if(this.velocity.x > -PLAYER_RUN_VELOCITY){
				this.velocity.x -= 0.2;// TODO: magic numbers
			}
		}
		else{
			this.velocity.x = -PLAYER_RUN_VELOCITY;
			this.changeAnimation("moving left");
			this.facing = "left";
		}
	}

	// Right key pressed
	else if(this.direction.right){
		if(this.jumping || this.falling){
			if(this.velocity.x < PLAYER_RUN_VELOCITY){
				this.velocity.x += 0.2;// TODO: magic numbers
			}
		}
		else{
			this.velocity.x = PLAYER_RUN_VELOCITY;
			this.changeAnimation("moving right");
			this.facing = "right";
		}
	}

	// Jumping or falling
	if(this.jumping || this.falling){
		this.changeAnimation("moving up");
		if(this.velocity.y < PLAYER_MAX_FALL_VELOCITY){
			this.velocity.y += PLAYER_FALL_VELOCITY;
		}
		if(this.velocity.y > 0){
			this.jumping=false;
			this.falling=true;
		}

	}

	// Beginning to jump
	else if(this.direction.up){
		this.velocity.y -= PLAYER_JUMP_SPEED;
		this.jumping=true;
	}

	// Standing still
	else{
		if(!this.direction.right && !this.direction.left){
			this.velocity.x = 0;
			this.changeAnimation("stand still");
		}
	}

	// Move player
	this.levelPos.x += this.velocity.x;
	this.levelPos.y += this.velocity.y;
	this.screenPos.y += this.velocity.y;

	// Prevent player from walking off screen
	if(this.levelPos.x <= 0){
		this.levelPos.x = 0;
	}
	else if(this.levelPos.x >= LEVEL_LENGTH - this.widthInGame){
		this.levelPos.x = LEVEL_LENGTH - this.widthInGame;
	}

	// Prevent background from moving too far
	if(this.levelPos.x <= CANVAS_WIDTH/2 ){
		this.screenPos.x = this.levelPos.x;
	}
	else if(this.levelPos.x >= LEVEL_LENGTH - CANVAS_WIDTH/2){
		this.screenPos.x = CANVAS_WIDTH - (LEVEL_LENGTH - this.levelPos.x);
	}
	else{
		this.screenPos.x = CANVAS_WIDTH/2;
	}


	// Update animations
	this.animationTimer++;
	if (this.animationTimer>this.frameLength)
	{
	  if(this.animation=="stand still") this.animationCounter=0;
	  else if(this.animation!="moving up"){
		this.animationCounter++;
	  }
	  this.animationTimer = 0;
	}

	if (this.animationCounter >= this.numberOfSprites){
		if(this.animation!="stand still"){
			this.animationCounter = 3;	// TODO: magic numbers
		}
		else{
		this.animationCounter = 0;
		}
	}
	if(this.jumping==true) this.xPlaceInImage = this.spriteWidth*5;
	else if(this.falling==true) this.xPlaceInImage = this.spriteWidth*6;
	else this.xPlaceInImage = 0;

	// Check if player 1 won the game
	if(Math.floor(this.levelPos.x) > PLAYER_WON_GAME_X_POS)// TODO: magic numbers
	{
		this.wonGame = true;
  	}

	// Tile collisions
	this.hitSolid(tilemap);


	this.send = {levelPos:this.levelPos, screenPos:this.screenPos, direction: this.noDir,
	sx:this.xPlaceInImage+this.spriteWidth*this.animationCounter, sy:this.yPlaceInImage,
	swidth:this.spriteWidth, sheight:this.spriteHeight, width:this.widthInGame,
	height:this.heightInGame, animation:this.animationCounter,
	velocity:this.velocity,wonGame:this.wonGame, id:this.id, health:this.health,
	hit:this.hit};
}


Player.prototype.changeAnimation = function(x)
{
	this.animation = x;
	if (this.animation == "stand still"){
		this.numberOfSprites = 0;
		this.animationTimer = 0;
		this.animationCounter = 0;
	}
	else{
		this.numberOfSprites = 5;// TODO: magic numbers
		switch(this.animation)
		{
			case "moving up":
				this.animationCounter=0;
			break;
			case "moving down":
  				this.yPlaceInImage =this.spriteHeight*0;
  				break;
			case "moving left":
				if(this.jumping==false && this.falling==false){
            		          this.yPlaceInImage =this.spriteHeight*1;
                                  if (this.animationCounter == 3) { 
				    if (firstFrame) {
				      this.sound = 1; 
				      firstFrame = false; 
				    }
				  } else {
				    firstFrame = true;
				  }
          		}
				break;
			case "moving right":
				this.yPlaceInImage =this.spriteHeight*0;
                                if (this.animationCounter == 3) { 
			          if (firstFrame) {
	                 	    this.sound = 1; 
				    firstFrame = false; 
				  }
				} else {
				    firstFrame = true;
				}
				break;
		}
	}
}


Player.prototype.hitSolid = function(tilemap) {
	var lowerLeft = tilemap.tileAt(this.levelPos.x + this.pixelBuffer, (this.levelPos.y + this.heightInGame), 2);
	var lowerRight = tilemap.tileAt((this.levelPos.x + this.widthInGame - this.pixelBuffer), (this.levelPos.y + this.heightInGame), 2);
	var lowerLeftPlat = tilemap.tileAt(this.levelPos.x + this.pixelBuffer, (this.levelPos.y + this.heightInGame), 3);
	var lowerRightPlat = tilemap.tileAt((this.levelPos.x + this.widthInGame - this.pixelBuffer), (this.levelPos.y + this.heightInGame), 3);
	var side;

	// No tiles underneath player - fall
	if (!(lowerLeft.tile.Solid || lowerRight.tile.Solid) && this.velocity.y >= 0) {
		this.falling=true;
	}

	// Right
	if(this.velocity.x > 0){
		side = tilemap.tileAt((this.levelPos.x + this.widthInGame - this.pixelBuffer), (this.levelPos.y + this.heightInGame - 2*this.pixelBuffer), 2); 
		if(side.tile.Solid){
			this.levelPos.x -= this.velocity.x;
			this.velocity.x = 0;
		}
	}

	// Left
	else if(this.velocity.x < 0){
		side = tilemap.tileAt((this.levelPos.x + this.pixelBuffer), (this.levelPos.y + this.heightInGame - 2*this.pixelBuffer), 2); 
		if(side.tile.Solid){
			this.levelPos.x -= this.velocity.x;
			this.velocity.x = 0;
		}		
	}

	// Falling
	if(this.falling){
		if (lowerLeftPlat.tile.Solid || lowerRightPlat.tile.Solid) {
			if(this.levelPos.y + this.heightInGame - lowerLeftPlat.tileY*TILE_SIZE < 10){
				this.levelPos.y = lowerLeftPlat.tile.Solid ? lowerLeftPlat.tileY*TILE_SIZE: lowerRightPlat.tileY*TILE_SIZE;
				this.screenPos.y = lowerLeftPlat.tile.Solid ? lowerLeftPlat.tileY*TILE_SIZE: lowerRightPlat.tileY*TILE_SIZE;
				this.levelPos.y -= this.heightInGame - this.pixelBuffer;
				this.screenPos.y -= this.heightInGame - this.pixelBuffer;
				this.velocity.y=0;
				this.falling=false;
			}
		}	  
	}
}

