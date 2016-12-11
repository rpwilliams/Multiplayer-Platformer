"use strict";

const WIDTH = 1024;
const HEIGHT = 786;
//const Camera = require('./camera');

/* Global variables */
var canvas = document.getElementById('screen');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
//var camera = new Camera(canvas);
var images = [
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image()
];

images[0].src = 'level.png'; // Background
images[1].src = 'stars.png'; // Foreground
images[2].src = 'fumiko2.png';  // Player
images[3].src = 'DownArrow.png'; // Down arrow above hiding objects
images[4].src = 'BrownBox.png'; // Brown box
images[5].src = 'GrayBox.png'; // Gray box


// Start the game after all files have loaded
window.onload = function() {
  // Global variables
  var canvas = document.getElementById('screen');
  var message = document.getElementById('message');
  var ctx = canvas.getContext('2d');
  var socket = io();

  //handle draw background inputs from the server
  socket.on('draw', function() {
    renderBackground(ctx);
  });

  // Handle movement updates from the server
  socket.on('render', function(players, hidingObjects){
    // updateCamera(players.player);
	
	// Render the normal objects, followed by the player and then the objects that the player is hiding behind
	renderHidingObjects(players, hidingObjects, ctx, false);
    renderPlayers(players, ctx);
	renderHidingObjects(players, hidingObjects, ctx, true);
  });

  // // Handle movement updates from the server
  // socket.on('moveEnemy', function(players){
  //   // updateCamera(players.player);
  //   renderEnemyView(players, ctx);
  // });  

  // Handle game on events
  socket.on('game on', function() {
    message.style.display = 'none';
  });

  // Handle disconnected event
  socket.on('player left', function() {
    message.innerHTML = 'Player Left...';
    message.style.display = 'block';
  });

  // Handle victory
  socket.on('victory', function() {
    message.innerHTML = 'You win!';
    message.style.display = 'block';
  });

  // Handle loss
  socket.on('defeat', function() {
    message.innerHTML = 'You lose!';
    message.style.display = 'block';
  });

  // Handle key presses by sending a message to the
  // server with our new direction
  window.onkeydown = function(event) {
    event.preventDefault();
    switch(event.keyCode) {
      // UP
      case 38:
      case 32:
      case 87:
        socket.emit('steer', 'up');
        break;
      // LEFT
      case 37:
      case 65:
        socket.emit('steer', 'left');
        break;
      // RIGHT
      case 39:
      case 68:
        socket.emit('steer', 'right');
        break;
      // DOWN
      case 40:
      case 83:
        socket.emit('steer', 'down');
        break;
    }
  }

  window.onkeyup = function(event) {
    event.preventDefault();
    switch(event.keyCode) {
      case 38:
      case 87:
      case 32:
      case 37:
      case 65:
      case 39:
      case 68:
      case 40:
      case 83:
        socket.emit('steer', 'none');
        break;
    }
  }
}

function renderBackground(ctx, current) {

  // Render the background

  // Da stars
  ctx.save();
  //ctx.translate(-camera_position.x, 0);
  ctx.drawImage(images[1], 0, 0, 2600, 2600/images[1].width*images[1].height);
  ctx.restore();

  // Da background
  ctx.save();
  //TODO: magic numbers. 19200 = width of level image in pixels. 11229 = canvas height/image height * image width
  ctx.drawImage(images[0],
                (19200/11229)*(current.levelPos.x - current.screenPos.x), 0, images[0].width, images[0].height,
                0, 0, 11229, HEIGHT);
  // ctx.drawImage(images[0], 0, 0, images[0].width, HEIGHT);
  ctx.restore();
}

