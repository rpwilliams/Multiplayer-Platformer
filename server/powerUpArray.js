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
	this.animFrame = 5;
	this.oldTime = Date.now();
	this.elapsedTime = 0;
}

PowerUpArray.prototype.update = function(player, newTime)
{	

	//if (player.levelPos.x > (this.objects[i].position.x - 35) && player.levelPos.x < (this.objects[i].position.x + 50) 
			//&& player.levelPos.y <= (this.objects[i].position.y + yOffset) && player.levelPos.y > (this.objects[i].position.y - 70 + yOffset))

	if(this.elapsedTime > 150){
	   if (this.animFrame > 0) {
            this.animFrame--;
        }
        else {
            this.animFrame = 5;
        }
		this.elapsedTime = 0;
	}
	this.elapsedTime += (newTime - this.oldTime);
	this.oldTime = newTime;
}