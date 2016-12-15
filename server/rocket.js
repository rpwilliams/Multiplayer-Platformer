"use strict";

module.exports = exports = Rocket;


function SingleObject(pos)
{
	this.position = pos;
}

// Array of SingleObjects
function Rocket()
{
	this.oldTime = Date.now();
	this.elapsedTime = 0;
	
	// Pre-made objects that will spawn in the same locations at the beginning of each game
	this.object = new SingleObject({x: 1050, y: 610});
}

Rocket.prototype.add = function(pos)
{
	// Adds a new object to the array
	this.object = {position: pos};
}

Rocket.prototype.update = function(player, newTime)
{	
	
}
