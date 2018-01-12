"use strict";

/* Global variables */
var canvas = document.getElementById('screen');
var powerUpTimerDiv = document.getElementById('powerUpTimerDiv');
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
//var camera = new Camera(canvas);

// Audio files

// Flags to ensure instructions only appear once
var playerFlag = true;
var enemyFlag = true;
var playerWinner = 0;

var numBombs = 3;

// Flags to ensure hit sounds play only once
var playedNine = false;
var playedEight = false;
var playedSeven = false;
var playedSix = false;
var playedFive = false;
var playedFour = false;
var playedThree = false;
var playedTwo = false;
var playedOne = false;
var playedZero = false;

var images = [
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
  new Image(),
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

var powerUpImages = [
	new Image(),
	new Image(),
	new Image(),
	new Image
];

powerUpImages[0].src = 'power_ups/30secondbox.png'; //30 second box powerup
powerUpImages[1].src = 'power_ups/radar.png';  // radar powerup
powerUpImages[2].src = 'power_ups/arrowRight.png';  // Arrow right
powerUpImages[3].src = 'power_ups/arrowLeft.png';  // Arrow left

// var music = new Audio('sounds/StarCommander1.wav');
// music.setAttribute('autoplay', 'autoplay');
// music.addEventListener('ended', function() {
//     this.currentTime = 0;
//     this.play();
// }, false);
// dont know who made this but got it here http://www.dl-sounds.com/royalty-free/star-commander1/

var sounds = [
  new Audio(),
  new Audio(),
  new Audio(),
  new Audio(),
  new Audio(),
  new Audio(),
  new Audio(),
  new Audio(),
  new Audio()
];

sounds[0].src = 'sounds/Laser.wav';
sounds[1].src = 'sounds/jump.wav';
sounds[2].src = 'sounds/radar.mp3';
sounds[3].src = 'sounds/player_hit.wav';
sounds[3].loop = false;
sounds[4].src = 'sounds/hiding.wav';
sounds[5].src = 'sounds/bomb-drop.wav';
sounds[6].src = 'sounds/explosion.wav';
sounds[7].src = 'sounds/rocket-launch.wav';
sounds[7].loop = false;
/*
  The rocketship at the end of the level, which is used
  as a hiding object but is not actually a hiding object.
*/
hidingObjImages[7].src = 'rocket.png'; // Cabinet2
var ROCKET_SHIP_WIDTH = 64;
var ROCKET_SHIP_HEIGHT = 72 + (72 * .5);
hidingObjImages[7].width = ROCKET_SHIP_WIDTH;
hidingObjImages[7].height = ROCKET_SHIP_HEIGHT;

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
  var refreshMessage = document.getElementById('refreshMessage');
  var ctx = canvas.getContext('2d');
  var socket = io();

  // Handle movement updates from the server
  socket.on('render', function(players, hidingObjects, powerUpArray){
    renderHidingObjects(players, hidingObjects, ctx, false);
    renderPlayers(players, ctx, powerUpArray);
    renderPowerUps(players, powerUpArray, ctx);
    playSound(players);
    renderHidingObjects(players, hidingObjects, ctx, true);
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
    message.style.color = 'white';
    message.style.fontFamily = 'Verdana'
    message.style.fontSize = '40px'
    message.innerHTML = 'You win!';
    refreshMessage.innerHTML = 'Press refresh to play again';
    message.style.display = 'block';
    refreshMessage.style.display = 'block';
  });

  // Handle loss
  socket.on('defeat', function() {
    message.style.color = 'white';
    message.style.fontFamily = 'Verdana'
    message.style.fontSize = '40px'
    message.innerHTML = 'You lose!';
    refreshMessage.innerHTML = 'Press refresh to play again';
    message.style.display = 'block';
    refreshMessage.style.display = 'block';
  });
  socket.on('lift off', function() {
    sounds[7].play();
    hidingObjImages[7].src = 'rocket_on.png';
    hidingObjImages[7].width = ROCKET_SHIP_WIDTH;
    hidingObjImages[7].height = ROCKET_SHIP_HEIGHT + (ROCKET_SHIP_HEIGHT/2);
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
	  // CTRL
	case 17:
		socket.emit('ctrlKey', {isDown: true});
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
	  // CTRL
	  case 17:
		socket.emit('ctrlKey', {isDown: false});
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
      if(numBombs <= 0)
      {
        return;
      }
      numBombs--;
      reticule.x = event.offsetX;
      reticule.y = event.offsetY;
      reticule.fire=true;
      reticule.type="bomb";
    	socket.emit('fire',reticule);
    	reticule.fire=false;
    }
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
                (current.levelPos.x - current.screenPos.x),
                0, canvas.width, canvas.height,
                0, 0, canvas.width, canvas.height);
  ctx.restore();
}


