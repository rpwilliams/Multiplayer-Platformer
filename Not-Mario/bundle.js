(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports={ "height":768,
 "layers":[
        {
         "data":[3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 2, 2, 2, 2, 2, 2, 3, 3, 2, 4, 4, 1, 4, 2, 2, 2, 3, 3, 2, 2, 2, 2, 4, 4, 4, 2, 3, 3, 2, 2, 2, 2, 2, 2, 1, 2, 3, 3, 3, 1, 3, 2, 2, 2, 4, 4, 3, 3, 2, 2, 3, 2, 3, 2, 2, 4, 4, 3, 2, 2, 3, 2, 3, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
         "height":10,
         "name":"Tile Layer 1",
         "opacity":1,
         "type":"tilelayer",
         "visible":true,
         "width":10,
         "x":0,
         "y":0
        }],
 "orientation":"orthogonal",
 "properties":
    {

    },
 "renderorder":"right-down",
 "tileheight":64,
 "tilesets":[
        {
         "firstgid":1,
         "image":".\/assets\/example.png",
         "imageheight":130,
         "imagewidth":128,
         "margin":0,
         "name":"example",
         "properties":
            {

            },
         "spacing":0,
         "tileheight":64,
         "tileproperties":
            {
             "95":
                {
                 "solid":"true"
                }
            },
         "tilewidth":64
        }],
 "tilewidth":64,
 "version":1,
 "width":1076
}

},{}],2:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
const Game = require('./game');
const Player = require('./player');
var tilemap = require('./tilemap');

/* Global variables */
var canvas = document.getElementById('screen');
var game = new Game(canvas, update, render);

var tilemapData = require('../assets/tilemap.json');
var input = {
  up: false,
  down: false,
  left: false,
  right: false
}
var player = new Player();

 tilemap.load(tilemapData, {
    onload: function() {
      tilemap.render(canvas.getContext('2d'));
      //renderPlayer();
    }
  });



 
/**
 * @function onkeydown
 * Handles keydown events
 */
window.onkeydown = function(event) {
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = true;
	  
	   
	  //player.changeAnimation("moving up");
	   
      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = true;
	   
	  //player.changeAnimation("moving down");
	   
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
      input.left = true;
	   
	  //player.changeAnimation("moving left");
	   
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = true;
	   
	  //player.changeAnimation("moving right");
	  
      event.preventDefault();
      break;
  }
}

/**
 * @function onkeyup
 * Handles keydown events
 */
window.onkeyup = function(event) {
  switch(event.key) {
    case "ArrowUp":
    case "w":
      input.up = false;
	 
	  player.changeAnimation("stand still");

      event.preventDefault();
      break;
    case "ArrowDown":
    case "s":
      input.down = false;
	  player.changeAnimation("stand still");
      event.preventDefault();
      break;
    case "ArrowLeft":
    case "a":
      input.left = false;
	  player.changeAnimation("stand still");
      event.preventDefault();
      break;
    case "ArrowRight":
    case "d":
      input.right = false;
	  player.changeAnimation("stand still");
      event.preventDefault();
      break;
  }
}

/**
 * @function masterLoop
 * Advances the game in sync with the refresh rate of the screen
 * @param {DOMHighResTimeStamp} timestamp the current time
 */
var masterLoop = function(timestamp) {
  game.loop(timestamp);
  window.requestAnimationFrame(masterLoop);
}
masterLoop(performance.now());


function isPassible(x, y) {
    var data = tilemap.tileAt(x, y, 0);
    // if the tile is out-of-bounds for the tilemap, then
    // data will be undefined, a "falsy" value, and the
    // && operator will shortcut to false.
    // Otherwise, it is truthy, so the solid property
    // of the tile will determine the result
    return data && !data.solid
}


/**
 * @function update
 * Updates the game state, moving
 * game objects and handling interactions
 * between them.
 * @param {DOMHighResTimeStamp} elapsedTime indicates
 * the number of milliseconds passed since the last frame.
 */
function update(elapsedTime) {
//console.log(tilemap.tileAt(.position.x, player.position.y, 0));
//console.log(tilemap.tileAt(0, 0, 0));
//console.log(player.position.x, player.position.y, 0);
console.log(tilemap.tileAt(300,300,0));
if(player.falling==true){
	if(isPassible(player.position.x,player.position.y)){
		player.velocity.y=0;
		player.falling=false;
	}
}
   
  
  player.update(elapsedTime,input);
 
   
}

