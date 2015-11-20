Powerups = function(x,y,game, name, isCollidePlayer){
	Phaser.Sprite.call(this, game, x, y, name);
	this.anchor.x = 0.5;
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.gravity.y = 500;
    this.body.collideWorldBounds = true;
	this.scale.setTo(0.35,0.35);
	//Caracteristique
	
	this.collidePlayer = isCollidePlayer;
}


Powerups.prototype = Object.create(Phaser.Sprite.prototype);

Powerups.prototype.action = function(player){
	if(!this.alive){
		this.destroy();
		return;
	}
	
	var velocityX = this.body.velocity.x;
	
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
}