function renderPlayers(players, ctx) {
  //console.log(players.player);
  //ctx.fillRect(players.player.x, players.player.y, 5, 5);
  ctx.save();
  // ctx.translate(-camera_position.x, players.player.y);
  ctx.fillStyle = 'white';
  ctx.font="20px Verdana";
  ctx.fillText('level: (' + Math.floor(players.current.levelPos.x) + ',' + Math.floor(players.current.levelPos.y) + ')', players.current.screenPos.x, players.current.screenPos.y - 30);
  ctx.fillText('screen: (' + Math.floor(players.current.screenPos.x)+ ',' + Math.floor(players.current.screenPos.y) + ')', players.current.screenPos.x, players.current.screenPos.y - 10);
  ctx.fillText('level: (' + Math.floor(players.other.levelPos.x) + ',' + Math.floor(players.other.levelPos.y) + ')', players.other.levelPos.x - players.current.levelPos.x + players.current.screenPos.x, players.other.screenPos.y - 30);
  ctx.fillText('screen: (' + Math.floor(players.other.screenPos.x)+ ',' + Math.floor(players.other.screenPos.y) + ')', players.other.levelPos.x - players.current.levelPos.x + players.current.screenPos.x, players.other.screenPos.y - 10);  
  
  // Check if the player won the game
  if(Math.floor(players.current.levelPos.x) > 11200)
  {
    console.log('Player 1 wins!');
  }

  // Draw current player's sprite
  ctx.drawImage( images[2],players.current.sx ,
   players.current.sy, players.current.swidth, players.current.sheight,
   players.current.screenPos.x, players.current.screenPos.y, players.current.width, players.current.height);

  // Draw other player's sprite
  ctx.drawImage( images[2],players.other.sx ,
   players.other.sy, players.other.swidth, players.other.sheight,
   players.other.levelPos.x - players.current.levelPos.x + players.current.screenPos.x, players.other.screenPos.y, players.other.width, players.other.height);   

  ctx.restore();
}

function renderHidingObjects (players, hidingObjects, ctx, renderDelayedObjs)
{
  // Draw the canvas backgrounds
  if((players.current.direction == 'none' || players.other.direction == 'none') && renderDelayedObjs == false) {
    renderBackground(ctx, players.current);
  }
	
  // Draw hiding objects
  ctx.save(); 
  for(var i = 0; i < hidingObjects.length; i++)
  {
	  // Render objects not being used to hide behind
	  if(renderDelayedObjs == false)
	  {
		  if(hidingObjects.objects[i].delayRender == false)
		  {
			ctx.drawImage(images[4 + hidingObjects.objects[i].type],  hidingObjects.objects[i].position.x + (players.current.screenPos.x - players.current.levelPos.x), 
			hidingObjects.objects[i].position.y, images[4 + hidingObjects.objects[i].type].width * 2, images[4 + hidingObjects.objects[i].type].height * 2); 
		  }
	  }
	  // Now render those being hid behind
	  else
	  {
		  if(hidingObjects.objects[i].delayRender == true)
		  {
			ctx.drawImage(images[4 + hidingObjects.objects[i].type],  hidingObjects.objects[i].position.x + (players.current.screenPos.x - players.current.levelPos.x), 
			hidingObjects.objects[i].position.y, images[4 + hidingObjects.objects[i].type ].width * 2, images[4 + hidingObjects.objects[i].type].height * 2); 
		  }
	  }
	  
	 // Display animated down arrow if on top of a object that can be hid behind
	 if(hidingObjects.objects[i].displayArrow == true)
	{
		ctx.drawImage(images[3],hidingObjects.arrowFrame * 130, 0, 128, 175,  hidingObjects.objects[i].position.x + (players.current.screenPos.x - players.current.levelPos.x) + 16, hidingObjects.objects[i].position.y - 95, 30, 45);
	}
  }
  ctx.restore();
  
}

// function renderPlayerView(players, ctx) {
//   // Draw the canvas backgrounds
//   if(players.player.direction == 'none' || players.enemy.direction == 'none') {
//     renderBackground(ctx, players.player);
//   }
//   //console.log(players.player);
//   //ctx.fillRect(players.player.x, players.player.y, 5, 5);
//   ctx.save();
//   // ctx.translate(-camera_position.x, players.player.y);
//   ctx.fillStyle = 'white';
//   ctx.font="20px Verdana";
//   ctx.fillText('level: (' + Math.floor(players.player.levelPos.x) + ',' + Math.floor(players.player.levelPos.y) + ')', players.player.screenPos.x, players.player.screenPos.y - 30);
//   ctx.fillText('screen: (' + Math.floor(players.player.screenPos.x)+ ',' + Math.floor(players.player.screenPos.y) + ')', players.player.screenPos.x, players.player.screenPos.y - 10);
//   ctx.fillText('level: (' + Math.floor(players.enemy.levelPos.x) + ',' + Math.floor(players.enemy.levelPos.y) + ')', players.enemy.levelPos.x - players.player.levelPos.x + players.player.screenPos.x, players.enemy.screenPos.y - 30);
//   ctx.fillText('screen: (' + Math.floor(players.enemy.screenPos.x)+ ',' + Math.floor(players.enemy.screenPos.y) + ')', players.enemy.levelPos.x - players.player.levelPos.x + players.player.screenPos.x, players.enemy.screenPos.y - 10);  

