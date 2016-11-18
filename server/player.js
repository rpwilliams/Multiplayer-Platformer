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
function Player(position, socket, id) {
  this.direction = "none";
  this.x = position.x;
  this.y = position.y;
  this.socket = socket;
  this.id = id;
}
