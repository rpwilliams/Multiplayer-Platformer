"use strict";

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
images[1].src = 'stars.jpg'; // Foreground
images[2].src = 'player.png';  // Player
images[3].src = 'Enemy_Ship.png'; // enemy
images[4].src = 'enemyBomb.png';
images[5].src = 'Explosion.png';

var hidingObjImages = [
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image()
];

hidingObjImages[0].src = 'hiding_objects/DownArrow.png'; // Down arrow above hiding objects
hidingObjImages[1].src = 'hiding_objects/CrossBox.png'; // Brown box
hidingObjImages[2].src = 'hiding_objects/GrayBox.png'; // Gray box
hidingObjImages[3].src = 'hiding_objects/BrownBox.png'; // Brown box
hidingObjImages[4].src = 'hiding_objects/PlainBox.png'; // Plainbox
hidingObjImages[5].src = 'hiding_objects/Cabinet.png'; // Cabinet
hidingObjImages[6].src = 'hiding_objects/Cabinet2.png'; // Cabinet2

var reticule = {
  x: 0,
  y: 0,
  fire:false,
  canvas: canvas,
  type: ""
}

/**
 * @function onmousemove
 * Handles mouse move events
 */
window.onmousemove = function(event) {
	  event.preventDefault();
	  reticule.x = event.offsetX;
	  reticule.y = event.offsetY;
}

/**
 * @function onload
 * Start the game after all files have loaded
 */
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
    init(players, hidingObjects, ctx);
  });

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

  /**
    * @function onkeydown
    * Handle key presses by sending a message to the
    * server with our new direction
    */
  window.onkeydown = function(event) {
    event.preventDefault();
    switch(event.keyCode) {
      // UP
      case 38:
      case 32:
      case 87:
        socket.emit('keyDown', {left:false, down:false, right:false, up:true});
        break;
      // LEFT
      case 37:
      case 65:
        socket.emit('keyDown', {left:true, down:false, right:false, up:false});
        socket.emit('keyUp', {left:true, down:true, right:false, up:true});
        break;
      // RIGHT
      case 39:
      case 68:
        socket.emit('keyDown', {left:false, down:false, right:true, up:false});
        socket.emit('keyUp', {left:false, down:true, right:true, up:true});
        break;
      // DOWN
      case 40:
      case 83:
        socket.emit('keyDown', {left:false, down:true, right:false, up:false});
        break;
    }
  }

  window.onkeyup = function(event) {
    event.preventDefault();
    switch(event.keyCode) {
      // UP
      case 38:
      case 32:
      case 87:
        socket.emit('keyUp', {left:true, down:true, right:true, up:false});
        break;
      // LEFT
      case 37:
      case 65:
        socket.emit('keyUp', {left:false, down:true, right:true, up:true});
        break;
      // RIGHT
      case 39:
      case 68:
        socket.emit('keyUp', {left:true, down:true, right:false, up:true});
        break;
      // DOWN
      case 40:
      case 83:
        socket.emit('keyUp', {left:true, down:false, right:true, up:true});
        break;
    }
  }

  window.onmousedown = function(event) {
  event.preventDefault();
    if(event.button == 0) {
		reticule.x = event.offsetX;
		reticule.y = event.offsetY;
		reticule.fire=true;
		reticule.type="lazer";
		socket.emit('fire',reticule);
		reticule.fire=false;
		
  }
}
canvas.oncontextmenu = function(event) {
  event.preventDefault();
  reticule.x = event.offsetX;
  reticule.y = event.offsetY;
  
  reticule.fire=true;
  reticule.type="bomb";
	socket.emit('fire',reticule);
	reticule.fire=false;
}
}

/**
  * @function init()
  * Initializes the game, with the player at the beginning of the map and
  * the enemy at the end of the map.
  */
function init(players, hidingObjects, ctx)
{
    // Render the normal objects, followed by the player and then the objects that the player is hiding behind
    renderHidingObjects(players, hidingObjects, ctx, false);
    renderPlayers(players, ctx);
    renderHidingObjects(players, hidingObjects, ctx, true);
}

/**
  * @function renderBackground()
  * Renders the background (stars) and the foreground (the space station)
  * @param ctx: the canvas context to be drawn to
  */
function renderBackground(ctx, current) {
  // Render stars
  ctx.save();
  ctx.drawImage(images[1], 0, 0, 2600, 2600/images[1].width*images[1].height);
  ctx.restore();

  // Render background
  ctx.save();
  ctx.drawImage(images[0],
                (images[0].width/((canvas.height/images[0].height)*images[0].width))*(current.levelPos.x - current.screenPos.x),
                0, images[0].width, images[0].height,
                0, 0, (canvas.height/(images[0].height)*images[0].width), canvas.height);
  ctx.restore();
}

/**
  * @function renderPlayer
  * Renders the player, enemy, and win message
  * @param players: the player and enemy
  * @param ctx: the canvas context to be drawn to
  */
