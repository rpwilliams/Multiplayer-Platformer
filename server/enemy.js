"use strict";

/**
 * @module exports the Enemy class
 */
module.exports = exports = Enemy;

/**
 * @constructor Enemy
 * Creates a new enemy object
 * @param {Postition} position object specifying an x and y
 */
function Enemy(position, socket) {
  this.position = {x: position.x, y: position.y, direction: 'none'};
  this.height = 10;
  this.width = 10;
  this.socket = socket;
}

Enemy.prototype.hitGround = function(tilemap) {
  var enemyFeet = this.position.y + this.height;
  var tile = tilemap.tileAt(this.position.x, this.position.y, 0);
  if (tile.solid) {
    this.direction = "none";
    this.position.y -= enemyFeet % tilemap.tileHeight;
    return true; 
  }
}
