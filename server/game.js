const WIDTH = 1024;
const HEIGHT = 786;

module.exports = exports = Game;

const Player = require('./player.js');
const Enemy = require('./enemy.js');

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
      {x: 90, y: 50},
      sockets[0]
  ));

  this.players.push(new Enemy(
    {x: 120, y: 50},
    sockets[1]
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
    player: this.players[0].position,
    enemy: this.players[1].position
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
        player.position.x-=5;
        player.position.direction = 'left';
        break;
      case 'right':
        player.position.x+=5;
        player.position.direction = 'right';
        break;
      case 'down':
        player.position.y+=5;
        player.position.direction = 'down';
        break;
      case 'up':
        player.position.y-=5;
        player.position.direction = 'up';
        break;
      case 'stop':
        player.position.direction = 'none';
        break;
    }

    // Check for collision with walls
    if(player.position.x < 0 || player.position.x > WIDTH || player.position.y < 0 || player.position.y > HEIGHT) {
      console.log("went out of bounds");
      player.socket.emit('defeat');
      otherPlayer.socket.emit('defeat');
      clearInterval(interval);
    }
  });

  // Broadcast updated game state
  io.to(room).emit('move', {
    player: this.players[0].position,
    enemy: this.players[1].position
  });
}
