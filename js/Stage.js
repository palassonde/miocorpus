Stage = function(game, player, enemy){

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
	
	
	//Jungle
	this.timeJungleSpwan = 0;
	this.domageJ = 1;
	this.nbrMissileJ = 1;
	this.cooldownJ = 8000;
	this.hpJ = 100;
	this.royonJ = 450;
	this.nbResMax = 10;
	
	this.jungleEnemy = new MasterTurret(2150, 50, this.game,this.domageJ,this.nbrMissileJ,this.cooldownJ,this.hpJ,this.royonJ, this.nbResMax);
	enemy.add(this.jungleEnemy);
	
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
	this.changeBackgroundColor(time.now % 50000); //%50000 pour 5 min (boucle)

	if(this.timeJungleSpwan !== 0 && this.timeJungleSpwan < this.game.time.now){
		this.createJungle(enemies);
		this.timeJungleSpwan = 0;
	}
	
    if ((this.newWave && (this.timeWave < this.game.time.now)) 
		|| ((this.timeEscorte < this.game.time.now) && this.enemieToSpwan>0 && !this.newWave)){
		
		if(this.newWave){
			this.waveCount++;
			GUI.displayWave(this.waveCount);
			this.newWave = false;
		}
		
		this.timeEscorte = this.game.time.now + 3000;
        this.createWave(enemies, GUI);

    }
	
	//Si tout les ennemie son créer
	if(enemies.children.length === 1 && !this.newWave){
		if(this.waveCount%10 === 0){
			enemiesByWave = enemiesByWave * 2;
		}else{
			enemiesByWave = enemiesByWave +5;
		}
		this.timeWave = this.game.time.now + 15000; //A chaque 15 seconde
		this.enemieToSpwan = enemiesByWave;
		this.newWave = true;
	}
	
}

Stage.prototype.changeBackgroundColor = function (time){

	//Changement plus foncé pour les 2.5 premiere minutes
	//0.0052 = (130/25000) fait varié de 130 -> 0 pour rouge
	//0.00532 = (253-120/25000) fait varié de 253 -> 120 pour vert
    if(time <= 25000){
         var red = (130 - 0.0052*time);
         var green = (253 - 0.00532*time);
    }else{
         var timeMod = time % 25000;
         var red = (0.0052*timeMod);
         var green = (120 + 0.00532*timeMod);
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
	this.p = this.platforms.create(2050-1050,500,'platform');



    this.p.scale.setTo(0.4, 0.5);



	
	this.p = this.platforms.create(2050-1050,400,'platform');
    this.p.scale.setTo(0.4, 0.5);

	
	this.p = this.platforms.create(2050-840,400,'platform');
    this.p.scale.setTo(0.4, 0.5);
	
	this.p = this.platforms.create(2050-630,400,'platform');
    this.p.scale.setTo(0.4, 0.5);
	
	this.p = this.platforms.create(2050-420,400,'platform');
    this.p.scale.setTo(0.4, 0.5);
	
	this.p = this.platforms.create(2050-210,400,'platform');
    this.p.scale.setTo(0.4, 0.5);
	
	this.p = this.platforms.create(2050,400,'platform');
    this.p.scale.setTo(0.4, 0.5);
		



	
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

}

Stage.prototype.slowEnemy = function(skin, enemy) {

    enemy.slowDown();
}

Stage.prototype.createJungle = function(enemy) {
	
	this.nbResMax += 10; //Nbr de ressource max (1 à nbResMax)
	this.hpJ += 500; 
	this.domageJ += 1;
	this.nbrMissileJ += 1;
	this.cooldownJ -= 200;
	
	this.jungleEnemy.reviveJungle(this.hpJ, this.domageJ, this.nbrMissileJ, this.cooldownJ, this.nbResMax);

}


Stage.prototype.createWave = function(enemies, GUI){
	
	//Wave boss
	if(this.waveCount%10 ===0){
		//Bird
		var hpBoss = 100*this.waveCount;
		var speedBoss = 10;
		var chanceBoss = 1;
		var nbItemBoss = 10;
		var domageBoss = 3;
		
		enemies.add(new Minion(2000,700, this.game, speedBoss,hpB,3, chanceBoss, nbItemBoss, domageBoss));
		this.enemieToSpwan = 0;
	}else{


		//Zombie
		var hpZ = 40+ 10*this.waveCount;
		var speedZ = 30;
		var chanceD = 0.8;
		var nbItem = 1;
		var domageZ = 1;
		
		enemies.add(new Minion(2000, 1100, this.game, speedZ,hpZ,1, chanceD, nbItem,domageZ));
		this.enemieToSpwan--;
		//Ajout du Bird
		if(this.waveCount>=3){
			//Bird
			var hpB = 10+ 10*this.waveCount;
			var speedB = 50;
			var chanceB = 0.8;
			var nbItemB = 2;
			var domageB = 1;
			
			var numberEnemie = 4; 
			if(this.enemieToSpwan < numberEnemie){
				numberEnemie = this.enemieToSpwan;
			}
			for (var i = 0; i < numberEnemie; i++) {
				enemies.add(new Minion(2000, 700 + 100*i, this.game, speedB,hpB,2, chanceB, nbItemB,domageB));
				this.enemieToSpwan--;
			}	
		}

		//Ajout du jumper
		if(this.waveCount>=7){

			var numberEnemie = 5; //5 jumper a fois (si on peu apparaitre moins on change)
			if(this.enemieToSpwan < numberEnemie){
				numberEnemie = this.enemieToSpwan;
			}
			
			for (var i = 0; i < numberEnemie; i++) {
				speed = 40 * (Math.random() + 1);
				this.createEnemy(enemies, 2000, 700 + 100*i, speed,40+ 10*this.waveCount);
				this.enemieToSpwan--;
			}	
		}



		//Ajout du Puker
		if(this.waveCount>=12){
			var hpP = 40+ 10*this.waveCount;
			var speedP = 30;
			var chanceP = 0.8;
			var nbItemP = 1;
			var domageP = 1;
			enemies.add(new Puker(2050, 1100, this.game, speedP,hpP,this.player,chanceP,nbItemP,domageP));
		}



		//Ajout du Lapin
		if(this.waveCount>=15){
	
		}
	}

}
//enemies.add(new Kamikaze(x, y, this.game, speed,hp, this.player));