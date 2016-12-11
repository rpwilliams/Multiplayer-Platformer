"use strict";

module.exports = exports = HidingObjects;

function HidingObjects()
{
	this.objects = [];
	this.length;
	
	// Pre-made objects that will spawn in the same locations at the beginning of each game
	this.objects[0] = {position: {x: 1100, y: 610}, type: 0};
	this.length = 1;
}

HidingObjects.prototype.add = function(p, t)
{
	// Adds a new object to the array
	this.objects[this.length] = {position: p, type: t};
	this.length++;
}

HidingObjects.prototype.update = function()
{
	
}