/**
  * @function renderPlayer
  * Renders the player, enemy, and win message
  * @param players: the player and enemy
  * @param ctx: the canvas context to be drawn to
  */
function renderPlayers(players, ctx, powerUpArray) {
  // Render debug information. TODO: Remove
  // ctx.save();
  // ctx.fillStyle = 'white';
  // ctx.font="20px Verdana";
  // ctx.fillText('level: (' + Math.floor(players.current.levelPos.x) + ',' + Math.floor(players.current.levelPos.y) + ')', players.current.screenPos.x, players.current.screenPos.y - 30);
  // ctx.fillText('screen: (' + Math.floor(players.current.screenPos.x)+ ',' + Math.floor(players.current.screenPos.y) + ')', players.current.screenPos.x, players.current.screenPos.y - 10);
  // ctx.fillText('level: (' + Math.floor(players.other.levelPos.x) + ',' + Math.floor(players.other.levelPos.y) + ')', players.other.levelPos.x - players.current.levelPos.x + players.current.screenPos.x, players.other.screenPos.y - 30);
  // ctx.fillText('screen: (' + Math.floor(players.other.screenPos.x)+ ',' + Math.floor(players.other.screenPos.y) + ')', players.other.levelPos.x - players.current.levelPos.x + players.current.screenPos.x, players.other.screenPos.y - 10);
  // ctx.restore();

  // Player perspective
  if(players.current.id=='player') {
    // Display the instructions
    if(playerFlag)
    {
      var playerModal = document.getElementById('playerModal');
      playerModal.style.display = "block";
      playerFlag = false;
    }
	//Render where enemy is
	var enemyDistance = Math.floor((players.other.levelPos.x - players.current.levelPos.x)/100);
	ctx.font="25px Verdana";
	if(enemyDistance > 0)
	{
		ctx.fillText(enemyDistance + 'm', canvas.width - 90, canvas.height/2);
		ctx.drawImage(powerUpImages[2], canvas.width - 35, canvas.height/2 - 5, 30, 45);
	}
	else
	{
		ctx.fillText(Math.abs(enemyDistance) + 'm', 40, canvas.height/2);
		ctx.drawImage(powerUpImages[3], 5, canvas.height/2 - 5, 30, 45);
	}

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
    for (var i = 0 ; i < players.other.enemyBomb.length ; i++)
    {
      ctx.save();

  	  ctx.translate(players.other.enemyBomb[i].position.x+players.current.screenPos.x-players.current.levelPos.x, players.other.enemyBomb[i].position.y);

  	  if(players.other.enemyBomb[i].state=="falling"){
  	  ctx.drawImage(images[4],0,0, 14,32 ,0,0,players.other.enemyBomb[i].width ,players.other.enemyBomb[i].height);
  	  }
  	  else if(players.other.enemyBomb[i].state!="finished"){
  		ctx.drawImage( images[5],players.other.enemyBomb[i].explosionAnimation*players.other.enemyBomb[i].explosionImageWidth,0 ,
  		players.other.enemyBomb[i].explosionImageWidth,players.other.enemyBomb[i].explosionImageHeight ,0,0,
  		players.other.enemyBomb[i].width ,players.other.enemyBomb[i].height )
  	  }
  	  ctx.restore();
    }

    // Draw current player's sprite. Also check if player is using the 30 second box powerup
	var playerDrawn = false;
	for(var i = 0; i < powerUpArray.length; i++)
	{
		if(powerUpArray.powerUps[i].type == 0 && powerUpArray.powerUps[i].active && !players.current.wonGame)
		{
		  // Draw the player as a box instead if they are using the 30 second box powerup
		  ctx.drawImage(hidingObjImages[3], players.current.screenPos.x,
          players.current.screenPos.y - 13, hidingObjImages[3].width * 1.9, hidingObjImages[3].height * 1.9); // todo: magic numbers
		  playerDrawn = true;
		}
	}

	if(playerDrawn == false && !players.current.wonGame && players.current.health > 0)
	{
    ctx.save();
    if(players.current.invisible){
      ctx.globalAlpha = 0.5;
    }
	  ctx.drawImage( images[2],players.current.sx,
      players.current.sy, players.current.swidth, players.current.sheight,
      players.current.screenPos.x, players.current.screenPos.y, players.current.width, players.current.height);
      ctx.restore();
	}

    // Draw other player's sprite
    ctx.drawImage( images[3],players.other.sx ,
      players.other.sy, players.other.swidth, players.other.sheight,
      players.other.levelPos.x - players.current.levelPos.x + players.current.screenPos.x, players.other.screenPos.y,
      players.other.width, players.other.height);

    // Check if the player got hit
    if(players.current.health == 9 && !playedNine)
    {
      sounds[3].play();
      playedFour = true;
    }
    else if(players.current.health == 8 && !playedEight)
    {
      sounds[3].play();
      playedThree = true;
    }
    else if(players.current.health == 7 && !playedSeven)
    {
      sounds[3].play();
      playedTwo = true;
    }
    else if(players.current.health == 6 && !playedSix)
    {
      sounds[3].play();
      playedOne = true;
    }
    else if(players.current.health == 5 && !playedFive)
    {
      sounds[3].play();
      playedZero = true;
    }
    else if(players.current.health == 4 && !playedFour)
    {
      sounds[3].play();
      playedFour = true;
    }
    else if(players.current.health == 3 && !playedThree)
    {
      sounds[3].play();
      playedThree = true;
    }
    else if(players.current.health == 2 && !playedTwo)
    {
      sounds[3].play();
      playedTwo = true;
    }
    else if(players.current.health == 1 && !playedOne)
    {
      sounds[3].play();
      playedOne = true;
    }
    else if(players.current.health == 0 && !playedZero)
    {
      sounds[3].play();
      playedZero = true;
    }

    // Player HUD
    ctx.fillStyle = "rgb(250,250, 250)";
    ctx.font = "20px Verdana";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("HEALTH: " + players.current.health + "/10", 32, 32);
  }
  // Enemy perspective
  else{
    // Display the instructions
    if(enemyFlag)
    {
      var enemyModal = document.getElementById('enemyModal');
      enemyModal.style.display = "block";
      enemyFlag = false;
    }
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
  	  ctx.save();

  	  ctx.translate(players.current.enemyBomb[i].position.x+players.current.screenPos.x-players.current.levelPos.x, players.current.enemyBomb[i].position.y);

  	  //ctx.rotate(-players.current.enemyBomb[i].angle);
  	  if(players.current.enemyBomb[i].state=="falling"){
  	  ctx.drawImage(images[4],0,0,14,32 ,0,0,players.current.enemyBomb[i].width ,players.current.enemyBomb[i].height);
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
	var playerDrawn = false;
	for(var i = 0; i < powerUpArray.length; i++)
	{
		if(powerUpArray.powerUps[i].type == 0 && powerUpArray.powerUps[i].active && !players.other.wonGame)
		{
		  // Draw the player as a box instead if they are using the 30 second box powerup
		  ctx.drawImage(hidingObjImages[3], players.other.levelPos.x - players.current.levelPos.x + players.current.screenPos.x,
          players.other.screenPos.y - 13, hidingObjImages[3].width * 1.9, hidingObjImages[3].height * 1.9); // todo: magic numbers
		  playerDrawn = true;
		}
	}
	if(playerDrawn == false && !players.other.wonGame && players.other.health > 0 && !players.other.invisible)
	{
      ctx.drawImage( images[2],players.other.sx ,
      players.other.sy, players.other.swidth, players.other.sheight,
      players.other.levelPos.x - players.current.levelPos.x + players.current.screenPos.x,
      players.other.screenPos.y, players.other.width, players.other.height);
	}

    // Draw enemy's reticle
    if(!players.other.wonGame && players.other.health > 0){
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
    }

  	//Draw hintbox if necessary
  	if (players.current.hintboxAlpha > 0.1)
  	{
                sounds[2].play();
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
    // Enemy HUD
    ctx.fillStyle = "rgb(250,250, 250)";
    ctx.font = "20px Verdana";
    ctx.textAlign = "left";
    ctx.textBaseline = "bottom";
    ctx.fillText("BOMBS: " + numBombs, 32, 32);
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
          hidingObjects.objects[i].position.y, hidingObjImages[hidingObjects.objects[i].type].width * 1.9, hidingObjImages[hidingObjects.objects[i].type].height * 1.9);
		  }
	  }
	  // Now render those being hid behind
	  else
	  {
		  if(hidingObjects.objects[i].delayRender == true && hidingObjects.objects[i].render)
		  {
        ctx.drawImage(hidingObjImages[hidingObjects.objects[i].type],  hidingObjects.objects[i].position.x + (players.current.screenPos.x - players.current.levelPos.x),
          hidingObjects.objects[i].position.y, hidingObjImages[hidingObjects.objects[i].type ].width * 1.9, hidingObjImages[hidingObjects.objects[i].type].height * 1.9);
		  }
	  }

    // Display animated down arrow if on top of a object that can be hid behind
    if(hidingObjects.objects[i].displayArrow == true  && hidingObjects.objects[i].render){
      ctx.drawImage(hidingObjImages[0],hidingObjects.arrowFrame * 130, 0, 128, 175,  hidingObjects.objects[i].position.x + (players.current.screenPos.x - players.current.levelPos.x) + 16, hidingObjects.objects[i].position.y - 95, 30, 45);
    }
  }
  ctx.restore();
}

