module.exports = exports = EntityManager;

var resourcesToLoad = 0;
var images = {};
var sounds = {};
var callback;

function EntityManager() {};

EntityManager.imagesToLoad = [{filename:"death_scythe.png"}];
EntityManager.soundsToLoad = [];

EntityManager.images = function(filename) {
  return images[filename];
}

EntityManager.sounds = function(filename) {
  return sounds[filename];
}

EntityManager.onLoad = function() {
  resourcesToLoad--;
  if (resourcesToLoad == 0) callback(performance.now());
}

EntityManager.loadAssets = function(callbackFunc) {
  var self = this;
  callback = callbackFunc;	
  resourcesToLoad = EntityManager.imagesToLoad.length + EntityManager.soundsToLoad.length;
  EntityManager.imagesToLoad.forEach(function(i) { self.addImage(i.filename, i.width, i.height) });
  EntityManager.soundsToLoad.forEach(function(s) { self.addSound(s.filename) });
}

EntityManager.addImage = function(filename, width, height) {
  if(images[filename]) return this.images[filename];
  if (width && height) {
    images[filename] = new Image(width, height);
  } else {
    images[filename] = new Image();
  }
  images[filename].onload = this.onLoad();
  images[filename].src = './assets/'+filename;
}

EntityManager.addSound = function(filename) {
  if(sounds[filename]) return sounds[filename];
  sounds[filename] = new Audio('./assets/'+filename);
  sounds[filename].onload = this.onLoad();
}
