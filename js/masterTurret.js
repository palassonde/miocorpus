MasterTurret = function(x,y,game,domage,nbrMissile,cooldown,hp, rayon, nbResMax){

	Phaser.Sprite.call(this, game, x, y, 'boss');
	this.animations.add('left', [0,1,2], 5, true);
	this.animations.add('notMove', [0], 5, true);
	this.anchor.x = 0.5;
	this.anchor.y = 0.1;
	scalex = 0.3;
	
	this.scale.x = scalex;
	this.scale.y = 0.3;
	this.game.physics.enable(this, Phaser.Physics.ARCADE);
	this.body.gravity.y = 500;
	this.body.collideWorldBounds = true;
	
	this.time = 0;

	// sons
	explosionMusic = game.add.audio('turretneutretir');
	drum1 = game.add.audio('drum1');
	this.distance = 1000;
	enemyhurt = game.add.audio('enemyhurt');
	
	//Caractéristique
	this.hp = hp;
	this.nbrMissile = nbrMissile;
	this.cooldown = cooldown;
	this.domage = domage;
	this.rayon = rayon;
	this.cooldownTemp = 0;
	this.turretList = [];
	this.changeTurretList = [];
	this.nbResMax = nbResMax;
	
	//Missile
	this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
	
	this.spikes = game.add.group();
    this.spikes.enableBody = true;
	this.eventFire;
	this.nbrExplose = 3;
	this.currentNbrExplose = 1;
	
	//Mouvement
	this.tween;
	this.direction;
	this.timePause = 0;
	this.moveLeft();
}

MasterTurret.prototype = Object.create(Phaser.Sprite.prototype);

MasterTurret.prototype.moveRigth = function(){
	this.tween = this.game.add.tween(this).to( { x: this.x+800}, 15000);
	this.tween.onComplete.add(this.moveLeft,this);
	this.tween.start(3000);
	this.animations.play('left');
	this.scale.x = -scalex;
	this.direction = 'right';
}

MasterTurret.prototype.moveLeft = function(){
	this.tween = this.game.add.tween(this).to( { x: this.x-800}, 15000);
	this.tween.onComplete.add(this.moveRigth,this);
	this.tween.start(3000);
	this.animations.play('left');
	this.scale.x = scalex;
	this.direction = 'left';
}

MasterTurret.prototype.reviveJungle = function(hp,domage,nbr,cooldown,nrRessource){
	this.revive();
	this.hp = hp;
	this.nbrMissile = nbr;
	this.cooldown = cooldown;
	this.domage = domage;
	this.nbResMax = nrRessource;
	this.cooldownTemp = 0;
	this.x = 2100;
	this.y = 50;
	
	//Refaire bullet
	this.bullets = this.game.add.group();
    this.bullets.enableBody = true;
	this.eventFire;
	
	//Mouvement
	this.direction;
	this.timePause = 0;
	this.moveLeft();
}

MasterTurret.prototype.action = function(a,b,stage,player){	

	//Mort
	var distancePlayerJungle = Phaser.Point.distance(this.position, player.position);
	if ((distancePlayerJungle < this.distance) && !drum1.isPlaying && player.y < 570 && this.alive){
		drum1.play('',0,1,true);
	}else if(distancePlayerJungle > this.distance || player.y >= 570 || !this.alive){
		drum1.stop();
	}
	
	//Mort
	if(this.alive === false){
		return;
	}
	if (this.hp <= 0){
		this.createResource();
		stage.timeJungleSpwan = this.game.time.now + 100000; //fait reaparaitre apres 1 min
		for(var x in this.bullets.children){
			this.bullets.children[x].graphic.destroy();
		}
		this.bullets.destroy();
        this.kill();
		this.tween.stop();
		this.game.time.events.remove(this.eventFire);
		return;
    }

	this.time += this.game.time.elapsed; //Garde le temps lors de son dernier tir

	var cooldown = this.cooldownTemp;
	
	this.turretList = [];
	this.changeTurretList = [];
	
	//Liste des enemie attaquer par un laser et liste de missile a changer de target
	for(var x in this.bullets.children){
		if(this.bullets.children[x].behavior === 3){
			this.turretList.push(this.bullets.children[x].target);
		}
		if(this.bullets.children[x].needChangeTarget){
			this.changeTurretList.push(this.bullets.children[x]);
		}
	}
	
	//Change le target du missile
	for(var x in this.changeTurretList){
		
		if(this.turretList.indexOf(player) === -1){
			this.changeTurretList[x].target = player;
			this.changeTurretList[x].needChangeTarget = false;
			this.turretList.push(player);
			continue;
		}
		
		for (var y in player.turrets.children){
			if(this.turretList.indexOf(player.turrets.children[y]) !== -1){
				continue; //Si l'ennemie est deja target
			}
			
			var dis = Phaser.Point.distance(this.position, player.turrets.children[y].position);
			if(dis < this.rayon){
				this.changeTurretList[x].target = player.turrets.children[y];
				this.changeTurretList[x].needChangeTarget = false;
				this.turretList.push(player.turrets.children[y]); //Garde concience de l'ennemie attaquer
			}
		}
	}
	
	//tirer un nouveau bullet;	
	if (cooldown <= this.time){	
		this.shootMissile(player,cooldown); 
	}
	
	//Action des missile
	for(var x in this.bullets.children){
		this.bullets.children[x].actionMissile();
	}
	
	//Verifier une collision
	this.game.physics.arcade.overlap(player, this.bullets, this.collisionMissile, null, this);
	this.game.physics.arcade.overlap(player, this.spikes, this.collisionMissile, null, this);
	//this.game.physics.arcade.overlap(player.turrets, this.bullets, this.collisionMissile, null, this);
	
	//Restart annimation
	if(this.tween.isPaused && this.timePause <= this.game.time.now){
		this.animations.play('left');
		this.tween.resume();
		this.timePause = 0;
	}

}

