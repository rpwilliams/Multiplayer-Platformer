const WIDTH = 1024;
const HEIGHT = 786;

module.exports = exports = Game;

const Player = require('./player.js');

/**
 * @class Game

 * @param {Object} io is a Socket.io server instance
 * @param {Array} sockets the two players' server sockets
 * @param {integer} room a unique identifier for this game
 */
function Game(io, sockets, room) {
  this.io = io;
  this.room = room;
  this.state = new Uint8Array(WIDTH * HEIGHT);
  this.players = [];

    // Initialize the player
  this.players.push(new Player(
      {x: 120, y: 50},
      sockets[0],
      1
  ));

  this.players.push(new Player(
    {x: 90, y: 50},
    sockets[1],
    2
  ));

  this.players.forEach(function(player) {
    // Join the room
    player.socket.join(room);

    // Handle disconnect events
    player.socket.on('disconnect', function() {
      // Broadcast to the other player that they disconnected
      io.to(room).emit('player disconnected');
    });

    // Handle steering events
    player.socket.on('steer', function(direction) {
      player.direction = direction;
    });

    //return player;
  });

  // Place player 1 on the screen and set direction
  this.io.to(this.room).emit('move', {
    player_x: this.players[0].x,
    player_y: this.players[0].y,
    enemy_x: this.players[1].x,
    enemy_y: this.players[1].y
  });

  // Start the game
  var game = this;
  // We use setInterval to update the game every 60
  // seconds.  When the game is over, we can stop
  // the update process with clearInterval.
  this.interval = setInterval(function() {
    game.update();
  }, 1000/60);
  this.io.to(this.room).emit('game on');
}

/**
 * @function update()
 * Advances the game by one step, moving players
 * and determining crashes.
 */
Game.prototype.update = function() {
  var state = this.state;
  var interval = this.interval;
  var room = this.room;
  var io = this.io;

  // Update players
  this.players.forEach(function(player, i, players) {
    var otherPlayer = players[(i+1)%2];

    // Move in current direction
    switch(player.direction) {
      case 'left':
        player.x-=5;
        player.direction = 'left';
        break;
      case 'right':
        player.x+=5;
        player.direction = 'right';
        break;
      case 'down':
        player.y+=5;
        player.direction = 'down';
        break;
      case 'up':
        player.y-=5;
        player.direction = 'up';
        break;
      case 'stop':
        player.direction = 'none';
        break;
    }

    // Check for collision with walls
    if(player.x < 0 || player.x > WIDTH || player.y < 0 || player.y > HEIGHT) {
      console.log("went out of bounds");
      player.socket.emit('defeat');
      otherPlayer.socket.emit('defeat');
      clearInterval(interval);
    }

    // Check for collision with other player
    if(otherPlayer.x == player.x && otherPlayer.y == player.y) {
      // Broadcast game over - both players loose
      player.socket.emit('defeat');
      otherPlayer.socket.emit('defeat');
      console.log("collided with other player");
      clearInterval(interval);
    }
  });

  // Broadcast updated game state
  io.to(room).emit('move', {
    player_x: this.players[0].x,
    player_y: this.players[0].y,
    player_direction: this.players[0].direction,
    enemy_x: this.players[1].x,
    enemy_y: this.players[1].y,
    enemy_direction: this.players[1].direction
  });
}
