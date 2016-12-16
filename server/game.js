const WIDTH = 5121;
const HEIGHT = 786;

module.exports = exports = Game;

const Player = require('./player.js');
const Enemy = require('./enemy.js');
const HidingObjects = require('./hiding-objects.js');
const PowerUpArray = require('./powerUpArray.js');
const Tilemap = require('./tilemap.js');

const fs = require('fs');

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
  this.time = Date.now();
  this.enemyFire = []; // Not sure we're even using this since it's already a property of the enemy class 
  this.enemyBombs = []; // Same goes for this
  this.players = [];
  this.hidingObjects = new HidingObjects();
  this.powerUpArray = new PowerUpArray();

  Tilemap.load(JSON.parse(fs.readFileSync('./client/assets/tiles/level.json')), {});

    // Initialize the player
  this.players.push(new Player(
      {x: 512, y: 400},
      sockets[0]
  ));

  this.players.push(new Enemy(
    {x: 10900, y: 100},
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
    player.socket.on('keyDown', function(direction) {
		player.direction.left = player.direction.left | direction.left;
		player.direction.down = player.direction.down | direction.down;
		player.direction.right = player.direction.right | direction.right;
		player.direction.up = player.direction.up | direction.up;
    });

    // Handle steering events
    player.socket.on('keyUp', function(direction) {

		player.direction.left = player.direction.left & direction.left;
		player.direction.down = player.direction.down & direction.down;
		player.direction.right = player.direction.right & direction.right;
		player.direction.up = player.direction.up & direction.up;
    });
	
	player.socket.on('ctrlKey', function(ctrlKey)
	{
	   player.ctrlKeyPressed = ctrlKey.isDown;
	});

  	player.socket.on('fire',function(reticulePosition){
  		player.reticulePosition = reticulePosition;
		player.sound = 0;
  	});
	
    //return player;
  });

  //this.io.to(this.room).emit('draw');

  // Place player on the screen
  // this.io.to(this.room).emit('render', {
  //   player: this.players[0].send,
  //   enemy: this.players[1].send
  // });

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
Game.prototype.update = function(newTime) {
  var state = this.state;
  var interval = this.interval;
  var room = this.room;
  var io = this.io;
  
  //Update hiding objects
  this.hidingObjects.update(this.players[0], this.time);
  
  //Update power ups
  this.powerUpArray.update(this.players[0], this.time);
  
  this.time = Date.now();
  
  
  // Update players
  this.players.forEach(function(player, i, players) {
    var otherPlayer = players[(i+1)%2];
    player.update(Tilemap);
    // Check for collision with walls
    // if(player.position.x < 0 || player.position.x > WIDTH || player.position.y < 0 || player.position.y > HEIGHT) {
    //   console.log("went out of bounds");
    //   player.socket.emit('defeat');
    //   otherPlayer.socket.emit('defeat');
    //   clearInterval(interval);
    // }
  });
	
  // Check for player collision and use of powerups 
  for(var i = 0; i < this.powerUpArray.length; i++)
  {
	if(this.players[0].levelPos.x > this.powerUpArray.powerUps[i].position.x - 25 && this.players[0].levelPos.x < this.powerUpArray.powerUps[i].position.x + 25
	&& this.players[0].levelPos.y > this.powerUpArray.powerUps[i].position.y - 35 && this.players[0].levelPos.y < this.powerUpArray.powerUps[i].position.y + 25)
	{
		// Disable any powerups previously picked up
		for (var j = 0; j < this.powerUpArray.length; j++)
		{
			if(this.powerUpArray.powerUps[j].pickedUp)
			{
				this.powerUpArray.powerUps[j].pickedUp = false;
				this.powerUpArray.powerUps[j].active = false;
				this.powerUpArray.powerUps[j].depleted = true;
			}
		}
		
		this.powerUpArray.powerUps[i].position.x = -100;
		this.powerUpArray.powerUps[i].render = false;
		this.powerUpArray.powerUps[i].pickedUp = true;
	}
	
	// Check if the player has activated a power up and make sure that powerup hasn't already been used
    if(this.players[0].ctrlKeyPressed && this.powerUpArray.powerUps[i].pickedUp && this.powerUpArray.powerUps[i].depleted == false)
	{
	   this.powerUpArray.powerUps[i].active = true;
	}
  }
	
  // Check for projectile collisions with hiding objects
  for (var j = 0; j < this.hidingObjects.length; j++)
  {
  	for (var i = 0 ; i < this.players[1].enemyFire.length; i++)
  	{
  		if (this.players[1].enemyFire[i].position.x > (this.hidingObjects.objects[j].position.x - 5) && this.players[1].enemyFire[i].position.x < (this.hidingObjects.objects[j].position.x + 70)
  			&& this.players[1].enemyFire[i].position.y > this.hidingObjects.objects[j].position.y  - 25 && this.players[1].enemyFire[i].position.y < this.hidingObjects.objects[j].position.y + 65)			
  		{
        this.players[1].enemyFire.splice(i,1);
        i--;  
  		}
  	}
  	for (var i = 0 ; i < this.players[1].enemyBombs.length ; i++)
  	{
  		  if (this.players[1].enemyBombs[i].position.x > this.hidingObjects.objects[j].position.x - 5 && this.players[1].enemyBombs[i].position.x < (this.hidingObjects.objects[j].position.x + 70)
  			&& this.players[1].enemyBombs[i].position.y > this.hidingObjects.objects[j].position.y  - 25 && this.players[1].enemyBombs[i].position.y < this.hidingObjects.objects[j].position.y + 65 &&
  				this.players[1].enemyBombs[i].state=="falling")			
  			{
  				//this.woo={bomb:this.players[1].enemyBombs[i].position,
  				//object:this.hidingObjects.objects[j].position};
          if(this.hidingObjects.objects[j].type != 7)
          {
            this.players[1].enemyBombs[i].explode();
            this.hidingObjects.objects[j].position.x=100000;
            break;
          }
  			}
  			if (this.players[1].enemyBombs[i].state=="finished")
  		  {
          this.players[1].enemyBombs.splice(i,1);
          i--; 
  		  }
  	 }
  }
  
  // Check for projectile collisions with the player
	for (var i = 0 ; i < this.players[1].enemyFire.length; i++)
	{
		if (this.players[1].enemyFire[i].position.x > this.players[0].levelPos.x - 15 && this.players[1].enemyFire[i].position.x < (this.players[0].levelPos.x + 50)
			&& this.players[1].enemyFire[i].position.y > this.players[0].levelPos.y  - 15 && this.players[1].enemyFire[i].position.y < this.players[0].levelPos.y + 75)			
		{
      console.log("Ouch!");
      this.players[0].health--;
      console.log("Player health: " + this.players[0].health);
		  this.players[1].enemyFire.splice(i,1);
			i--;
		}
	}

	//Check if the enemy has passed the player
	if (this.players[1].levelPos.x < this.players[0].levelPos.x)
	{
		this.players[1].leftOfPlayer = true;
	}
	else
	{
		this.players[1].leftOfPlayer = false;
	}
  
  // Broadcast updated game state
  // io.to(room).emit('move', {
  //   player: this.players[0].send,
  //   enemy: this.players[1].position
  // });

  this.players[0].socket.emit('render', {
    current: this.players[0].send,
    other: this.players[1].send
  }, this.hidingObjects, this.powerUpArray);

  this.players[1].socket.emit('render', {
    other: this.players[0].send,
    current: this.players[1].send
  }, this.hidingObjects, this.powerUpArray);

  this.players[0].sound = null;
  this.players[1].sound = null;
}
