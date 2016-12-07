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

Enemy.prototype.hitSolid = function(tilemap) {
  var tile1;
  var tile2;
  switch(this.direction) {
    case "right":
      tile1 = tilemap.tileAt(this.position.x + this.width, this.position.y, 0);
      tile2 = tilemap.tileAt(this.position.x + this.width, this.position.y + this.height, 0);
      if (tile1.solid || tile2.solid) {
        this.position.x -= ((this.position.x + this.width) % tilemap.tileWidth) - 1;
        return true;
      }
      break;
    case "left":
      tile1 = tilemap.tileAt(this.position.x, this.position.y, 0);
      tile2 = tilemap.tileAt(this.position.x, this.position.y + this.height, 0);
      if (tile1.solid || tile2.solid) {
        this.position.x += tilemap.tileWidth - ((this.position.x) % tilemap.tileWidth) + 1;
        return true;
      }
      break;
    case "up":
      tile1 = tilemap.tileAt(this.position.x, this.position.y, 0);
      tile2 = tilemap.tileAt(this.position.x + this.width, this.position.y, 0);
      if (tile1.solid || tile2.solid) {
        this.position.y += tilemap.tileHeight - ((this.position.y) % tilemap.tileHeight) + 1;
        return true;
      }
      break;
    case "down":
      tile1 = tilemap.tileAt(this.position.x, this.position.y + this.height, 0);
      tile2 = tilemap.tileAt(this.position.x + this.width, this.position.y + this.height, 0) - 1;
      if (tile1.solid || tile2.solid) {
        this.position.y -= ((this.position.y + this.width) % tilemap.tileHeight);
        return true;
      }
      break;
  }
}
