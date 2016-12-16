"use strict";

module.exports = exports = PowerUpArray;

function PowerUp(pos, t)
{
	this.position = pos;
	this.type = t;
	this.render = true;
	this.pickedUp = false;
	this.active = false;
	this.depleted = false;
	this.duration = 30000;
}

function PowerUpArray()
{
	this.powerUps = [];
	this.length;
	this.yOffset = 0;
	this.yOffsetDir = 'up';
	this.oldTime = Date.now();
	this.elapsedTime = 0;
	this.powerUpTimeElapsed = 0;
	
	this.powerUps[0] = new PowerUp({x: 3595, y: 320}, 0);
	this.powerUps[1] = new PowerUp({x: 5280, y: 200}, 1);
	this.length = 2;
}

PowerUpArray.prototype.update = function(player, newTime)
{	
	//adjust the yOffset to give the image an animated effect
	if(this.elapsedTime > 32){
		if(this.yOffset == 15)
		{
			this.yOffsetDir = 'down';
		}
		else if (this.yOffset == -15)
		{
			this.yOffsetDir = 'up';
		}
		
		if(this.yOffsetDir == 'up')
		{
			this.yOffset++;
		}
		else
		{
			this.yOffset--;
		}
		
		this.elapsedTime = 0;
	}
	
	// Reduce the duration of all active powerups
	for(var i = 0; i < this.length; i++)
	{
		if(this.powerUps[i].active)
		{
			if(this.powerUps[i].duration <= 0)
			{
				this.powerUps[i].active = false;
				this.powerUps[i].depleted = true;
			}
			else
			{
				this.powerUps[i].duration -= (newTime - this.oldTime);
			}
		}
	}
	
	this.powerUpTimeElapsed += (newTime - this.oldTime);
	this.elapsedTime += (newTime - this.oldTime);
	this.oldTime = newTime;
}