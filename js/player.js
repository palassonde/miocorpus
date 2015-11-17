Player = function (x, y, game, turrets) {
	// Create the sprite
	Phaser.Sprite.call(this, game, x, y, "player")
	this.game.physics.enable(this, Phaser.Physics.ARCADE);

	this.body.gravity.y = 600;
	this.body.collideWorldBounds = true;

	this.animations.add('idleRight', [0,1,2], 5, true);
	this.animations.add('idleLeft', [9,10,11], 5, true);
	this.animations.add('right', [3,4,5], 5, true);
	this.animations.add('left', [6,7,8], 5, true);
	this.anchor.set(0.5);
	this.playerFacing = 'right';
	this.animations.play('idleRight')

	// Controls
	this.actionKey = this.game.input.keyboard.addKey(Phaser.Keyboard.T); 
    this.actionKey.onDown.add(this.creationTurret, this);
	
	this.actionKey2 = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
	
	this.cursors = this.game.input.keyboard.createCursorKeys();
	
	
	//Turrets
	this.maxTurrret = 10;
	this.nbrTurrets = 0;
	this.turrets = this.game.add.group();
    this.turrets.enableBody = true;
    this.turrets.physicsBodyType = Phaser.Physics.ARCADE;
}

Player.prototype = Object.create(Phaser.Sprite.prototype);

Player.prototype.creationTurret = function(){
	if (this.body.touching.down && this.maxTurrret >= this.nbrTurrets){
        this.nbrTurrets++;
		this.turrets.add(new Turret(this.x + 30, this.y + 14,this.game));
	}
}

Player.prototype.action = function(platforms, enemy){

	this.game.physics.arcade.collide(this, platforms, null, this.passerAtravers, this);

	// Refresh changed values
    this.body.velocity.x = 0;
    this.body.acceleration.y = 0;

	this.move();
	
	for (var x in this.turrets.children){
		this.turrets.children[x].actionTurret(enemy);
	}
}

Player.prototype.passerAtravers = function(player, platform){		
	return !this.actionKey2.isDown;
}

Player.prototype.move = function(){

	if (this.cursors.left.isDown)
	{
		this.body.velocity.x = -300;

		if (this.playerFacing !== 'left')
		{
			this.animations.play('left');
			this.playerFacing = 'left';
		}
	}else if (this.cursors.right.isDown)
	{
		this.body.velocity.x = 300;

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
    }else if (this.body.touching.down && this.cursors.down.isDown)
	{

        // crouching
        if (this.cursors.down.shiftKey){

        	console.log("yes im here");

        	this.body.checkCollision.down = false;
    	}
    }

   
}