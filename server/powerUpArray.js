"use strict";
/*
	Constants
	We made these "var" instead of "const" because node.js is
	outdated on the lab computers
*/
var BOX_DURATION = 20000;
var PLAYER_DURATION = 10000;
var OFFSET = 15;
var ELAPSED_TIME = 32;

/**
 * @module exports the PowerUpArray class
 */
module.exports = exports = PowerUpArray;

function PowerUp(pos, t) {
	this.position = pos;
	this.type = t;
	this.render = true;
	this.pickedUp = false;
	this.active = false;
	this.depleted = false;
	this.duration;

	if(this.type == 0) {
		// 30 second box duration
		this.duration = BOX_DURATION;
	}
	else
	{
		// Player radar duration
		this.duration = PLAYER_DURATION;
	}
}

function PowerUpArray() {
	this.powerUps = [];
	this.length;
	this.yOffset = 0;
	this.yOffsetDir = 'up';
	this.oldTime = Date.now();
	this.elapsedTime = 0;
	this.powerUpTimeElapsed = 0;
	this.powerUpsBeingHeld = 0;

	this.powerUps[0] = new PowerUp({
		x: 3595,
		y: 320},
		0
	);
	this.powerUps[1] = new PowerUp({
		x: 5280,
		y: 200},
		1
	);
	this.length = 2;
}

PowerUpArray.prototype.update = function(player, newTime) {
	//adjust the yOffset to give the image an animated effect
	if(this.elapsedTime > ELAPSED_TIME) {
		if(this.yOffset == OFFSET) {
			this.yOffsetDir = 'down';
		}
		else if (this.yOffset == -OFFSET) {
			this.yOffsetDir = 'up';
		}

		if(this.yOffsetDir == 'up') {
			this.yOffset++;
		}
		else {
			this.yOffset--;
		}
		this.elapsedTime = 0;
	}

	// Reduce the duration of all active powerups
	for(var i = 0; i < this.length; i++) {
		if(this.powerUps[i].active) {
			if(this.powerUps[i].duration <= 0) {
				this.powerUps[i].active = false;
				this.powerUps[i].depleted = true;
				this.powerUps[i].pickedUp = false;
				this.powerUpsBeingHeld--;
			}
			else {
				this.powerUps[i].duration -= (newTime - this.oldTime);
			}
		}
	}

	this.powerUpTimeElapsed += (newTime - this.oldTime);
	this.elapsedTime += (newTime - this.oldTime);
	this.oldTime = newTime;
}
