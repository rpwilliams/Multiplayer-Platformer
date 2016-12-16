"use strict";

/* Constants */
var FIRE_SPEED = 1;

/**
 *
 */
module.exports = exports = EnemyFire;

function EnemyFire(position,velocity,levelPos) {
  this.position = {
    x: position.x,
    y:position.y
  }
  this.width = 5;
  this.height = 20;
  this.lazerSize = 3;
  this.widthOverlap = this.width*0.30;
  this.heightOverlap = this.height*0.60;
  this.levelPos = {
    x: levelPos.x,
    y:levelPos.y
  };

  this.timer = 0;

  this.velocity = velocity;//console.log(this.velocity);
  this.angle = Math.atan2(velocity.x, velocity.y);
}

EnemyFire.prototype.update = function(elapsedTime) {
	this.position.x+=this.velocity.x;
	this.position.y+=this.velocity.y;

	this.timer+=0.1;
}
