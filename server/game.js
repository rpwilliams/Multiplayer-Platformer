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
	var enemyFire = [];
	var enemyBombs = [];
    // Initialize the player
  this.players.push(new Player(
      {x: 90, y: 250},
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
      player.position.direction = direction;
    });

    //return player;
  });

  this.io.to(this.room).emit('draw');

  // Place player on the screen
  this.io.to(this.room).emit('move', {
    player: this.players[0].send,
    enemy: this.players[1].send
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



      player.update();

    // Check for collision with walls
    if(player.position.x < 0 || player.position.x > WIDTH || player.position.y < 0 || player.position.y > HEIGHT) {
      console.log("went out of bounds");
      player.socket.emit('defeat');
      otherPlayer.socket.emit('defeat');
      clearInterval(interval);
    }
  });
   
   //update fire 
  for (var i = 0 ; i < enemyFire.length ; i++)
  {
	  enemyFire[i].update(elapsedTime);
	  
	  //remove the shot at this condtion, it could be hitting an opject or going out of the screen
	  if (enemyFire[i].timer>40)
	  {
		  enemyFire.splice(i,1);
		  i--;
	  }
  }
  
  //update bomb 
  for (var i = 0 ; i < enemyBombs.length ; i++)
  {
	  enemyBombs[i].update(elapsedTime);
	  
	  //explode at this condtion, it could be hitting an opject or going out of the screen
	  if (enemyBombs[i].timer>40 && enemyBombs[i].state=="falling")
	  {
			  enemyBombs[i].explode();
	  }
	  if (enemyBombs[i].state=="finished")
	   {
		enemyBombs.splice(i,1);
		i--; 
	   }
  }
   
  // Broadcast updated game state
  io.to(room).emit('move', {
    player: this.players[0].send,
    enemy: this.players[1].send
  });
}
