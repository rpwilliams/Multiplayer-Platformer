const WIDTH = 960;
const HEIGHT = 500;

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
    x: this.players[0].x,
    y: this.players[0].y,
    id: this.players[0].id
  });

  // Place player 2 on the screen and set direction
  this.io.to(this.room).emit('move', {
    x: this.players[1].x,
    y: this.players[1].y,
    id: this.players[1].id
  });

  // Start the game
  var game = this;
  // We use setInterval to update the game every 60
  // seconds.  When the game is over, we can stop
  // the update process with clearInterval.
  this.interval = setInterval(function(){
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
  this.players.forEach(function(player, i, players){
    var otherPlayer = players[(i+1)%2];

    // Move in current direction
    switch(player.direction) {
      case 'left': player.x-=5; break;
      case 'right': player.x+=5; break;
      case 'down': player.y+=5; break;
      case 'up': player.y-=5; break;
    }

    // Check for collision with walls
    if(player.x < 0 || player.x > 960 || player.y < 0 || player.y > 500) {
      console.log("went out of bounds");
      player.socket.emit('defeat');
      otherPlayer.socket.emit('defeat');
      clearInterval(interval);
    }

    // Check for collision with other player
    if(
      otherPlayer.x == player.x &&
      otherPlayer.y == player.y
    ) {
      // Broadcast game over - both players loose
      player.socket.emit('defeat');
      otherPlayer.socket.emit('defeat');
      console.log("collided with other player");
      clearInterval(interval);
    }

    // Check for collisions with light trail
    // if(state[player.y * WIDTH + player.x] != 0) {
    //   // Broadcast game over - this player looses
    //   player.socket.emit('defeat');
    //   // Broadcast game over - other player wins
    //   otherPlayer.socket.emit('victory');
    //   console.log("collided with light trail");
    //   clearInterval(interval);
    // } else {
    //   // claim the current position for player's light trail
    //   state[player.y * WIDTH + player.x] = player.id;
    // }

    // Broadcast updated game state
    io.to(room).emit('move', {
      x: player.x,
      y: player.y,
      id: player.id
    });

  });
}
