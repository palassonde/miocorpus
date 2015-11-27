Player = function (x, y, game) {

	// Constantes
	MAX_SPEED = 300;

	// Player attributes
	this.maxspeed = MAX_SPEED;
	this.friction = 20;
	this.numberStoneBlue = 0;
	this.numberStoneRed = 0;
	this.numberStoneGreen = 0;
	this.health = 3;
	this.shotTime = 0;
	this.isRight = true;
	this.timerDomage = 0;//Evite de recevoir trop de coup
	this.domage = 1;
	this.def = 1;

	// Create the sprite
	Phaser.Sprite.call(this, game, x, y, "player")
	this.game.physics.enable(this, Phaser.Physics.ARCADE);

	this.body.gravity.y = 600;
	this.body.collideWorldBounds = true;
	this.body.checkCollision.up = false;

	this.animations.add('idleRight', [0,1,2], 5, true);
	this.animations.add('idleLeft', [9,10,11], 5, true);
	this.animations.add('right', [3,4,5], 5, true);
	this.animations.add('left', [6,7,8], 5, true);
	this.anchor.set(0.5);
	this.playerFacing = 'right';
	this.animations.play('idleRight')

	// Controls
	this.actionKey_shift = this.game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);
	this.actionKey_T = this.game.input.keyboard.addKey(Phaser.Keyboard.T);
	this.actionKey_T.onDown.add(this.creationTurret, this);
	
	this.actionKey_Q = this.game.input.keyboard.addKey(Phaser.Keyboard.Q);
	
	this.actionKey_W = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
	
	
	this.actionKey_E = this.game.input.keyboard.addKey(Phaser.Keyboard.E);
	this.cursors = this.game.input.keyboard.createCursorKeys();	
	
	//Pistolet
	this.actionKey_A = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
	
	
	//Turrets
	this.maxTurrets = 5;
	this.nbrTurrets = 0;

	this.turrets = this.game.add.group();
    this.turrets.enableBody = true;
    this.turrets.physicsBodyType = Phaser.Physics.ARCADE;
	this.game.world.bringToTop(this.turrets);
	
	//misille
	this.bullets = this.game.add.group();
    this.bullets.enableBody = true;

}

Player.prototype = Object.create(Phaser.Sprite.prototype);

Player.prototype.action = function(platforms, enemy, powerups){

	this.body.acceleration.y = 0;

	for (var x in this.bullets.children){
		this.bullets.children[x].actionMissile();
	}
	
	// Collisions du player
	this.game.physics.arcade.collide(this, platforms);
	//powerups
	this.game.physics.arcade.overlap(player, powerups, this.collisionPlayerPowerUp, null, this);
	this.game.physics.arcade.overlap(this.turrets, powerups, this.upGradeTurret, null, this);
	//ennemie
	this.game.physics.arcade.overlap(player, enemy, this.hurtPlayer, null, this);
	this.game.physics.arcade.overlap(this.turrets, enemy, this.hurtTurret, null, this);
	this.game.physics.arcade.overlap(this.bullets, enemy, this.hurtEnnemie, null, this);

	if(!this.actionKey_A.isDown){
		this.move();
	}

	this.manageSpeed();
	
	this.launchResource(powerups);
	this.fire();
	
	for (var x in this.turrets.children){
		this.turrets.children[x].actionTurret(enemy, powerups, this);
	}

	if(this.game.time.now > player.timerDomage){
		this.tint = 0xFFFFFF;
	}
	
}

Player.prototype.fire = function(powerups){
	
	if(this.game.time.now > this.shotTime && this.actionKey_A.isDown){
		this.shotTime = this.game.time.now + 400;
		this.bullets.add(new Bullet(this.x, this.y,this.game,null,null, 0, this.domage, 500, null, this.cursors));
		
	}
}

Player.prototype.launchResource = function(powerups){
	
	if(this.game.time.now > this.shotTime){
		
		if(this.x > (this.game.world.width - 100) || this.x < 150)return;
		
		var nature = null;
		if(this.actionKey_Q.isDown && this.numberStoneRed > 0){
			nature = 'redstone';
			this.numberStoneRed--;
		}else if (this.actionKey_W.isDown && this.numberStoneBlue > 0){
			nature = 'bluestone';
			this.numberStoneBlue--;
		}else if (this.actionKey_E.isDown && this.numberStoneGreen > 0){
			nature = 'greenstone';
			this.numberStoneGreen--;
		}
		
		if(nature == null) return;
		this.shotTime = this.game.time.now + 400;
		
		var velocite = 0;
			
		if(this.isRight){
			velocite = 200;
		}else{
			velocite = -200;
		}
		
		var stone = new Powerups(this.x,this.y, this.game, nature,false);
		//this.game.add.existing(stone);
		powerups.add(stone);
		
		stone.body.velocity.x = velocite;
		stone.body.gravity.y = 10;
	}
}