function renderPlayers(players, ctx) {

  // Render debug information. TODO: Remove
  ctx.save();
  ctx.fillStyle = 'white';
  ctx.font="20px Verdana";
  ctx.fillText('level: (' + Math.floor(players.current.levelPos.x) + ',' + Math.floor(players.current.levelPos.y) + ')', players.current.screenPos.x, players.current.screenPos.y - 30);
  ctx.fillText('screen: (' + Math.floor(players.current.screenPos.x)+ ',' + Math.floor(players.current.screenPos.y) + ')', players.current.screenPos.x, players.current.screenPos.y - 10);
  ctx.fillText('level: (' + Math.floor(players.other.levelPos.x) + ',' + Math.floor(players.other.levelPos.y) + ')', players.other.levelPos.x - players.current.levelPos.x + players.current.screenPos.x, players.other.screenPos.y - 30);
  ctx.fillText('screen: (' + Math.floor(players.other.screenPos.x)+ ',' + Math.floor(players.other.screenPos.y) + ')', players.other.levelPos.x - players.current.levelPos.x + players.current.screenPos.x, players.other.screenPos.y - 10);  
  ctx.restore();

  // Player perspective
  if(players.current.id=='player') {
    // Render lasers
    for (var i = 0 ; i < players.other.enemyFire.length ; i++)
    {
      ctx.save();
      ctx.translate(players.other.enemyFire[i].position.x+players.current.screenPos.x-players.current.levelPos.x, players.other.enemyFire[i].position.y)
      ctx.fillStyle = "violet";
      ctx.rotate(-players.other.enemyFire[i].angle);
      ctx.fillRect(0,0, players.other.enemyFire[i].width, players.other.enemyFire[i].height*3);
      ctx.restore();
    }

    // Draw current player's sprite
    ctx.drawImage( images[2],players.current.sx,
      players.current.sy, players.current.swidth, players.current.sheight,
      players.current.screenPos.x, players.current.screenPos.y, players.current.width, players.current.height);

    // Draw other player's sprite
    ctx.drawImage( images[3],players.other.sx ,
      players.other.sy, players.other.swidth, players.other.sheight,
      players.other.levelPos.x - players.current.levelPos.x + players.current.screenPos.x, players.other.screenPos.y,
      players.other.width, players.other.height);   
  }


  // Enemy perspective
  else{
    // Render lasers
    for (var i = 0 ; i < players.current.enemyFire.length ; i++){
      ctx.save();
      ctx.translate(players.current.enemyFire[i].position.x+players.current.screenPos.x-players.current.levelPos.x, players.current.enemyFire[i].position.y);
      ctx.fillStyle = "violet";
      ctx.rotate(-players.current.enemyFire[i].angle);
      ctx.fillRect(0,0, players.current.enemyFire[i].width, players.current.enemyFire[i].height*3);
      ctx.restore();
    }
	for (var i = 0 ; i < players.current.enemyBomb.length ; i++)
  {
	  console.log(players.current.enemyBomb[i].state);
	  ctx.save();
	  
	  ctx.translate(players.current.enemyBomb[i].position.x+players.current.screenPos.x-players.current.levelPos.x, players.current.enemyBomb[i].position.y);
		
	  //ctx.rotate(-players.current.enemyBomb[i].angle);
	  if(players.current.enemyBomb[i].state=="falling"){
	  ctx.drawImage(images[4],0,0);
	  }
	  
	  else if(players.current.enemyBomb[i].state!="finished"){
		ctx.drawImage( images[5],players.current.enemyBomb[i].explosionAnimation*players.current.enemyBomb[i].explosionImageWidth,0 , 
		players.current.enemyBomb[i].explosionImageWidth,players.current.enemyBomb[i].explosionImageHeight ,0,0,
		players.current.enemyBomb[i].width ,players.current.enemyBomb[i].height )
	  }
	  
	  ctx.restore();
  }

    // Draw current player's sprite
    ctx.drawImage( images[3],players.current.sx ,
      players.current.sy, players.current.swidth, players.current.sheight,
      players.current.screenPos.x, players.current.screenPos.y, players.current.width, players.current.height);

    // Draw other player's sprite
    ctx.drawImage( images[2],players.other.sx ,
      players.other.sy, players.other.swidth, players.other.sheight,
      players.other.levelPos.x - players.current.levelPos.x + players.current.screenPos.x,
      players.other.screenPos.y, players.other.width, players.other.height);

    // Draw enemy's reticle
    ctx.save();
    ctx.translate(reticule.x, reticule.y);
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, 2*Math.PI);
    ctx.moveTo(0, 15);
    ctx.lineTo(0, -15);
    ctx.moveTo(15, 0);
    ctx.lineTo(-15, 0);
    ctx.strokeStyle = '#00ff00';
    ctx.stroke();
    ctx.restore();
	
	//Draw hintbox if necessary
	if (players.current.hintboxAlpha > 0.1)
	{	
		ctx.save();			
		var grd;
		if(players.current.leftOfPlayer == false)
		{
			grd = ctx.createLinearGradient(0, 0, 90, 0);
		    grd.addColorStop(0, 'rgba(255, 0, 0, '+ players.current.hintboxAlpha + ')');
		    grd.addColorStop(1, 'rgba(255, 0, 0, 0)');
		    ctx.fillStyle = grd;
			ctx.fillRect((players.current.screenPos.x -565), (players.current.screenPos.y - 100),160,1000);
		}
		else
		{
			grd = ctx.createLinearGradient(934, 0, 1024, 0);
			grd.addColorStop(0, 'rgba(255, 0, 0, 0)');
		    grd.addColorStop(1, 'rgba(255, 0, 0, '+ players.current.hintboxAlpha + ')');
		    ctx.fillStyle = grd;
			ctx.fillRect((players.current.screenPos.x +430), (players.current.screenPos.y - 100),160,1000);
		}
		ctx.restore();
	}
  }

  // Indicate if player 1 won the game by reaching the end
  if(players.current.wonGame)
  {
    console.log("Player 1 won!");
    ctx.fillStyle = 'white';
    ctx.font="40px Verdana";
    ctx.fontWeight = 'bolder';
    // Get the center of the screen
    var midpoint = rectangleMidpoint(0, 0, canvas.width, canvas.height);
    var X_OFFSET_1 = 100;
    var X_OFFSET_2 = 115;
    var Y_OFFSET = 50;
    // Subtract the midpoint by half of the number of letters of the message
    // so that the text appears in the center of the midpoint.
    ctx.fillText('Player 1 wins!', midpoint.x - X_OFFSET_1, midpoint.y);
    ctx.font="20px Verdana";
    ctx.fillText('Press space to play again', midpoint.x - X_OFFSET_2, midpoint.y + Y_OFFSET);
  }
  else if(players.other.wonGame)
  {
    // TO DO: Check if enemy killed player and won the game
  }
  ctx.restore();
}

