Powerups = function(x,y,game, name, isCollidePlayer,number){
	Phaser.Sprite.call(this, game, x, y, name);
	this.anchor.x = 0.5;
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.gravity.y = 500;
    this.body.collideWorldBounds = true;
	this.scale.setTo(0.35,0.35);
	//Caracteristique
	this.collidePlayer = isCollidePlayer;
	
	this.number = number;
}


Powerups.prototype = Object.create(Phaser.Sprite.prototype);

Powerups.prototype.action = function(player){
	if(!this.alive){
		this.destroy();
		return;
	}
	
	var velocityX = this.body.velocity.x;
	
	//Ralentissement droite
	if(velocityX > 0){	
		if(this.body.touching.down){
			var ralentissement = 10;
			if(velocityX <= 10){
				ralentissement = velocityX;
				this.collidePlayer = true;
			}
			this.body.velocity.x -= ralentissement;
		}
		
	}
	
	//Ralentissement gauche
	if(velocityX < 0){	
		if(this.body.touching.down){
			var ralentissement = -10;
			if(velocityX >= -10){
				ralentissement = velocityX;
				this.collidePlayer = true;
			}
			this.body.velocity.x -= ralentissement;
		}
		
	}
	
	//S'il va hors de l'écran, on l'empèche
	if(this.x > (this.game.world.width-50) || this.x < 50){
		this.body.velocity.x = 0;
		this.collidePlayer = true;
	}
}