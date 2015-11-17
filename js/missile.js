var Bullet = function(x,y,game,name, target){
	Phaser.Sprite.call(this, game, x, y, name);
	this.anchor.setTo(0.5, 0.5);
	this.speed = 300;
    this.angleMax = 0.5;
	this.behavior = 1; // comportement (1 = chercheuse, 2 = boomerang, 3 = ...)
	this.target = target; 
	this.domage = 1;
	this.timeLive = 5000;
	this.time = 0;
	
	this.needDestroy = false;
}

Bullet.prototype = Object.create(Phaser.Sprite.prototype);


Bullet.prototype.actionMissile = function(){
	this.time += this.game.time.elapsed; //Garde le temps que la bullet existe
	//Mouvement
	switch(this.behavior){
		case 1:
			this.homing();
			break;
	}
}

//Missile a tête chercheuse
Bullet.prototype.homing = function(){

	
	if(this.time >= this.timeLive || this.needDestroy){
		this.destroy();
		return;
	}
	
	var angleTarget = this.game.math.angleBetween(
		this.x, this.y, this.target.x, this.target.y
	);
	
	if(this.rotation !== angleTarget){
		var differenceAngle = angleTarget - this.rotation;
		
		if(differenceAngle > Math.PI){
			differenceAngle -= Math.PI * 2;
		}else if(differenceAngle < -Math.PI){
			differenceAngle += Math.PI * 2;
		}
		
		if(Math.abs(differenceAngle) < this.angleMax){
			this.rotation = angleTarget;
		}else if (differenceAngle > 0){
			this.rotation += this.angleMax;
		}else{
			this.rotation -= this.angleMax;
		}
	}
	
	this.body.velocity.x = Math.cos(this.rotation) * this.speed;
	this.body.velocity.y = Math.sin(this.rotation) * this.speed;
	
}


Bullet.prototype.missileAOE = function(){
	//Créer un missile AOE
}