function renderPowerUps(players, powerUpArray, ctx)
{
	ctx.save();
	for(var i = 0; i < powerUpArray.length; i++)
	{
		if(powerUpArray.powerUps[i].render)
		{
			ctx.drawImage(powerUpImages[powerUpArray.powerUps[i].type], powerUpArray.powerUps[i].position.x + (players.current.screenPos.x - players.current.levelPos.x),
			powerUpArray.powerUps[i].position.y + powerUpArray.yOffset, powerUpImages[powerUpArray.powerUps[i].type].width * .85, powerUpImages[powerUpArray.powerUps[i].type].height * .85);
		}

		if(players.current.id == 'player')
		{
			// Display distance between player and enemy if radar is active
			if(powerUpArray.powerUps[i].active && powerUpArray.powerUps[i].type == 1)
			{
				var enemyDistance = Math.floor((players.other.levelPos.x - players.current.levelPos.x)/100);
				ctx.font="25px Verdana";
				if(enemyDistance > 0)
				{
					ctx.fillText(enemyDistance + 'm', canvas.width - 90, canvas.height/2);
					ctx.drawImage(powerUpImages[2], canvas.width - 35, canvas.height/2 - 5, 30, 45);
				}
				else
				{
					ctx.fillText(Math.abs(enemyDistance) + 'm', 40, canvas.height/2);
					ctx.drawImage(powerUpImages[3], 5, canvas.height/2 - 5, 30, 45);
				}
			}

			// Display in HUD if picked up
			if(powerUpArray.powerUps[i].pickedUp)
			{
				if(powerUpArray.powerUps[i].type == 1)
				{
					ctx.drawImage(powerUpImages[powerUpArray.powerUps[i].type], 32,
					35 + (27 * powerUpArray.powerUpsBeingHeld), powerUpImages[powerUpArray.powerUps[i].type].width * .65,
					powerUpImages[powerUpArray.powerUps[i].type].height * .65);
				}
				else
				{
					ctx.drawImage(powerUpImages[powerUpArray.powerUps[i].type], 34,
					60, powerUpImages[powerUpArray.powerUps[i].type].width * .75, powerUpImages[powerUpArray.powerUps[i].type].height * .75);
				}
			}

			// HUD timer
			if(powerUpArray.powerUps[i].active)
			{
				ctx.font="18px Verdana";
				ctx.fillText(Math.floor(powerUpArray.powerUps[i].duration / 1000), 70, 60);
			}
		}
	}
	ctx.restore();
}

function playSound(players) {
  // console.log(players.current.sound)
  if (players.current.sound != null) {
    sounds[players.current.sound].pause();
    sounds[players.current.sound].currentTime = 0;
    sounds[players.current.sound].play();
  }
}
