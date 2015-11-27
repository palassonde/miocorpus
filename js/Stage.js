Stage = function(game, player){

	this.game = game;
    this.player = player;

    // Constantes
	this.background_image = game.add.sprite(0,0, 'fond_degrader');
    this.background_image.fixedToCamera = true;
    this.game.world.setBounds(0, 0, 2200, 1200);
    this.game.camera.y = 1200;

    // Stage variables
    this.skin = this.game.add.sprite(-200,0, 'skin');
    this.ground;
    this.jungleGround;
    this.gameOver = false;

    enemiesByWave = 5;
    expansion = 2;
    this.waveCount = 0;
	this.timeWave = 0;
	this.timeEscorte = 0;
	this.newWave = true;
	this.enemieToSpwan = 5;

    // Full screen
    this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
    //this.game.input.onDown.add(this.fullscreen, this);
	
}

Stage.prototype.action = function(time, player, enemies, turrets, GUI, powerups){

    this.game.physics.arcade.collide(enemies, this.platforms);
    this.game.physics.arcade.collide(turrets, this.platforms);
	this.game.physics.arcade.collide(powerups, this.platforms);

    this.game.physics.arcade.overlap(enemies, this.skin, this.slowEnemy, null, this);
	
	if(player.health <= 0 && this.gameOver === false){
        this.gameOver = true;
		GUI.endGame(this.waveCount);
	}
	
	this.moveCamera(player);
	this.changeBackgroundColor(time.now);

	
    if ((this.newWave && (this.timeWave < this.game.time.now)) 
		|| ((this.timeEscorte < this.game.time.now) && this.enemieToSpwan>0 && !this.newWave)){
		
		if(this.newWave){
			this.waveCount++;
			GUI.displayWave(this.waveCount);
			this.newWave = false;
		}
		
		this.timeEscorte = this.game.time.now + 2000;
        this.createWave(enemies, GUI);
		
		//Si tout les ennemie son créer
		if(this.enemieToSpwan === 0){
			if(this.waveCount%10 === 0){
				enemiesByWave = enemiesByWave * 2;
			}else{
				enemiesByWave = enemiesByWave +5;
			}
			this.enemieToSpwan = enemiesByWave;
			this.newWave = true;
			this.timeWave = this.game.time.now + 30000; //A chaque 30 seconde
		}
    }
	
}

Stage.prototype.changeBackgroundColor = function (time){

    if(time <= 500){
         var red = (120 - 0.0022*time);
         var green = (253 - 0.002*time);
    }else{
         var timeMod = time % 500;
         var red = (0.0022*timeMod + 10);
         var green = (153 + 0.002*timeMod);
    }

    //this.game.stage.backgroundColor = "#" + ((1 << 24) + (red << 16) + (green << 8) + 255).toString(16).slice(1);
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

    this.grass = this.game.add.sprite(0,1140, 'grass');
    this.ground = this.platforms.create(0,1170, 'ground');
    
    this.game.physics.enable(this.skin, Phaser.Physics.ARCADE);
    this.jungleGround = this.platforms.create(0,600, 'jungleground');

    var x = 300;

    for (var j = 0; j < 5; j++){
        if(j % 2 === 0){
            for(var i = 0; i < 4 ; i++){
                var y = 1050 - (i * 110);
                this.p = this.platforms.create(x,y,'platform');
                this.p.scale.setTo(0.7, 0.5);
            }
        } else {
            for(var i = 0; i < 3 ; i++){
                var y = 1000 - (i * 110);
                this.p = this.platforms.create(x,y,'platform');
                this.p.scale.setTo(0.7, 0.5);
            }
        }
        x += 400;
    }

	//Creat jungle plateform
	this.p = this.platforms.create(2000-50,500,'platform');
    this.p.scale.setTo(0.2, 0.5);
		
	this.p = this.platforms.create(2000-300,400,'platform');
    this.p.scale.setTo(0.2, 0.5);
		
	this.p = this.platforms.create(2000-550,300,'platform');
    this.p.scale.setTo(0.2, 0.5);
	
	this.p = this.platforms.create(2000-550,450,'platform');
    this.p.scale.setTo(0.2, 0.5);
		
	this.p = this.platforms.create(2000-800,400,'platform');
    this.p.scale.setTo(0.2, 0.5);
		
	this.p = this.platforms.create(2000-1050,500,'platform');
    this.p.scale.setTo(0.2, 0.5);

	
    this.platforms.setAll('body.immovable', true);
    this.platforms.setAll('body.checkCollision.down', false);
    this.platforms.setAll('body.checkCollision.left', false);
    this.platforms.setAll('body.checkCollision.right', false);
    this.jungleGround.body.checkCollision.down = true;


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

Stage.prototype.createEnemy = function(enemies, x, y, speed,hp){

	enemies.add(new Enemy(x, y, this.game, speed,hp));
    enemies.add(new Kamikaze(x, y, this.game, speed,hp, this.player));
}

Stage.prototype.slowEnemy = function(skin, enemy) {

    enemy.slowDown();
}


Stage.prototype.createWave = function(enemies, GUI){
	
	//Wave boss
	if(this.waveCount%10 ===0){
		
		this.enemieToSpwan = 0;
	}else{
		for (var i = 0; i < 5; i++) {
			speed = 40 * (Math.random() + 1);
			this.createEnemy(enemies, 2000, 700 + 100*i, speed,40+ 10*this.waveCount);
			this.enemieToSpwan--;
		}
		//Ajout d'un nouveau monstre
		if(this.waveCount>=5){
				
		}
		//Ajout d'un nouveau monstre
		if(this.waveCount>=15){
				
		}
		//Ajout d'un nouveau monstre
		if(this.waveCount>=25){
			//Montre de wave boos 1?	
		}
	}

}