Player.prototype.move = function(){

	if (this.cursors.left.isDown)
	{
		this.isRight = false;
		this.body.velocity.x -= 50;
		if (this.playerFacing !== 'left')
		{
			this.animations.play('left');
			this.playerFacing = 'left';
		}
	}else if (this.cursors.right.isDown)
	{
		this.isRight = true;
		this.body.velocity.x += 50;
		if (this.playerFacing !== 'right')
		{
			this.animations.play('right');
			this.playerFacing = 'right';
		}
	}else 
	{
		if (this.playerFacing !== 'idle')
		{
			this.animations.stop();

			if (this.playerFacing === 'left')
			{
			   this.animations.play('idleLeft');
			}
			else
			{
			   this.animations.play('idleRight');
			}

			this.playerFacing = 'idle';
	   }
	}
    if (this.cursors.up.isDown && this.body.touching.down)
    {
		this.body.velocity.y = -400;
    }
    if (!this.body.touching.down)
	{
        if (this.playerFacing === 'left')
            this.frame = 12;
        else if (this.playerFacing === 'idle')
            this.frame = 13;
        else if (this.playerFacing === 'right')
            this.frame = 14;
    }
    if (!this.body.touching.down && this.cursors.down.isDown)
	{
        this.body.acceleration.y = 2000;
    }
    if (this.body.touching.down && this.cursors.down.isDown)
	{
		// CROUCH
        if (this.actionKey_shift.isDown && this.body.y < 1000){
        	this.body.checkCollision.down = false;
    	}
    }
    if (this.actionKey_shift.isUp || this.body.y > 1000){
    	this.body.checkCollision.down = true;
    }
}

Player.prototype.creationTurret = function(){
	if (this.nbrTurrets < this.maxTurrets){
		this.turrets.add(new Turret(this.x + 30, this.y + 14,this.game));
		this.nbrTurrets++;
	}
}


Player.prototype.manageSpeed = function(){

	if (this.actionKey_shift.isDown){
		this.maxspeed = MAX_SPEED * 1.5
	}
	else{
		this.maxspeed = MAX_SPEED;
	}

	if (this.body.velocity.x > this.maxspeed){
		this.body.velocity.x = this.maxspeed;
	}
	if (this.body.velocity.x < -this.maxspeed){
		this.body.velocity.x = -this.maxspeed;
	}
	if (this.body.velocity.x > 0){
		this.body.velocity.x -= this.friction;
		if(this.body.velocity.x < 0){
			this.body.velocity.x = 0;
		}
	}
	if (this.body.velocity.x < 0){
		this.body.velocity.x += this.friction;
		if(this.body.velocity.x > 0){
			this.body.velocity.x = 0;
		}
	}	
}

Player.prototype.collisionPlayerPowerUp = function(player, powerups){
	
	if(!powerups.collidePlayer)return;
	if(player.health < 10) player.health++;
	switch(powerups.key){
		case 'redstone':
			player.numberStoneRed++;
			break;
		case 'greenstone':
			player.numberStoneGreen++;
			break;
		case 'bluestone':
			player.numberStoneBlue++;
			break;
		case 'turret':
			player.nbrTurrets--;
			break;
	}
	powerups.alive = false;
}

Player.prototype.upGradeTurret = function(turret, powerups){
	
	switch(powerups.key){
		case 'redstone':
			if(turret.kind === 3){
				turret.rayon = turret.rayon + 50;
			}else{
				turret.kind = 3;
			}
			break;
		case 'greenstone':
			if(turret.kind === 2){
				turret.cooldown = turret.cooldown-500;
			}else{
				turret.kind = 2;
			}
			break;
		case 'bluestone':
			if(turret.kind === 1){
				turret.numberEnemyShoot++;
			}else{
				turret.kind = 1;
			}
			break;
	}
	turret.domage = turret.domage + 0.1;
	powerups.alive = false;
	
}

Player.prototype.hurt = function(dmg){
    this.health -= (dmg/100)/this.def;  	
}

Player.prototype.hurtPlayer = function(player, enemies){
    
    if(this.game.time.now > player.timerDomage){
        player.health -= enemies.domage / this.def;
        player.timerDomage = this.game.time.now + 1000;
        this.tint = 0xff0000;
    }
    
}

Player.prototype.hurtEnnemie = function(bullet,enemy){
	enemy.hurt(this.domage*50);
	bullet.needDestroy = true;
}

Player.prototype.hurtTurret = function(turret, enemies){
    
    if(this.game.time.now > enemies.timerDomage){
		if(!turret.bonus3){
			turret.hp = 0;
		}
        enemies.timerDomage = this.game.time.now + 3000;
    }
    
}