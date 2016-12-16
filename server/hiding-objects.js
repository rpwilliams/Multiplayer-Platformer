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
	this.objects[0] = new SingleObject({x: 900, y: 515}, 1);
	this.objects[1] = new SingleObject({x: 980, y: 515}, 1);
	this.objects[2] = new SingleObject({x: 1440, y: 467}, 3);
	this.objects[3] = new SingleObject({x: 1805, y: 485}, 5);
	this.objects[4] = new SingleObject({x: 2305, y: 417}, 2);
	this.objects[5] = new SingleObject({x: 2850, y: 515}, 3);
	this.objects[6] = new SingleObject({x: 2907, y: 515}, 3);
	this.objects[7] = new SingleObject({x: 3400, y: 322}, 2);
	this.objects[8] = new SingleObject({x: 3458, y: 322}, 2);
	this.objects[9] = new SingleObject({x: 3650, y: 485}, 5);
	this.objects[10] = new SingleObject({x: 4050, y: 563}, 3);
	this.objects[11] = new SingleObject({x: 4315, y: 485}, 5);
	this.objects[12] = new SingleObject({x: 4460, y: 485}, 5);
	this.objects[13] = new SingleObject({x: 4604, y: 485}, 5);
	this.objects[14] = new SingleObject({x: 4945, y: 275}, 2);
	this.objects[15] = new SingleObject({x: 5410, y: 458}, 3);
	this.objects[16] = new SingleObject({x: 5380, y: 515}, 3);
	this.objects[17] = new SingleObject({x: 5437, y: 515}, 3);
	this.objects[18] = new SingleObject({x: 5835, y: 352}, 3);
	this.objects[19] = new SingleObject({x: 5892, y: 352}, 3);
	this.objects[20] = new SingleObject({x: 5807, y: 409}, 3);
	this.objects[21] = new SingleObject({x: 5864, y: 409}, 3);
	this.objects[22] = new SingleObject({x: 5921, y: 409}, 3);
	this.objects[23] = new SingleObject({x: 5779, y: 467}, 3);
	this.objects[24] = new SingleObject({x: 5836, y: 467}, 3);
	this.objects[25] = new SingleObject({x: 5893, y: 467}, 3);
	this.objects[26] = new SingleObject({x: 5950, y: 467}, 3);//
	this.objects[27] = new SingleObject({x: 6400, y: 437}, 5);
	this.objects[28] = new SingleObject({x: 7097, y: 465}, 2);
	this.objects[29] = new SingleObject({x: 7380, y: 465}, 2);
	this.objects[30] = new SingleObject({x: 7438, y: 465}, 2);
	this.objects[31] = new SingleObject({x: 7720, y: 465}, 2);
	this.objects[32] = new SingleObject({x: 8220, y: 485}, 5);
	this.objects[33] = new SingleObject({x: 8643, y: 420}, 3);
	this.objects[34] = new SingleObject({x: 8643, y: 360}, 3);
	this.objects[35] = new SingleObject({x: 8701, y: 420}, 3);
	this.objects[36] = new SingleObject({x: 8818, y: 420}, 3);
	//this.objects[37] = new SingleObject({x: 11000, y: 460}, 7);
	this.objects[37] = new SingleObject({x: 9300, y: 371}, 7);
	this.length = 38;
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
		// Adjust y hitbox for cabinets
		var yOffset = 30;
		if(this.objects[i].type == 5)
		{
			yOffset = 70;
		}
		
		if (player.levelPos.x > (this.objects[i].position.x - 35) && player.levelPos.x < (this.objects[i].position.x + 50) 
			&& player.levelPos.y <= (this.objects[i].position.y + yOffset) && player.levelPos.y > (this.objects[i].position.y - 70 + yOffset))
		{
			// Check if pressing 'down' to hide
			if (player.direction.down)
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