const WIDTH = 1024;
const HEIGHT = 786;

// Start the game after all files have loaded
window.onload = function() {
  // Global variables
  var canvas = document.getElementById('screen');
  var message = document.getElementById('message');
  var ctx = canvas.getContext('2d');
  var socket = io();
  var colors = [];
  colors[0] = 'red';
  colors[1] = 'blue';

  ctx.fillStyle = 'gray';
  ctx.fillRect(0, 0, WIDTH, HEIGHT);


  // Handle movement updates from the server
  socket.on('move', function(move){
    // Fill the canvas with gray background
    if(move.player_direction == 'none' || move.enemy_direction == 'none') {
      ctx.fillStyle = 'gray';
      ctx.fillRect(0, 0, WIDTH, HEIGHT);
    }

    ctx.fillStyle = colors[0];
    ctx.fillRect(move.player_x, move.player_y, 5, 5);

    ctx.fillStyle = colors[1];
    ctx.fillRect(move.enemy_x, move.enemy_y, 5, 5);
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

  // Handle key presses by sending a message to the
  // server with our new direction
  window.onkeydown = function(event) {
    event.preventDefault();
    switch(event.keyCode) {
      // UP
      case 38:
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
      case 37:
      case 65:
      case 39:
      case 68:
      case 40:
      case 83:
        socket.emit('steer', 'stop');
        break;
    }
  }
}
