"use strict";
 
/* Constants */
var FIRE_SPEED = 7;

/**
 *  
 */
module.exports = exports = EnemyBomb;

function EnemyBomb(position,velocity,levelPos) {
  this.position = {x: position.x, y:position.y}
  
   //this.direction = direction;
   //this.kind = kind;
   this.width = 14*2;
   this.height = 32*2;
   
   this.inGameExplosionWidth = 96*1.5;
   this.inGameExplosionHeight = 96*1.5;
   
   this.explosionImageWidth = 96
   this.explosionImageHeight = 96;
   
   this.animationTimer = 0;
   this.explosionAnimation = 0;
   this.levelPos = {x: levelPos.x, y:levelPos.y}
   
   this.timer = 0;
  //this.angle = 180;

  
  this.state = "falling";
  
  //this.angle = angle;
  
  this.velocity = {x:0,y:12};
  this.angle = Math.atan2(0, velocity.y);
   
}

EnemyBomb.prototype.update = function(elapsedTime)
{
	
	switch(this.state)
	{
		case "falling":
			//this.position.x+=this.velocity.x;
			this.position.y+=this.velocity.y;
		break;
		
		case "exploding":
			this.animationTimer++;
		
			if (this.animationTimer>5)
			{
				this.animationTimer = 0;
				this.explosionAnimation++;
			}
			
			if (this.timer>60 )
				this.state = "finished"
		break;
		
	}
	
	
	 

	this.timer++;
}

EnemyBomb.prototype.render = function(ctx, img) {
    ctx.save();
	//ctx.translate(this.position.x,this.position.y);
	//ctx.rotate(this.angle);// should be just for the bobmb stage
	switch(this.state)
	{
		
		case "falling":
		 //ctx.rotate(-this.angle);//console.log(this.angle);
		 ctx.drawImage( img,0,0 , 14,32 ,0,0,this.width ,this.height );
		break;
		
		//case "exploding":
		// ctx.drawImage( this.img2,this.explosionAnimation*this.explosionImageWidth,0 , this.explosionImageWidth,this.explosionImageHeight ,0,0,this.width ,this.height );
		//break;
		
	}
	ctx.restore();
	
  
}

EnemyBomb.prototype.explode = function() 
{
	this.state = "exploding"
	this.timer = 0;
	
	this.width =  this.inGameExplosionWidth;
    this.height = this.inGameExplosionHeight;
	
	this.position.y-=this.height/4;
	this.position.x -=2*this.width/5;
   
}