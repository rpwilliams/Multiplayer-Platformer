"use strict";

module.exports = exports = HidingObjects;


function SingleObject(pos, t)
{
	this.position = pos;
	this.type = t;
	this.render = true;
	this.delayRender = false;
	this.displayArrow = false;
}

// Array of SingleObjects
function HidingObjects()
{
	this.objects = [];
	this.length;
	this.arrowFrame = 5;
	this.oldTime = Date.now();
	this.elapsedTime = 0;
	
	// Pre-made objects that will spawn in the same locations at the beginning of each game
	this.objects[0] = new SingleObject({x: 1050, y: 610}, 1);
	this.objects[1] = new SingleObject({x: 1150, y: 610}, 1);
	this.objects[2] = new SingleObject({x: 1670, y: 555}, 3);
	this.objects[3] = new SingleObject({x: 2075, y: 576}, 5);
	this.objects[4] = new SingleObject({x: 2490, y: 554}, 2);
	this.objects[5] = new SingleObject({x: 3375, y: 610}, 3);
	this.objects[6] = new SingleObject({x: 3435, y: 610}, 3);
	this.objects[7] = new SingleObject({x: 3895, y: 386}, 2);
	this.objects[8] = new SingleObject({x: 3955, y: 386}, 2);
	this.objects[9] = new SingleObject({x: 4305, y: 579}, 6);
	this.objects[10] = new SingleObject({x: 4750, y: 665}, 3);
	this.objects[11] = new SingleObject({x: 5050, y: 579}, 5);
	this.objects[12] = new SingleObject({x: 5220, y: 579}, 5);
	this.objects[13] = new SingleObject({x: 5390, y: 579}, 5);
	this.objects[14] = new SingleObject({x: 5782, y: 331}, 2);
	this.objects[15] = new SingleObject({x: 6330, y: 548}, 3);
	this.objects[16] = new SingleObject({x: 6360, y: 610}, 3);
	this.objects[17] = new SingleObject({x: 6300, y: 610}, 3);
	this.objects[18] = new SingleObject({x: 6860, y: 431}, 3);
	this.objects[19] = new SingleObject({x: 6920, y: 431}, 3);
	this.objects[20] = new SingleObject({x: 6830, y: 493}, 3);
	this.objects[21] = new SingleObject({x: 6890, y: 493}, 3);
	this.objects[22] = new SingleObject({x: 6950, y: 493}, 3);
	this.objects[23] = new SingleObject({x: 6800, y: 555}, 3);
	this.objects[24] = new SingleObject({x: 6860, y: 555}, 3);
	this.objects[25] = new SingleObject({x: 6920, y: 555}, 3);
	this.objects[26] = new SingleObject({x: 6980, y: 555}, 3);
	this.objects[27] = new SingleObject({x: 7515, y: 519}, 5);
	this.objects[28] = new SingleObject({x: 8310, y: 553}, 2);
	this.objects[29] = new SingleObject({x: 8640, y: 553}, 2);
	this.objects[30] = new SingleObject({x: 8700, y: 553}, 2);
	this.objects[31] = new SingleObject({x: 9040, y: 553}, 2);
	this.objects[32] = new SingleObject({x: 9620, y: 579}, 5);
	this.objects[33] = new SingleObject({x: 10100, y: 498}, 3);
	this.objects[34] = new SingleObject({x: 10100, y: 435}, 3);
	this.objects[35] = new SingleObject({x: 10160, y: 498}, 3);
	this.objects[36] = new SingleObject({x: 10310, y: 498}, 3);
	this.length = 37;
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
		if (player.levelPos.x > (this.objects[i].position.x - 35) && player.levelPos.x < (this.objects[i].position.x + 50) 
			&& player.levelPos.y <= (this.objects[i].position.y) && player.levelPos.y > (this.objects[i].position.y - 60))
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