/**
  * @function renderHidingObjects
  * Renders the objects that can be hidden behind (indicated by an arrow)
  * @param players: the player and the enemy
  * @param hidingObjects: The objects being used to hide behind (NOTE: need confirmation on this)
  * @param ctx: the canvas context
  * @param renderDelayedObjs: Objects not being used to hide behind
  */
function renderHidingObjects (players, hidingObjects, ctx, renderDelayedObjs)
{
  // Draw the canvas backgrounds
  if(((!players.current.direction.left && !players.current.direction.down && !players.current.direction.right && !players.current.direction.up) ||
        (!players.other.direction.left && !players.other.direction.down && !players.other.direction.right && !players.other.direction.up)) && renderDelayedObjs == false) {
    renderBackground(ctx, players.current);
  }
	
  // Draw hiding objects
  ctx.save(); 
  for(var i = 0; i < hidingObjects.length; i++)
  {
	  // Render objects not being used to hide behind
	  if(renderDelayedObjs == false)
	  {
		  if(hidingObjects.objects[i].delayRender == false && hidingObjects.objects[i].render)
		  {
        ctx.drawImage(hidingObjImages[hidingObjects.objects[i].type],  hidingObjects.objects[i].position.x + (players.current.screenPos.x - players.current.levelPos.x), 
          hidingObjects.objects[i].position.y, hidingObjImages[hidingObjects.objects[i].type].width * 2, hidingObjImages[hidingObjects.objects[i].type].height * 2); 
		  }
	  }
	  // Now render those being hid behind
	  else
	  {
		  if(hidingObjects.objects[i].delayRender == true && hidingObjects.objects[i].render)
		  {
        ctx.drawImage(hidingObjImages[hidingObjects.objects[i].type],  hidingObjects.objects[i].position.x + (players.current.screenPos.x - players.current.levelPos.x), 
          hidingObjects.objects[i].position.y, hidingObjImages[hidingObjects.objects[i].type ].width * 2, hidingObjImages[hidingObjects.objects[i].type].height * 2); 
		  }
	  }
	  
    // Display animated down arrow if on top of a object that can be hid behind
    if(hidingObjects.objects[i].displayArrow == true  && hidingObjects.objects[i].render){
      ctx.drawImage(hidingObjImages[0],hidingObjects.arrowFrame * 130, 0, 128, 175,  hidingObjects.objects[i].position.x + (players.current.screenPos.x - players.current.levelPos.x) + 16, hidingObjects.objects[i].position.y - 95, 30, 45);
    }
  }
  ctx.restore();
}

/*
 * @function midpoint()
 * Calculates the midpoint of a rectangle
 * Used to get the center of the screen
 */
function rectangleMidpoint(x1, y1, x2, y2)
{
  var midpoint = { x: 0, y: 0};
  midpoint.x = (x1 + x2)/2;
  midpoint.y = (y1 + y2)/2;
  return midpoint;
}