/**
  * @function render
  * Renders the current game state into a back buffer.
  * @param {DOMHighResTimeStamp} elapsedTime indicates
  * the number of milliseconds passed since the last frame.
  * @param {CanvasRenderingContext2D} ctx the context to render to
  */
function render(elapsedTime, ctx) {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, 1024, 786);
  tilemap.render(ctx);
  player.render(elapsedTime, ctx);
  //ctx.drawImage( img,xPlaceInImage+spriteWidth*animationCounter , yPlaceInImage, spriteWidth,spriteHeight, 50, 50, widthInGame,heightInGame);
  ctx.save();
   
  ctx.restore();
 
   
}

},{"../assets/tilemap.json":1,"./game":3,"./player":4,"./tilemap":5}],3:[function(require,module,exports){
"use strict";

/**
 * @module exports the Game class
 */
module.exports = exports = Game;

/**
 * @constructor Game
 * Creates a new game object
 * @param {canvasDOMElement} screen canvas object to draw into
 * @param {function} updateFunction function to update the game
 * @param {function} renderFunction function to render the game
 */
function Game(screen, updateFunction, renderFunction) {
  this.update = updateFunction;
  this.render = renderFunction;

  // Set up buffers
  this.frontBuffer = screen;
  this.frontCtx = screen.getContext('2d');
  this.backBuffer = document.createElement('canvas');
  this.backBuffer.width = screen.width;
  this.backBuffer.height = screen.height;
  this.backCtx = this.backBuffer.getContext('2d');

  // Start the game loop
  this.oldTime = performance.now();
  this.paused = false;
}

/**
 * @function pause
 * Pause or unpause the game
 * @param {bool} pause true to pause, false to start
 */
Game.prototype.pause = function(flag) {
  this.paused = (flag == true);
}

/**
 * @function loop
 * The main game loop.
 * @param{time} the current time as a DOMHighResTimeStamp
 */
Game.prototype.loop = function(newTime) {
  var game = this;
  var elapsedTime = newTime - this.oldTime;
  this.oldTime = newTime;

  if(!this.paused) this.update(elapsedTime);
  this.render(elapsedTime, this.frontCtx);

  // Flip the back buffer
  this.frontCtx.drawImage(this.backBuffer, 0, 0);
}

},{}],4:[function(require,module,exports){
"use strict";

/* Classes and Libraries */
 

/* Constants */
const PLAYER_RUN_VELOCITY = 0.25;
const PLAYER_RUN_SPEED = 5;
const PLAYER_RUN_MAX = 3;
const PLAYER_FALL_VELOCITY = 0.25;
const PLAYER_JUMP_SPEED = 6;
const PLAYER_JUMP_BREAK_VELOCITY= 0.10;

/**
 * @module Player
 * A class representing a player's helicopter
 */
module.exports = exports = Player;

/**
 * @constructor Player
 * Creates a player
 * @param {BulletPool} bullets the bullet pool
 */
function Player( ) {
   
this.animationTimer = 0;
this.animationCounter = 0;
this.frameLength = 9;
//animation dependent
this.numberOfsprites = 0; // how man y frames are there in the animation
this.spriteWidth = 23; // width of each frame
this.spriteHeight = 34; // height of each frame
this.widthInGame = 46;   
this.heightInGame = 68;
this.xPlaceInImage = 0; // this should CHANGE for the same animation 
this.yPlaceInImage = 0; // this should NOT change for the same animation

this.animation = "stand still" // this will keep track of the animation
this.tookAstep = "no"
this.img = new Image()
this.img.src = 'assets/fumiko2.png';


this.position = {x: 50, y: 600};
this.velocity = {x: 0, y: 0};
this.jumping = false;
this.falling=false;
this.crouching = "no"
this.floorYPostion = 600;
this.jumpingTime = 0;
this.facing = "left";

}



/**
 * @function update
 * Updates the player based on the supplied input
 * @param {DOMHighResTimeStamp} elapedTime
 * @param {Input} input object defining input, must have
 * boolean properties: up, left, right, down
 */
Player.prototype.update = function(elapsedTime, input) {
// set the velocity
	//this.velocity.x = 0;
	
	//track movment than change velocity and animation 
	if (this.jumping==false && this.falling==false)
	{
		if(input.left){
		this.velocity.x -= PLAYER_RUN_VELOCITY;
		this.changeAnimation("moving left");
		this.facing = "left";
		}
		else if(input.right){
			this.velocity.x += PLAYER_RUN_VELOCITY;
			this.changeAnimation("moving right");
			this.facing = "right";
		} 
		else if(this.velocity.x>0) {
			this.velocity.x -=PLAYER_RUN_VELOCITY;
		}
		else if(this.velocity.x<0){
			this.velocity.x +=PLAYER_RUN_VELOCITY;
		}
	}
	else{
		this.changeAnimation("moving up");
	}
	
	// set a maximum run speed
	if(this.velocity.x < -PLAYER_RUN_MAX) this.velocity.x=-PLAYER_RUN_MAX;
	if(this.velocity.x > PLAYER_RUN_MAX) this.velocity.x=PLAYER_RUN_MAX;
	
	if(input.up && this.jumping==false && this.falling==false) {
		this.velocity.y -= PLAYER_JUMP_SPEED;
		this.jumping=true;
		
		this.jumpingTime+=elapsedTime;
	}
	else if(this.jumping==true || this.falling==true) {
		this.velocity.y += PLAYER_FALL_VELOCITY;
		if(this.velocity.y>0) {
			this.jumping=false;
			this.falling=true;
		}
			
		if (this.facing=="left")
		{
			
			if(input.right){
				this.velocity.x += PLAYER_JUMP_BREAK_VELOCITY;
			}
			
		}
		
		else if (this.facing=="right")
		{
			
			
			if(input.left){
			this.velocity.x -= PLAYER_JUMP_BREAK_VELOCITY;
			 
			}
		}
		if (this.position.y > this.floorYPostion - 4)
		{
			this.position.y = this.floorYPostion;
			this.velocity.y = 0;
			this.jumping = false;
			this.falling=false;
			this.animation="stand still";
		}
		
	}
	
	
	/*
	else if(input.down && this.jumping==false) this.crouching == true;//this.velocity.y += PLAYER_RUN_SPEED / 2;
	*/


	// move the player
	this.position.x += this.velocity.x;
	this.position.y += this.velocity.y;
	//if(this.velocity.y>0) this.jumping=true;
	if(this.velocity.y<0) {
		//this.jumping=false;
		//this.falling=true;
		//this.velocity.y=0;
	}
	
	//if (!(this.animation=="stand still" && this.tookAstep=="yes"))
  this.animationTimer++;
  if (this.animationTimer>this.frameLength)
  {
	  if(this.animation=="stand still") this.animationCounter=0;
	  else if(this.animation!="moving up"){
		this.animationCounter++;
		
	  }
	  this.animationTimer = 0;
  }
  
  if (this.animationCounter>=this.numberOfsprites){
		if(this.animation!="stand still"){
			this.animationCounter = 3;
		}
		else{
		this.animationCounter = 0;
		}
  }
  if(this.jumping==true) this.xPlaceInImage = this.spriteWidth*7;
	else if(this.falling==true) this.xPlaceInImage = this.spriteWidth*8;
	else this.xPlaceInImage = 0;
  /*
  switch(this.animation)
  {
	  case "moving up":
	  case "moving down":
	  case "moving left":
	  case "moving right":
	  if (this.animationTimer == 0)
		  this.tookAstep = "yes";
	  
	  break;
	  case "stand still":
	  if (this.animationTimer == 0){
		  this.numberOfsprites = 0;
		    this.animationTimer = 0;
			this.animationCounter = 0;
			this.tookAstep = "yes";
	  }
	  
  }
  */
}

/**
 * @function render
 * Renders the player helicopter in world coordinates
 * @param {DOMHighResTimeStamp} elapsedTime
 * @param {CanvasRenderingContext2D} ctx
 */
Player.prototype.render = function(elapasedTime, ctx) {
	console.log(this.animationCounter);
   ctx.drawImage( this.img,this.xPlaceInImage+this.spriteWidth*this.animationCounter , 
   this.yPlaceInImage, this.spriteWidth,this.spriteHeight, 
   this.position.x, this.position.y, this.widthInGame,this.heightInGame);
   //this.xPlaceInImage=0;
}
 
 
Player.prototype.changeAnimation = function(x)
{
	this.animation = x;
	if (this.animation == "stand still")
	{
		//if (animationTimer == 0)
		//{
			this.numberOfsprites = 0;
		    this.animationTimer = 0;
			this.animationCounter = 0;
			this.tookAstep = "yes";
		//}
		
		
	}
	else
	{
		this.numberOfsprites = 7;
		//tookAstep = "no";  
		switch(this.animation)
		{
			case "moving up":
				this.animationCounter=0;
				//this.xPlaceInImage =this.spriteWidth*7;
			
			break;
			
			case "moving down":
			this.yPlaceInImage =this.spriteHeight*0;
			break;
			
			case "moving left":
			
				if(this.jumping==false && this.falling==false)this.yPlaceInImage =this.spriteHeight*1;
			break;
			
			case "moving right":
			this.yPlaceInImage =this.spriteHeight*0;
			break;
		}
		
		
	}
	
	
}
},{}],5:[function(require,module,exports){
//Tilemap.js was retrieved from Nathan H Bean's public github repository at: https://github.com/zombiepaladin/tilemap/blob/master/src/tilemap.js

// Tilemap engine defined using the Module pattern
module.exports = (function (){
  var tiles = [],
      tilesets = [],
      layers = [],
      tileWidth = 0,
      tileHeight = 0,
      mapWidth = 0,
      mapHeight = 0;
      
  var load = function(mapData, options) {
      
    var loading = 0;
    
    // Release old tiles & tilesets
    tiles = [];
    tilesets = [];
    
    // Resize the map
    tileWidth = mapData.tilewidth;
    tileHeight = mapData.tileheight;
    mapWidth = mapData.width;
    mapHeight = mapData.height;
    
    // Load the tileset(s)
    mapData.tilesets.forEach( function(tilesetmapData, index) {
      // Load the tileset image
      var tileset = new Image();
      loading++;
      tileset.onload = function() {
        loading--;
        if(loading == 0 && options.onload) options.onload();
      }
      tileset.src = tilesetmapData.image;
      tilesets.push(tileset);
      
      // Create the tileset's tiles
      var colCount = Math.floor(tilesetmapData.imagewidth / tileWidth),
          rowCount = Math.floor(tilesetmapData.imageheight / tileHeight),
          tileCount = colCount * rowCount;
      
      for(i = 0; i < tileCount; i++) {
        var tile = {
          // Reference to the image, shared amongst all tiles in the tileset
          image: tileset,
          // Source x position.  i % colCount == col number (as we remove full rows)
          sx: (i % colCount) * tileWidth,
          // Source y position. i / colWidth (integer division) == row number 
          sy: Math.floor(i / rowCount) * tileHeight,
          // Indicates a solid tile (i.e. solid property is true).  As properties
          // can be left blank, we need to make sure the property exists. 
          // We'll assume any tiles missing the solid property are *not* solid
          solid: (tilesetmapData.tileproperties[i] && tilesetmapData.tileproperties[i].solid == "true") ? true : false
        }
        tiles.push(tile);
      }
    });
    
    // Parse the layers in the map
    mapData.layers.forEach( function(layerData) {
      
      // Tile layers need to be stored in the engine for later
      // rendering
      if(layerData.type == "tilelayer") {
        // Create a layer object to represent this tile layer
        var layer = {
          name: layerData.name,
          width: layerData.width,
          height: layerData.height,
          visible: layerData.visible
        }
      
        // Set up the layer's data array.  We'll try to optimize
        // by keeping the index data type as small as possible
        if(tiles.length < Math.pow(2,8))
          layer.data = new Uint8Array(layerData.data);
        else if (tiles.length < Math.Pow(2, 16))
          layer.data = new Uint16Array(layerData.data);
        else 
          layer.data = new Uint32Array(layerData.data);
      
        // save the tile layer
        layers.push(layer);
      }
    });
  }

  var render = function(screenCtx) {
    // Render tilemap layers - note this assumes
    // layers are sorted back-to-front so foreground
    // layers obscure background ones.
    // see http://en.wikipedia.org/wiki/Painter%27s_algorithm
    layers.forEach(function(layer){
      
      // Only draw layers that are currently visible
      if(layer.visible) { 
        for(y = 0; y < layer.height; y++) {
          for(x = 0; x < layer.width; x++) {
            var tileId = layer.data[x + layer.width * y];
            
            // tiles with an id of 0 don't exist
            if(tileId != 0) {
              var tile = tiles[tileId - 1];
              if(tile.image) { // Make sure the image has loaded
                screenCtx.drawImage(
                  tile.image,     // The image to draw 
                  tile.sx, tile.sy, tileWidth, tileHeight, // The portion of image to draw
                  x*tileWidth, y*tileHeight, tileWidth, tileHeight // Where to draw the image on-screen
                );
              }
            }
            
          }
        }
      }
      
    });
  }
  
  var tileAt = function(x, y, layer) {
    // sanity check
    if(layer < 0 || x < 0 || y < 0 || layer >= layers.length || x > mapWidth || y > mapHeight) 
      return undefined;  
    return tiles[layers[layer].data[x + y*mapWidth] - 1];
  }
  
  // Expose the module's public API
  return {
    load: load,
    render: render,
    tileAt: tileAt
  }
  
})();

},{}]},{},[2]);
