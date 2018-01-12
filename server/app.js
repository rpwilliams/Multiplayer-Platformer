const fs = require('fs');

var html = fs.readFileSync('./client/platformer.html', {encoding: 'utf8'});
var js = fs.readFileSync('./client/platformer.js', {encoding: 'utf8'});
var css = fs.readFileSync('./client/platformer.css', {encoding: 'utf8'});

var players = [];
var games = 0;
const Game = require('./game');
var port = process.env.PORT || 8080;

/**
 * @function handleRequest()
 * Handles http requests, serving the html, css, and js
 * resources of the client.
 * @param {HTTPRequest} request - the request from the client
 * @param {HTTPResponse} response - the response object to send the client
 */
function handleRequest(request, response) {
  switch(request.url) {
    case '/':
    case '/index.html':
    case '/platformer.html':
      response.setHeader('Content-Type', 'text/html');
      response.end(html);
      break;
    case '/platformer.css':
      response.setHeader('Content-Type', 'text/css');
      response.end(css);
      break;
    case '/platformer.js':
      response.setHeader('Content-Type', 'text/js');
      response.end(js);
      break;
    default:
      response.sendStatus(404);
      break;
  }
}

/* The web server that serves our client */
var express = require('express');
var app = express();
app.use(express.static('client/assets'));
app.use(handleRequest);
var server = require('http').createServer(app);

/* The websocket server that provides bi-directional
   communication for our game */
var io = require('socket.io')(server);

/* Handles a player connection */
io.on('connection', function(socket) {
  console.log('a user connected');
  players.push(socket);

  // If we have two players, Launch a game instance
  if(players.length == 2) {
    new Game(io, players, games);
    players = [];
    games++;
  }
});

/* Launch the server */
server.listen(port, function() {
  console.log("Server listening on: http://localhost:%s", port);
})
