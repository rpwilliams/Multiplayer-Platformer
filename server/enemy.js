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
  this.socket = socket;
}
