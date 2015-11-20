Stage = function(game, player){

	this.game = game;
    this.player = player;

    // Constantes

	this.background_image = game.add.sprite(0,0, 'fond_degrader');
    this.background_image.fixedToCamera = true;
    this.game.world.setBounds(0, 0, 2200, 1200);
    this.game.camera.y = 1200;

    // Stage variables
    this.core;
    this.skin;
    this.ground;
    this.jungleGround;
    this.gameOver = false;

    enemiesByWave = 1;
    expansion = 2;
    this.waveCount = 0;

    // Full screen
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    this.game.input.onDown.add(this.fullscreen, this);
}

Stage.prototype.action = function(time, player, enemies, turrets, GUI, powerups){

    this.game.physics.arcade.collide(enemies, this.platforms);
    this.game.physics.arcade.collide(turrets, this.platforms);
	this.game.physics.arcade.collide(powerups, this.platforms);

    this.game.physics.arcade.overlap(enemies, this.skin, this.slowEnemy, null, this);
    this.game.physics.arcade.overlap(enemies, this.core, this.endGame, null, this);
	
	if(player.health === 0){
		this.endGame();
	}
	
	this.moveCamera(player);
	this.changeBackgroundColor(time.now % 10);

    if (enemies.length === 0){
        this.createWave(time, enemies, GUI);
    }
	
	//Verifie collision au powerups
	this.game.physics.arcade.overlap(player, powerups, this.collisionPlayerPowerUp, null, this);
	this.game.physics.arcade.overlap(turrets, powerups, this.upGradeTurret, null, this);
	
	//Verifie collision du joueur sur l'ennemie
	this.game.physics.arcade.overlap(player, enemies, this.hurtPlayer, null, this);
}

Stage.prototype.collisionPlayerPowerUp = function(player, powerups){
	
	if(player.health < 10) player.health++;
	if(!powerups.collidePlayer)return;
	
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
	}
	powerups.alive = false;
}

Stage.prototype.upGradeTurret = function(turret, powerups){
	
	switch(powerups.key){
		case 'redstone':
			turret.kind = 3;
			break;
		case 'greenstone':
			turret.kind = 2;
			break;
		case 'bluestone':
			turret.kind = 1;
			break;
	}
	powerups.alive = false;
	
}

Stage.prototype.hurtPlayer = function(player, enemies){
	
	if(this.game.time.now > player.timerDomage){
		player.health--;
		player.timerDomage = this.game.time.now + 3000;
	}
	
}
Stage.prototype.changeBackgroundColor = function (time){

    if(time <= 50000){
         var red = (120 - 0.0022*time);
         var green = (253 - 0.002*time);
    }else{
         var timeMod = time % 50000;
         var red = (0.0022*timeMod + 10);
         var green = (153 + 0.002*timeMod);
    }

    this.game.stage.backgroundColor = "#" + ((1 << 24) + (red << 16) + (green << 8) + 255).toString(16).slice(1);

}

Stage.prototype.moveCamera = function(player){

    this.game.camera.x = player.x -512 ;

        if (player.y < 570){
            if (this.game.camera.y > 30){
                this.game.camera.y -= 15;
            }
        }else {
        if (this.game.camera.y < 600){
            this.game.camera.y += 15;
        }
    }
}

Stage.prototype.createPlatforms = function(){

	this.platforms = this.game.add.group();
    this.platforms.enableBody = true;
    this.ground = this.platforms.create(0,1170,'platform');
    this.ground.scale.setTo(10,2);
    this.jungleGround = this.platforms.create(0,600,'platform');
    this.jungleGround.scale.setTo(10,1);

    var x = 300;

    for (var j = 0; j < 5; j++){
        if(j % 2 === 0){
            for(var i = 0; i < 4 ; i++){
                var y = 1050 - (i * 110) ;
                this.p = this.platforms.create(x,y,'platform');
                this.p.scale.setTo(0.7,0.5);
            }
        } else {
            for(var i = 0; i < 3 ; i++){
                var y = 1000 - (i * 110) ;
                this.p = this.platforms.create(x,y,'platform');
                this.p.scale.setTo(0.7,0.5);
            }
        }
        x += 400;
    }

    this.platforms.setAll('body.immovable', true);
    this.platforms.setAll('body.checkCollision.down', false);
    this.platforms.setAll('body.checkCollision.left', false);
    this.platforms.setAll('body.checkCollision.right', false);

    this.jungleGround.body.checkCollision.down = true;
}

Stage.prototype.createObjects = function(){

	this.core = this.game.add.sprite(-10,600, 'core');
    this.skin = this.game.add.sprite(60,600, 'skin');
    this.game.physics.enable(this.core, Phaser.Physics.ARCADE);
    this.game.physics.enable(this.skin, Phaser.Physics.ARCADE);
}

Stage.prototype.fullscreen = function() {

    if (this.game.scale.isFullScreen)
    {
        this.game.scale.stopFullScreen();
    }
    else
    {
        this.game.scale.startFullScreen(false);
    }

}

Stage.prototype.createEnemy = function(enemies, x, y, speed){

	enemies.add(new Enemy(x, y, this.game, speed));
}

Stage.prototype.slowEnemy = function(skin, enemy) {

    enemy.slowDown();
}

Stage.prototype.endGame = function() {

    this.gameOver = true;
    this.player.kill();

}

Stage.prototype.createWave = function(time, enemies, GUI){

    for (var i = 0; i < enemiesByWave; i++) {
        speed = 40 * (Math.random() + 1);
        this.createEnemy(enemies, 2000, 960, speed);
    }
    
    enemiesByWave = enemiesByWave * expansion;
    this.waveCount++;
    GUI.displayWave(this.waveCount);

}