//   // Draw player sprite
//   ctx.drawImage( images[2],players.player.sx ,
//    players.player.sy, players.player.swidth, players.player.sheight,
//    players.player.screenPos.x, players.player.screenPos.y, players.player.width, players.player.height);

//   // Draw enemy sprite
//   ctx.drawImage( images[2],players.enemy.sx ,
//    players.enemy.sy, players.enemy.swidth, players.enemy.sheight,
//    players.enemy.levelPos.x - players.player.levelPos.x + players.player.screenPos.x, players.enemy.screenPos.y, players.enemy.width, players.enemy.height);


//   ctx.restore();
// }

// function renderEnemyView(players, ctx) {
//   // Draw the canvas backgrounds
//   if(players.player.direction == 'none' || players.enemy.direction == 'none') {
//     renderBackground(ctx, players.enemy);
//   }
//   //console.log(players.player);
//   //ctx.fillRect(players.player.x, players.player.y, 5, 5);
//   ctx.save();
//   // ctx.translate(-camera_position.x, players.player.y);
//   ctx.fillStyle = 'white';
//   ctx.font="20px Verdana";
//   ctx.fillText('level: (' + Math.floor(players.enemy.levelPos.x) + ',' + Math.floor(players.enemy.levelPos.y) + ')', players.enemy.screenPos.x, players.enemy.screenPos.y - 30);
//   ctx.fillText('screen: (' + Math.floor(players.enemy.screenPos.x)+ ',' + Math.floor(players.enemy.screenPos.y) + ')', players.enemy.screenPos.x, players.enemy.screenPos.y - 10);
//   ctx.fillText('level: (' + Math.floor(players.player.levelPos.x) + ',' + Math.floor(players.player.levelPos.y) + ')', players.player.levelPos.x - players.enemy.levelPos.x + players.enemy.screenPos.x, players.player.screenPos.y - 30);
//   ctx.fillText('screen: (' + Math.floor(players.player.screenPos.x)+ ',' + Math.floor(players.player.screenPos.y) + ')', players.player.levelPos.x - players.enemy.levelPos.x + players.enemy.screenPos.x, players.player.screenPos.y - 10);  

//   // Draw enemy sprite
//   ctx.drawImage( images[2],players.enemy.sx ,
//    players.enemy.sy, players.enemy.swidth, players.enemy.sheight,
//    players.enemy.screenPos.x, players.enemy.screenPos.y, players.enemy.width, players.enemy.height);

//   // Draw player sprite
//   ctx.drawImage( images[2],players.player.sx ,
//    players.player.sy, players.player.swidth, players.player.sheight,
//    players.player.levelPos.x - players.enemy.levelPos.x + players.enemy.screenPos.x, players.player.screenPos.y, players.player.width, players.player.height);

//   ctx.restore();
// }

// TODO: FIX THIS
// var camera = {
//   //position:{x:0, y:0};
//   width : canvas.width;
//   height = canvas.height;
//   xMin = 100;
//   xMax = 500;
//   xOff = 500;
// }
/* Camera variables */
var camera_position = {x:0, y:0};
var camera_width = canvas.width;
var camera_height = canvas.height;
var camera_xMin = 100;
var camera_xMax = 500;
var camera_xOff = 100;

/**
 * @function update
 * Updates the camera based on the supplied target
 * @param {Vector} target what the camera is looking at
 */
var updateCamera = function(target) {
  // // TODO: Align camera with player
  camera_position.x = target.x;
  // //console.log(self.xOff, self.xMax, self.xOff > self.xMax);
  if(camera_xOff > camera_xMax) {
    camera_position.x += camera_xOff - camera_xMax;
    camera_xOff = camera_xMax;
  }
  if(camera_xOff < camera_xMin) {
    camera_position.x -= camera_xMin - camera_xOff;
    camera_xOff = camera_xMin;
  }

  if(camera_position.x < 0) camera_position.x = 0;
  // console.log("Camera: (" + camera_position.x + "," + camera_position.y + ")");
}