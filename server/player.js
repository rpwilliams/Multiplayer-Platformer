"use strict";

/**
 * @module exports the Player class
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a new player object
 * @param {Postition} position object specifying an x and y
 */
function Player(position, socket) {
  this.position = {x: position.x, y: position.y, direction: 'none'};
  this.height = 10;
  this.width = 10;
  this.socket = socket;
}

Player.prototype.hitGround = function(tilemap) {
  var playerFeet = this.position.y + this.height;
  var tile = tilemap.tileAt(this.position.x, this.position.y, 0);
  if (tile.solid) {
    this.direction = "none";
    this.position.y -= playerFeet % tilemap.tileHeight;
    return true; 
  }
}
