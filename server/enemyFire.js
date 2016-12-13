"use strict";
 
/* Constants */
var FIRE_SPEED = 1;

/**
 *  
 */
module.exports = exports = EnemyFire;

function EnemyFire(position,velocity,levelPos) {
   this.position = {x: position.x, y:position.y}
   //this.velocity = {x: velocity.x, y:velocity.y}
   //this.direction = direction;
   //this.kind = kind;
   this.width = 10;
   this.height = 10;
   this.lazerSize = 3;
   this.widthOverlap = this.width*0.30;
   this.heightOverlap = this.height*0.60;
   this.levelPos = {x: levelPos.x, y:levelPos.y}
   
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
	
	this.timer+=0.1;
}