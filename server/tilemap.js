//Tilemap.js was retrieved from Nathan H Bean's public github repository at: https://github.com/zombiepaladin/tilemap/blob/master/src/tilemap.js

// Tilemap engine defined using the Module pattern
module.exports = exports = (function (){
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
      // Create the tileset's tiles
      var colCount = Math.floor(tilesetmapData.imagewidth / 32),
          rowCount = Math.floor(tilesetmapData.imageheight / 32),
          tileCount = colCount * rowCount;

      console.log(tileCount);

      for(i = 0; i < tileCount; i++) {
        var tile = {
          // Reference to the image, shared amongst all tiles in the tileset
          image: null,
          // Source x position.  i % colCount == col number (as we remove full rows)
          sx: (i % colCount) * 32,
          // Source y position. i / colWidth (integer division) == row number
          sy: Math.floor(i / rowCount) * 32,
          // Indicates a solid tile (i.e. solid property is true).  As properties
          // can be left blank, we need to make sure the property exists.
          // We'll assume any tiles missing the solid property are *not* solid
          Solid: (tilesetmapData.tileproperties[i] && tilesetmapData.tileproperties[i].Solid == true) ? true : false
        }
          if(tilesetmapData.tileproperties[i]){
            console.log(tilesetmapData.tileproperties[i].Solid);
            if(tilesetmapData.tileproperties[i].Solid){
              console.log(tile);
              console.log(i);
            }
          }
          else{
            console.log('missing tile');
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
        else if (tiles.length < Math.pow(2, 16))
          layer.data = new Uint16Array(layerData.data);
        else
          layer.data = new Uint32Array(layerData.data);

        // save the tile layer
        layers.push(layer);
      }
    });
  }

  var tileAt = function(x, y, layer) {
    console.log("x: ", x, "y: ", y);
    // sanity check
    if(layer < 0 || x < 0 || y < 0 || layer >= layers.length || x > 11229 || y > 768)
      return undefined;
    var tilemapX = Math.floor(x / tileWidth);
    var tilemapY = Math.floor(y / tileHeight);
    // console.log("Tile x: ", tilemapX);
    // console.log("Tile y: ", tilemapY);
    // console.log(tiles)
    // for(var i = 0; i < tiles.length; i++){
    //   if(tiles[i].Solid){
    //     console.log("Tile: ", tiles[i]);
    //     console.log("i: ", i);
    //   }
    // }
    // console.log(tiles[layers[layer].data[tilemapX + (tilemapY * layers[layer].width)]])
    // if(!(tiles[layers[layer].data[tilemapX + (tilemapY * layers[layer].width)] - 1])){
    //   console.log(layers[layer].data[tilemapX + (tilemapY * layers[layer].width)] - 1);
    // }
    return tiles[layers[layer].data[tilemapX + (tilemapY * layers[layer].width)] - 1];
  }

  // Expose the module's public API
  var return_val = {
    load: load,
    tileAt: tileAt
  }
  return return_val;

})();