MasterTurret.prototype.createResource = function(){
	powerups.add(new Powerups(this.x,this.y,this.game,'redstone', true, Math.floor(this.nbResMax * Math.random())+1));
	powerups.add(new Powerups(this.x,this.y,this.game,'greenstone', true, Math.floor(this.nbResMax * Math.random())+1));
	powerups.add(new Powerups(this.x,this.y,this.game,'bluestone', true, Math.floor(this.nbResMax * Math.random())+1));
}

MasterTurret.prototype.collisionMissile = function(cible,bullet){
	if(bullet.behavior ===  2 || bullet.behavior ===  4){
		if(bullet.timeDomageEffet < this.game.time.now){
			cible.hurt(this.domage*25);
			bullet.timeDomageEffet = this.game.time.now + 1000;
		}
	}else{
		cible.hurt(this.domage*100);
		bullet.needDestroy = true;
	}
}


//Créer un missile s'il est a une bonne distance et remet un cooldown qui depend du nombre de missile lancé
MasterTurret.prototype.shootMissile = function (player,cooldown){
	var maxEnemy = this.nbrMissile; // Combien d'enemi qu'il peu tirer a la fois
	
	var isShoot = false; 
	
	//Vise le player
	var dis = Phaser.Point.distance(this.position, player.position);
	if(dis < this.rayon){
		this.bullets.add( new Bullet(this.x, this.y,this.game,player,this.rayon, 1, this.domage, 4000));
		//this.bullets.add( new Bullet(this.x, this.y,this.game,player,this.rayon, 2, this.domage, 4000));
		this.bullets.add( new Bullet(this.x, this.y,this.game,player,this.rayon, 3, this.domage, 4000));
		maxEnemy -= 1;
		if(!isShoot){
			this.currentNbrExplose = 1;
			this.explode(0);
		}
		isShoot = true;
	}

	
	for (var x in player.turrets.children){
		
		//Arret la boucle s'il ne peut plus tirer
		if(maxEnemy <= 0){
			break; 
		}
		
		dis = Phaser.Point.distance(this.position, player.turrets.children[x].position);
		//Tir
		if(dis < this.rayon){
			this.bullets.add( new Bullet(this.x, this.y,this.game,player.turrets.children[x],this.rayon, 1, this.domage, 5000));
			//this.bullets.add( new Bullet(this.x, this.y,this.game,player.turrets.children[x],this.rayon, 2, this.domage, 5000));
			this.bullets.add( new Bullet(this.x, this.y,this.game,player.turrets.children[x],this.rayon, 3, this.domage, 5000));
			maxEnemy -= 1;
			if(!isShoot){
				this.currentNbrExplose = 1;
				this.explode(0);
			}
			isShoot = true;
		}
	}
	
	if(isShoot){
		this.tween.pause();
		this.timePause = this.game.time.now + 4000;
		this.animations.play('notMove');
		this.time = 0;
		this.cooldownTemp = this.cooldown;
	}
}

MasterTurret.prototype.explode = function(angleDebut){

    var angle = angleDebut * (Math.PI/180);

    if (this.alive){

        for (var i = 0; i < 10 ; i++) {

            spike = this.spikes.create(this.x,this.y, 'bullet');
            spike.body.velocity.x = Math.cos(angle) * 200;
            spike.body.velocity.y = Math.sin(angle) * 200;
            spike.lifespan = 4000;
            angle += ((2 * Math.PI) / 10);
        }
        explosionMusic.play();
    }
	
	if(this.currentNbrExplose>=this.nbrExplose) return;
	
	this.currentNbrExplose++;
	
	if(angleDebut === 0){
		this.eventFire = this.game.time.events.add(1000, this.explode,this,18);
	}else{
		this.eventFire = this.game.time.events.add(1000, this.explode,this,0);
	}

}

MasterTurret.prototype.hurt = function(dmg, behavior){

	if (!(behavior ===  3)){
		enemyhurt.play();
	}

    this.hp -= dmg;    
}