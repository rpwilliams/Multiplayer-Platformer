"use strict";

/* Classes and Libraries */
const Vector = require('./vector');

/* Constants */
const TestPlayer_SPEED = .25;
const BULLET_SPEED = 10;
const MISSILE_SPEED = 10;
const MS_PER_FRAME = 1000/8;

/**
 * @module TestPlayer
 * A class representing a invisible player to test the background
  */
module.exports = exports = TestPlayer;

/**
 * @constructor TestPlayer
 * Creates a TestPlayer
 */
function TestPlayer() {
  this.position = {x: 200, y: 200};
  this.velocity = {x: 0, y: 0};
  this.width = 0;
  this.height = 0;
}

/**
 * @function update
 * Updates the TestPlayer based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
TestPlayer.prototype.update = function(elapsedTime, input) {

 // set the velocity
  this.velocity.x = 0;
  if(input.left) this.velocity.x -= TestPlayer_SPEED;
  if(input.right) this.velocity.x += TestPlayer_SPEED;
  if(input.up) this.velocity.y -= TestPlayer_SPEED * 2;
  if(input.down) this.velocity.y += TestPlayer_SPEED * 2;

  // move the TestPlayer
  this.position.x += this.velocity.x;
  this.position.y += this.velocity.y;
  
  // don't let the TestPlayer move off-screen
  //if(this.position.x < 0) this.position.x = 200;
  if(this.position.y > 700) this.position.y = 700;  
  if(this.position.y < 0) this.position.y = 0;  
}



