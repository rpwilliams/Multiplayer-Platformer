"use strict";

module.exports = exports = HidingObjects;


function SingleObject(pos, t)
{
	this.position = pos;
	this.type = t;
	this.delayRender = false;
	this.displayArrow = false;
}

// Array of SingleObjects
function HidingObjects()
{
	this.objects = [];
	this.length;
	this.arrowFrame = 5;
	this.spaceBetweenFrames = 0;
	this.oldTime = Date.now();
	this.elapsedTime = 0;
	
	// Pre-made objects that will spawn in the same locations at the beginning of each game
	this.objects[0] = new SingleObject({x: 1050, y: 610}, 0);
	this.objects[1] = new SingleObject({x: 1150, y: 610}, 1);
	this.length = 2;
}

HidingObjects.prototype.add = function(pos, t)
{
	// Adds a new object to the array
	this.objects[this.length] = {position: pos, type: t};
	this.length++;
}

HidingObjects.prototype.update = function(player, newTime)
{
	// Check for player collision with each object
	for(var i = 0; i < this.length; i++)
	{
		if (player.levelPos.x > (this.objects[i].position.x - 35) && player.levelPos.x < (this.objects[i].position.x + 50))
		{
			// Check if pressing 'down' to hide
			if (player.direction == 'down')
			{
				this.objects[i].displayArrow = false;
				this.objects[i].delayRender = true;
			}
			else{
				this.objects[i].delayRender = false;
				this.objects[i].displayArrow = true;
			}
		}
		else
		{
			this.objects[i].displayArrow = false;
			this.objects[i].delayRender = false;
		}
	}	
	
	if(this.elapsedTime > 150){
	   if (this.arrowFrame > 0) {
            this.arrowFrame--;
        }
        else {
            this.arrowFrame = 5;
        }
		this.elapsedTime = 0;
	}
	this.elapsedTime += (newTime - this.oldTime);
	this.oldTime = newTime;
}
