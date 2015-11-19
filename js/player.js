Player = function (x, y, game) {

	// Constantes
	MAX_SPEED = 300;

	this.hp = 100;

	// Player attributes
	this.maxspeed = MAX_SPEED;
	this.friction = 20;

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
	this.cursors = this.game.input.keyboard.createCursorKeys();	
	
	
	//Turrets
	this.maxTurrret = 10;
	this.nbrTurrets = 0;

	this.turrets = this.game.add.group();
    this.turrets.enableBody = true;
    this.turrets.physicsBodyType = Phaser.Physics.ARCADE;
}

Player.prototype = Object.create(Phaser.Sprite.prototype);

Player.prototype.action = function(platforms, enemy){
	this.body.acceleration.y = 0;
	this.game.physics.arcade.collide(this, platforms);

	this.move();
	this.manageSpeed();
	
	for (var x in this.turrets.children){
		this.turrets.children[x].actionTurret(enemy);
	}
}

Player.prototype.move = function(){

	if (this.cursors.left.isDown)
	{
		this.body.velocity.x -= 50;
		if (this.playerFacing !== 'left')
		{
			this.animations.play('left');
			this.playerFacing = 'left';
		}
	}else if (this.cursors.right.isDown)
	{
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
	if (this.maxTurrret >= this.nbrTurrets){
        this.nbrTurrets++;
		this.turrets.add(new Turret(this.x + 30, this.y + 14,this.game));
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