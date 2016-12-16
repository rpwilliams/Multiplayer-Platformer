"use strict";

module.exports = exports = PowerUpArray;

function PowerUp(pos, t)
{
	this.position = pos;
	this.type = t;
	this.render = true;
}

function PowerUpArray()
{
	this.powerUps = [];
	this.length;
	this.yOffset = 0;
	this.yOffsetDir = 'up';
	this.oldTime = Date.now();
	this.elapsedTime = 0;
	
	this.powerUps[0] = new PowerUp({x: 3595, y: 320}, 0);
	this.powerUps[1] = new PowerUp({x: 5280, y: 200}, 1);
	this.length = 2;
}

PowerUpArray.prototype.update = function(player, newTime)
{	
	//Check for player collision
	for(var i = 0; i < this.length; i++)
	{
		if(player.levelPos.x > this.powerUps[i].position.x - 25 && player.levelPos.x < this.powerUps[i].position.x + 25
		&& player.levelPos.y > this.powerUps[i].position.y - 35 && player.levelPos.y < this.powerUps[i].position.y + 25)
		{
			this.powerUps[i].render = false;
		}
	}

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
	this.elapsedTime += (newTime - this.oldTime);
	this.oldTime = newTime;
}