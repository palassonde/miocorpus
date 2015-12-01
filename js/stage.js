Stage = function(game, player, enemy){

	this.game = game;
    this.player = player;

    // sons
    transitionup = this.game.add.audio('transitionup');
    transitiondown = this.game.add.audio('transitiondown');

    // Constantes
	this.background_image = game.add.sprite(0,0, 'fond_etoile');
	this.background_image.alpha = 0;
	game.add.tween(this.background_image).to( { alpha: 1 }, 25000, Phaser.Easing.Exponential.InOut, true, 0, -1, true);
    // this.background_image.fixedToCamera = true;
    this.game.world.setBounds(0, 0, 2200, 1200);
    this.game.camera.y = 1200;

    this.buildings = game.add.sprite(30,600, 'fond1');
    this.buildings.alpha = 0.5;

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
	
	//Jungle
	this.timeJungleSpwan = 0;
	this.domageJ = 1;
	this.nbrMissileJ = 1;
	this.cooldownJ = 8000;
	this.hpJ = 500;
	this.royonJ = 450;
	this.nbResMax = 10;
	
	this.jungleEnemy = new MasterTurret(2150, 50, this.game,this.domageJ,this.nbrMissileJ,this.cooldownJ,this.hpJ,this.royonJ, this.nbResMax);
	enemy.add(this.jungleEnemy);
	
	//Boss
	this.nbItemBoss = 0;
	
	//Kamikaze
	this.IsShoot = false;
	this.eventKami;
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
	if(enemies.children.length === 1 && !this.newWave && this.enemieToSpwan<=0){
		
		//Maximum de 105 ennemie a fois
		if(enemiesByWave < 105){
			enemiesByWave = enemiesByWave + 4;
		}
		this.timeWave = this.game.time.now + 15000; //A chaque 15 seconde
		this.enemieToSpwan = enemiesByWave;
		this.newWave = true;
		
		if(this.IsShoot){
			this.game.time.events.remove(this.eventKami);
			this.IsShoot = false; //Kamiakaze
		}

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
                if (!transitionup.isPlaying){
                	transitionup.play();
                }
                
            }
        }else {
        if (this.game.camera.y < 600){
            this.game.camera.y += 15;
            if (!transitiondown.isPlaying){
                	transitiondown.play();
            }
        }
    }
}

Stage.prototype.createPlatforms = function(){

    this.platforms = this.game.add.group();
    this.platforms.enableBody = true;

    this.grass = this.game.add.sprite(0,1140, 'grass');
    this.grass.bringToTop();
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

Stage.prototype.slowEnemy = function(skin, enemy) {

    enemy.slowDown();
}

Stage.prototype.createJungle = function(enemy) {
	
	this.nbResMax += 10; //Nbr de ressource max (1 à nbResMax)
	this.hpJ += 500; 
	this.domageJ += 1;
	
	if(this.nbrMissileJ < 5){
		this.nbrMissileJ += 1;
	}
	if(this.cooldownJ > 1000){
		this.cooldownJ -= 1000;
	}
	
	this.jungleEnemy.reviveJungle(this.hpJ, this.domageJ, this.nbrMissileJ, this.cooldownJ, this.nbResMax);

}


Stage.prototype.createWave = function(enemies, GUI){
	
	//Wave boss
	if(this.waveCount%10 ===0){

		//Boss
		var hpBoss = 100*this.waveCount;

		var speedBoss = 50;
		var chanceBoss = 1;
		this.nbItemBoss += 10;
		var domageBoss = 3;
		
		enemies.add(new Minion(2000,800, this.game, speedBoss,hpBoss,3, chanceBoss, this.nbItemBoss, domageBoss));
		this.enemieToSpwan = 0;
	}else{

		//Zombie
		var hpZ = 50+ 10*(this.waveCount-1);
		var speedZ = 50;
		var chanceD = 0.5;
		var nbItem = 1;
		var domageZ = 1;
		
		enemies.add(new Minion(2000, 1100, this.game, speedZ,hpZ,1, chanceD, nbItem,domageZ));
		this.enemieToSpwan--;
		
		//Ajout du Bird
		if(this.waveCount>=3){
			//Bird
			var hpB = 10+ 10*(this.waveCount-1);

			var chanceB = 0.3;
			var nbItemB = 2;
			var domageB = 1;
			
			var numberEnemie = 4; 
			if(this.enemieToSpwan < numberEnemie){
				numberEnemie = this.enemieToSpwan;
			}
			for (var i = 0; i < numberEnemie; i++) {
				var speedB = Math.floor(Math.random()*(21)+50); //50 - 70
				enemies.add(new Minion(2000, 700 + 100*i, this.game, speedB,hpB,2, chanceB, nbItemB,domageB));
				this.enemieToSpwan--;
			}	
		}

		//Ajout du jumper
		if(this.waveCount>=7){

			var numberEnemie = 3; //5 jumper a fois (si on peu apparaitre moins on change)
			if(this.enemieToSpwan < numberEnemie){
				numberEnemie = this.enemieToSpwan;
			}
			
			var hpJ = 100+ 10*(this.waveCount-1);
			var chanceJ = 0.7;
			var nbJ = 3;
			var domage = 1;
			
			for (var i = 0; i < numberEnemie; i++) {
				var speed = Math.floor(Math.random()*(31)+40); //40 - 70			

				enemies.add(new Enemy(2000, 700 + 100*i, this.game, speed,hpB, chanceJ, nbJ,domage));
				this.enemieToSpwan--;
			}	
		}

		//Ajout du Puker
		if(this.waveCount>=12){
			
			if(this.enemieToSpwan < 1){
				return; //Si le nombre ennemie est atteint
			}
			
			var hpP = 200+ 10*(this.waveCount-1);
			var speedP = 40;
			var chanceP = 0.7;
			var nbItemP = 4;
			var domageP = 2;
			enemies.add(new Puker(2050, 1000, this.game, speedP,hpP,this.player,chanceP,nbItemP,domageP));
			this.enemieToSpwan--;
		}

		//Ajout du Lapin
		if(this.waveCount >= 12){
			
			if(!this.IsShoot && this.enemieToSpwan > 0){
				this.createKamikaze(enemies);
				this.IsShoot = true;
			}
	
		}
	}

}

Stage.prototype.createKamikaze = function(enemies) {
		this.enemieToSpwan--;		
		var hpP = 70+ 10*(this.waveCount-1);
		var speedP = 500;
		var chanceP = 1;
		var nbItemP = 5;
		var domageP = 3;
		enemies.add(new Kamikaze(2050, 1000, this.game, speedP,hpP,this.player,chanceP,nbItemP,domageP));
			
		var timeRandom = Math.floor((5)*Math.random() + 8); // 8 - 12
		this.eventKami = this.game.time.events.add(timeRandom * 1000, this.createKamikaze,this,enemies);	
		
}